<template>
  <div class="container">
    <div class="fillin-col">
      <div v-for="r in 10" :key="r" class="fillin-row">
        <div v-for="c in 10" :key="c" style="width: 9.95%">
          <input
            type="text"
            maxlength="1"
            :class="[highLight ? 'highlight' : '', `r${r}-c${c}`]"
            @input="inputChange"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
          />
        </div>
      </div>
    </div>
    <div class="puzzles">
      <div class="left-control">
        <button
          class="left-btn"
          style="width: 32px; height: 32px"
          @click="clickLeftButton"
        ></button>
      </div>
      <div class="middle-puz">
        <van-notice-bar :text="puzShow" />
      </div>
      <div class="right-control">
        <button
          class="right-btn"
          style="width: 32px; height: 32px"
          @click="clickRightButton"
        ></button>
      </div>
    </div>
    <div class="header">{{ userInfo.userName }}</div>
    <!-- <submit-button></submit-button> -->
    <div class="submit-button">
      <van-button
        type="primary"
        class="submit-btn"
        style="width: 100px; height: 40px; position: absolute; bottom: 120px"
        @click="submitPuzzles"
        >提交</van-button
      >
    </div>
  </div>
  <van-floating-bubble
    axis="xy"
    icon="clock"
    magnetic="x"
    :offset="offset"
    class="bubble"
    @click="clickOnBubble"
    @offset-change="onOffsetChange"
  >
    <template #default>
      <van-count-down class="count-down" :time="time" format="HH:mm:ss" />
    </template>
  </van-floating-bubble>
  <van-popup v-model:show="showCenter" round :style="{ padding: '64px' }"
    >您的正确率为：{{ score }}</van-popup
  >
  <bottom-nav></bottom-nav>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'
import { getAccessToken, getPhoneNumber, getUserInfo } from '@/service/api/miniprog/getPhoneNumber'
import { getPuzzles, postSubmitPuzzles } from '@/service/api/puzzle/getPuzzles'
import { usePageStore } from '@/store'
import { cntChineseChars, findMissingCoordinates, transPuzzlePosition } from '@/utils/transform'
import wx from 'weixin-js-sdk'
// import SubmitButton from '@/components/SubmitButton/index.vue'
import { showToast } from 'vant'
import { onMounted, Ref, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const highLight = ref(false)
const puzShow = ref('')
const pageStore = usePageStore()
const showCenter = ref(false) // 是否显示得分弹窗
const score = ref(0) // 得分

// 固定位置input置为disabled,黑色输入框
const disabledInputIndies = ref([])
// 水平、竖直方向输入框数字标识索引数组
const horInputNumInx = ref([])
const verInputNumInx = ref([])
const numHanzi = ref([
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
])
const curNumIndex = ref('')

const disabledInput = () => {
  for (let i = 0; i < disabledInputIndies.value.length; i++) {
    const disInput = document.querySelector<HTMLElement>(disabledInputIndies.value[i])
    if (disInput) {
      disInput.disabled = true
      disInput.style.backgroundColor = 'black'
    }
  }
}

/**
 * 词盘点击输入算法：
 *    1.任意点击一个input，通过取class判断得到横纵索引indies<number>[]
 *    2.根据输入方向inputDirection确定左右或者上下相邻输入框是否同时为disabled：
 *        2.1 点击输入框时inputDirection默认为true，即横向，先判断左右输入框是否均为disabled
 *        2.2 是则置inputDirection为false，纵向输入，上下遍历选择不为disabled的若干输入框作为单个词条整体
 *        2.3 否则不变，横向输入，左右遍历选择不为disabled的若干输入框作为单个词条整体
 *        2.4 注意边界情况
 *    3.如果在同一个输入框再次点击，切换输入方向，在对应方向上遍历出单个词条
 *    4.如果点击其他输入框，重复步骤2,3
 */
const inputDirection = ref(true) // 输入方向：true:横向 false:纵向
const currInput = ref('')
const inputFirstLoc = ref('')
const adjInputsArray = ref<string[]>([]) // 邻接输入框坐标数组

const heightLightInput = () => {
  // 自动选定横向第一个词语的第一个汉字输入框元素，并设置样式
  const row = parseInt(inputFirstLoc.value.split('.')[1].split('-')[0].slice(1))
  const col = parseInt(inputFirstLoc.value.split('.')[1].split('-')[1].slice(1))
  console.log('inputFirstLoc', row, col)
  const inputFirst = document
    .querySelector(`.fillin-col .fillin-row:nth-child(${row}) > div:nth-child(${col})`)
    ?.querySelector('input') as HTMLElement
  console.log('inputFirst', inputFirst)

  if (inputFirst) {
    // inputFirst.focus()
    inputFirst.classList.add('highlight')
    inputFirst.style.borderColor = 'green'
    inputFirst.style.borderRadius = '1px'
    inputFirst.style.borderStyle = 'solid'
    adjInputsArray.value = getAdjInputsArray(row, col, true)
    setCurrInputsBackground(adjInputsArray.value)

    const elNew = document.createElement('span')
    elNew.setAttribute('class', 'my_input_preffix')
    elNew.style.position = 'absolute'
    elNew.style.marginLeft = '3px'
    elNew.style.marginTop = '3px'
    elNew.style.fontSize = '12px'
    elNew.innerHTML = '1'
    inputFirst?.parentNode?.insertBefore(elNew, inputFirst)
  }

  // 获取所有的输入框元素
  const inputs = document.querySelectorAll('input')
  let lastClickedInput = 'r1-c1'
  currInput.value = '.r1-c1'
  let lastInputsArray: any = adjInputsArray.value
  // 遍历每个输入框，为其添加点击事件监听器
  inputs.forEach((input) => {
    input.addEventListener('click', (e) => {
      const spans = document.getElementsByClassName('my_input_preffix')
      // 遍历这些元素，并逐个删除
      if (spans) {
        for (let i = spans.length - 1; i >= 0; i--) {
          spans[i].parentNode.removeChild(spans[i])
        }
      }

      // 相邻两次点击不是同一组input
      if (e.target.classList[0] !== lastClickedInput) {
        inputDirection.value = true
        lastClickedInput = e.target.classList[0]
      } else {
        inputDirection.value = !inputDirection.value
      }

      // 获取当前坐标
      const rowIndex = parseInt(input.classList[0].split('-')[0].match(/\d+/)[0])
      const colIndex = parseInt(input.classList[0].split('-')[1].match(/\d+/)[0])
      currInput.value = '.' + input.classList[0]

      // true:横向 false:竖向
      if (inputDirection.value) {
        adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, true)
        if (adjInputsArray.value.length === 1) {
          inputDirection.value = !inputDirection.value
          adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, inputDirection.value)
        }
      } else {
        adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, false)
        if (adjInputsArray.value.length === 1) {
          inputDirection.value = !inputDirection.value
          adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, inputDirection.value)
        }
      }
      removeLastInputsBackground(lastInputsArray)
      removeLastInputsBackground(lastClickArray.value)
      setCurrInputsBackground(adjInputsArray.value)

      if (inputDirection.value) {
        curNumIndex.value = (horInputNumInx.value.indexOf(adjInputsArray.value[0]) + 1).toString()
        puzShow.value = rowPuzzles.value[horInputNumInx.value.indexOf(adjInputsArray.value[0])]
      } else {
        curNumIndex.value = numHanzi.value[verInputNumInx.value.indexOf(adjInputsArray.value[0])]
        puzShow.value = colPuzzles.value[verInputNumInx.value.indexOf(adjInputsArray.value[0])]
      }

      const el = document.querySelector(adjInputsArray.value[0])
      const elNew = document.createElement('span')
      elNew.setAttribute('class', 'my_input_preffix')
      elNew.style.position = 'absolute'
      elNew.style.marginLeft = '3px'
      elNew.style.marginTop = '3px'
      elNew.style.fontSize = '12px'
      elNew.innerHTML = curNumIndex.value
      el?.parentNode?.insertBefore(elNew, el)

      console.log('adjInputsArray.value', toRaw(adjInputsArray.value))

      lastInputsArray = adjInputsArray.value

      // 移除所有输入框的高亮样式
      inputs.forEach((i) => {
        i.classList.remove('highlight')
        i.style.border = 'none'
      })
      console.log('inputt', input)
      // 给当前点击的输入框添加高亮样式
      input.classList.add('highlight')
      // 设置高亮样式的边框属性
      input.style.borderColor = 'green'
      input.style.borderRadius = '1px'
      input.style.borderStyle = 'solid'
    })
  })
}

/**
 *
 * @param rowIndex 横坐标
 * @param colIndex 纵坐标
 * @param inputDirection 输入方向
 * @returns 邻接输入框坐标数组
 */
const getAdjInputsArray = (
  rowIndex: number,
  colIndex: number,
  inputDirection: boolean,
): string[] => {
  const adjInputsArray = []

  const result = inputDirection
    ? disabledInputIndies.value.filter((item) => item.startsWith('.r' + rowIndex + '-'))
    : disabledInputIndies.value.filter((item) => item.endsWith('-c' + colIndex))

  const inxArr = inputDirection
    ? result.map((e) => parseInt(e.match(/\d+/g)[1]))
    : result.map((e) => parseInt(e.match(/\d+/g)[0]))

  const adjIndies = inputDirection
    ? selectInputIndices(inxArr, colIndex)
    : selectInputIndices(inxArr, rowIndex)

  if (adjIndies[0] === undefined) {
    for (let i = 1; i < adjIndies[1]; i++) {
      inputDirection
        ? adjInputsArray.push('.r' + rowIndex + '-c' + i)
        : adjInputsArray.push('.r' + i + '-c' + colIndex)
    }
  } else if (adjIndies[1] === undefined) {
    for (let i = adjIndies[0] + 1; i <= 10; i++) {
      inputDirection
        ? adjInputsArray.push('.r' + rowIndex + '-c' + i)
        : adjInputsArray.push('.r' + i + '-c' + colIndex)
    }
  } else {
    for (let i = adjIndies[0] + 1; i < adjIndies[1]; i++) {
      inputDirection
        ? adjInputsArray.push('.r' + rowIndex + '-c' + i)
        : adjInputsArray.push('.r' + i + '-c' + colIndex)
    }
  }
  return adjInputsArray
}

// row or col element: 3, find subarr in arr: [1,5,10],return subarr: [1,5]
const selectInputIndices = (
  arr: number[],
  num: number,
): [number | undefined, number | undefined] => {
  let lessThanNum: number | undefined
  let greaterThanNum: number | undefined
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < num) {
      lessThanNum = arr[i]
    } else if (arr[i] > num) {
      greaterThanNum = arr[i]
      break
    }
  }
  return [lessThanNum, greaterThanNum]
}

// set word multiply input background
// 设置当前词条多个输入框背景颜色
const setCurrInputsBackground = (arr: string[]): any => {
  for (let i = 0; i < arr.length; i++) {
    const input = document.querySelector(arr[i])
    input.style.backgroundColor = '#49e341'
  }
}

// remove word multiply input background
// 取消上一个词条多个输入框背景颜色
const removeLastInputsBackground = (arr: string[]): any => {
  for (let i = 0; i < arr.length; i++) {
    const input = document.querySelector(arr[i])
    input.style.backgroundColor = '#d9d9d9'
  }
}

const inputValue = ref('') // 连续输入中文
const inputChange = (e: { target: { value: any } }) => {
  inputValue.value = e.target.value
  console.log('inputValue.value', inputValue.value)
  const inputIndex = toRaw(adjInputsArray.value).indexOf(currInput.value)
  console.log('input', e.target.value)
  console.log('inputIndex', inputIndex)
  for (let i = inputIndex; i < toRaw(inputValue.value).length; i++) {
    const inputEl = document.querySelector(toRaw(adjInputsArray.value)[i])
    inputEl.value = inputValue.value[i - inputIndex]
  }
}

const onCompositionStart = () => {
  console.log('compositionstart111')
}
const onCompositionEnd = () => {
  console.log('compositionend')
}

const clickOnBubble = () => {
  wx.miniProgram.navigateTo({
    url: '/pages/login/index',
  })
}

const rowPuzzles = ref<string[]>([])
const colPuzzles = ref<string[]>([])

const lastClickArray = ref<string[]>([])

const clickLeftButton = () => {
  let lastInputsArray: any = adjInputsArray.value
  if (inputDirection.value) {
    // 输入方向为横向
    if (puzShow.value !== rowPuzzles.value[0]) {
      // 遍历这些元素(词语序号)，并逐个删除
      const spans = document.getElementsByClassName('my_input_preffix')
      if (spans) {
        for (let i = spans.length - 1; i >= 0; i--) {
          spans[i].parentNode.removeChild(spans[i])
        }
      }

      const index = rowPuzzles.value.indexOf(puzShow.value)
      const coorIndies = horInputNumInx.value[index - 1] // ".r1-c1"
      const [rowIndex, colIndex] = coorIndies.match(/\d+/g).map(Number)
      adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, true)
      removeLastInputsBackground(lastInputsArray)
      setCurrInputsBackground(adjInputsArray.value)
      curNumIndex.value = (horInputNumInx.value.indexOf(adjInputsArray.value[0]) + 1).toString()

      const el = document.querySelector(adjInputsArray.value[0])
      const elNew = document.createElement('span')
      elNew.setAttribute('class', 'my_input_preffix')
      elNew.style.position = 'absolute'
      elNew.style.marginLeft = '3px'
      elNew.style.marginTop = '3px'
      elNew.style.fontSize = '12px'
      elNew.innerHTML = curNumIndex.value
      el?.parentNode?.insertBefore(elNew, el)

      console.log('adjInputsArray.value', toRaw(adjInputsArray.value))

      lastInputsArray = adjInputsArray.value
      lastClickArray.value = adjInputsArray.value

      // 移除所有输入框的高亮样式
      const inputs = document.querySelectorAll('input')
      inputs.forEach((i) => {
        i.classList.remove('highlight')
        i.style.border = 'none'
      })
      // 给每组词语的第一个输入框添加高亮
      const inputEl = document.querySelector(coorIndies)
      inputEl.classList.add('highlight')
      // 设置高亮样式的边框属性
      inputEl.style.borderColor = 'green'
      inputEl.style.borderRadius = '1px'
      inputEl.style.borderStyle = 'solid'

      puzShow.value = rowPuzzles.value[index - 1]
    }
  } else if (puzShow.value !== colPuzzles.value[0]) {
    // 遍历这些元素(词语序号)，并逐个删除
    const spans = document.getElementsByClassName('my_input_preffix')
    if (spans) {
      for (let i = spans.length - 1; i >= 0; i--) {
        spans[i].parentNode.removeChild(spans[i])
      }
    }

    const index = colPuzzles.value.indexOf(puzShow.value)
    const coorIndies = verInputNumInx.value[index - 1] // ".r1-c1"
    const [rowIndex, colIndex] = coorIndies.match(/\d+/g).map(Number)
    adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, false)
    removeLastInputsBackground(lastInputsArray)
    setCurrInputsBackground(adjInputsArray.value)
    curNumIndex.value = numHanzi.value[verInputNumInx.value.indexOf(adjInputsArray.value[0])]

    const el = document.querySelector(adjInputsArray.value[0])
    const elNew = document.createElement('span')
    elNew.setAttribute('class', 'my_input_preffix')
    elNew.style.position = 'absolute'
    elNew.style.marginLeft = '3px'
    elNew.style.marginTop = '3px'
    elNew.style.fontSize = '12px'
    elNew.innerHTML = curNumIndex.value
    el?.parentNode?.insertBefore(elNew, el)

    console.log('adjInputsArray.value', toRaw(adjInputsArray.value))

    lastInputsArray = adjInputsArray.value
    lastClickArray.value = adjInputsArray.value

    // 移除所有输入框的高亮样式
    const inputs = document.querySelectorAll('input')
    inputs.forEach((i) => {
      i.classList.remove('highlight')
      i.style.border = 'none'
    })

    // 给每组词语的第一个输入框添加高亮
    const inputEl = document.querySelector(coorIndies)
    inputEl.classList.add('highlight')
    // 设置高亮样式的边框属性
    inputEl.style.borderColor = 'green'
    inputEl.style.borderRadius = '1px'
    inputEl.style.borderStyle = 'solid'

    puzShow.value = colPuzzles.value[index - 1]
  }
}

const clickRightButton = () => {
  let lastInputsArray: any = adjInputsArray.value
  if (inputDirection.value) {
    if (puzShow.value !== rowPuzzles.value[rowPuzzles.value.length - 1]) {
      // 遍历这些元素(词语序号)，并逐个删除
      const spans = document.getElementsByClassName('my_input_preffix')
      if (spans) {
        for (let i = spans.length - 1; i >= 0; i--) {
          spans[i].parentNode.removeChild(spans[i])
        }
      }

      const index = rowPuzzles.value.indexOf(puzShow.value) + 1
      console.log('indexx', index)
      const coorIndies = horInputNumInx.value[index] // ".r1-c1"
      console.log('🚀 ~ clickRightButton ~ coorIndies:', coorIndies)
      const [rowIndex, colIndex] = coorIndies.match(/\d+/g).map(Number) //[1,1]
      adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, true)
      removeLastInputsBackground(lastInputsArray)
      setCurrInputsBackground(adjInputsArray.value)
      curNumIndex.value = (horInputNumInx.value.indexOf(adjInputsArray.value[0]) + 1).toString()

      const el = document.querySelector(adjInputsArray.value[0])
      const elNew = document.createElement('span')
      elNew.setAttribute('class', 'my_input_preffix')
      elNew.style.position = 'absolute'
      elNew.style.marginLeft = '3px'
      elNew.style.marginTop = '3px'
      elNew.style.fontSize = '12px'
      elNew.innerHTML = curNumIndex.value
      el?.parentNode?.insertBefore(elNew, el)

      console.log('adjInputsArray.value', toRaw(adjInputsArray.value))

      lastInputsArray = adjInputsArray.value
      lastClickArray.value = adjInputsArray.value

      // 移除所有输入框的高亮样式
      const inputs = document.querySelectorAll('input')
      inputs.forEach((i) => {
        i.classList.remove('highlight')
        i.style.border = 'none'
      })
      // 给每组词语的第一个输入框添加高亮
      const inputEl = document.querySelector(coorIndies)
      inputEl.classList.add('highlight')
      // 设置高亮样式的边框属性
      inputEl.style.borderColor = 'green'
      inputEl.style.borderRadius = '1px'
      inputEl.style.borderStyle = 'solid'

      puzShow.value = rowPuzzles.value[index]
    }
  } else if (puzShow.value !== colPuzzles.value[colPuzzles.value.length - 1]) {
    // 遍历这些元素(词语序号)，并逐个删除
    const spans = document.getElementsByClassName('my_input_preffix')
    if (spans) {
      for (let i = spans.length - 1; i >= 0; i--) {
        spans[i].parentNode.removeChild(spans[i])
      }
    }
    const index = colPuzzles.value.indexOf(puzShow.value) + 1

    const coorIndies = verInputNumInx.value[index] // ".r1-c1"
    const [rowIndex, colIndex] = coorIndies.match(/\d+/g).map(Number)
    adjInputsArray.value = getAdjInputsArray(rowIndex, colIndex, false)
    removeLastInputsBackground(lastInputsArray)
    setCurrInputsBackground(adjInputsArray.value)
    curNumIndex.value = numHanzi.value[verInputNumInx.value.indexOf(adjInputsArray.value[0])]

    const el = document.querySelector(adjInputsArray.value[0])
    const elNew = document.createElement('span')
    elNew.setAttribute('class', 'my_input_preffix')
    elNew.style.position = 'absolute'
    elNew.style.marginLeft = '3px'
    elNew.style.marginTop = '3px'
    elNew.style.fontSize = '12px'
    elNew.innerHTML = curNumIndex.value
    el?.parentNode?.insertBefore(elNew, el)

    console.log('adjInputsArray.value', toRaw(adjInputsArray.value))

    lastInputsArray = adjInputsArray.value
    lastClickArray.value = adjInputsArray.value

    // 移除所有输入框的高亮样式
    const inputs = document.querySelectorAll('input')
    inputs.forEach((i) => {
      i.classList.remove('highlight')
      i.style.border = 'none'
    })

    // 给每组词语的第一个输入框添加高亮
    const inputEl = document.querySelector(coorIndies)
    inputEl.classList.add('highlight')
    // 设置高亮样式的边框属性
    inputEl.style.borderColor = 'green'
    inputEl.style.borderRadius = '1px'
    inputEl.style.borderStyle = 'solid'

    puzShow.value = colPuzzles.value[index]
  }
}

const offset = ref({ x: 303, y: 28 })
const time = ref(2 * 60 * 60 * 1000)
const onOffsetChange = (offset: { x: number; y: number }) => {
  showToast(`x: ${offset.x.toFixed(0)}, y: ${offset.y.toFixed(0)}`)
}

interface UserInfo {
  id: number
  userName: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}
const userInfo = ref<UserInfo>({
  id: 0,
  userName: '',
  phoneNumber: '',
  createdAt: '',
  updatedAt: '',
})

const textBlocksLoc: Ref<string[]> = ref([])
let inputAnswers: { location: any; answer: string }[] = []
const submitPuzzles = async () => {
  inputAnswers = []
  textBlocksLoc.value.forEach((item: any) => {
    const row = parseInt(item.split(',')[0])
    const col = parseInt(item.split(',')[1])
    const input = document
      .querySelector(`.fillin-col .fillin-row:nth-child(${row}) > div:nth-child(${col})`)
      ?.querySelector('input') as HTMLInputElement
    const inputValue = input.value
    console.log('inputValue111', inputValue)
    inputAnswers.push({
      location: item,
      answer: inputValue,
    })
  })
  console.log('inputAnswers', inputAnswers)
  const body = {
    id: 2,
    phoneNumber: pageStore.phoneNumber.phoneNumber,
    answer: inputAnswers,
  }
  try {
    const response = await postSubmitPuzzles(body)
    console.log('提交成功！您的正确率为：', response)
    score.value = response
    showCenter.value = true
  } catch (error) {
    console.error('提交失败', error)
  }
  // 提交逻辑
  // try {
  //   const response = await submitPuzzles({ ...pageStore.phoneNumber, inputValues })
  //   console.log('提交成功', response)
  //   showToast('提交成功')
  // } catch (error) {
  //   console.error('提交失败', error)
  //   showToast('提交失败')
  // }
}

onMounted(async () => {
  console.log('mounted pageStore.phoneNumber', pageStore.phoneNumber)
  if (!pageStore.phoneNumber.length) {
    try {
      await getAccessToken()
      pageStore.phoneNumber = await getPhoneNumber(route.query.code)
      localStorage.setItem('phoneNumber', pageStore.phoneNumber.phoneNumber)
      userInfo.value = await getUserInfo({ ...pageStore.phoneNumber })
    } catch (error) {
      // 处理请求错误
      console.error(error)
    }
  }
  const puzzles = await getPuzzles(2)
  const horPuzzlesLoc: Array<string> = []
  const verPuzzlesLoc: Array<string> = []
  const textBlocksLocSet: Set<string> = new Set()

  const acrossClues: Array<{ [key: string]: any }> = puzzles.across_clues
  acrossClues.forEach((item: { [key: string]: any }) => {
    horPuzzlesLoc.push(transPuzzlePosition(item.location))
    rowPuzzles.value.push(item.clue)
    textBlocksLocSet.add(item.location)
    let beginIndex = parseInt(item.location.split(',')[1])
    const cnt = cntChineseChars(item.answer)
    const endIndex = beginIndex + cnt
    for (beginIndex; beginIndex < endIndex; beginIndex++) {
      textBlocksLocSet.add(item.location.split(',')[0] + ',' + beginIndex.toString())
      // console.log('beginIndex', beginIndex)
    }
  })
  const downClues: Array<{ [key: string]: any }> = puzzles.down_clues
  downClues.forEach((item: { [key: string]: any }) => {
    verPuzzlesLoc.push(transPuzzlePosition(item.location))
    colPuzzles.value.push(item.clue)
    textBlocksLocSet.add(item.location)
    let beginIndex = parseInt(item.location.split(',')[0])
    const cnt = cntChineseChars(item.answer)
    const endIndex = beginIndex + cnt
    for (beginIndex; beginIndex < endIndex; beginIndex++) {
      textBlocksLocSet.add(beginIndex.toString() + ',' + item.location.split(',')[1])
    }
  })
  console.log('textBlocksLocSet', textBlocksLocSet)
  const disabledInpt = findMissingCoordinates(textBlocksLocSet)
  console.log('disabledInpt', disabledInpt)
  disabledInputIndies.value = disabledInpt.map((item: any) => transPuzzlePosition(item))
  console.log('disabledInputIndies', disabledInputIndies.value)
  horInputNumInx.value = horPuzzlesLoc
  verInputNumInx.value = verPuzzlesLoc

  // console.log('query.code', route.query.code)

  puzShow.value = rowPuzzles.value[0]
  inputFirstLoc.value = horPuzzlesLoc[0]

  // 提交逻辑
  textBlocksLoc.value = Array.from(textBlocksLocSet)

  disabledInput()
  heightLightInput()
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .header {
    flex: 3;
    text-align: center;
    font-size: large;
  }

  .submit-button {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
  .fillin-col {
    display: flex;
    flex: 7;
    flex-direction: column;
    width: 100vw;
    height: auto;
    position: relative;
    .fillin-row {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      .my_input_preffix {
        position: absolute;
        left: 5px;
        height: 10%;
        top: 0;
        text-align: center;
        transition: all 0.3s;
        pointer-events: none;
      }
      input {
        width: 92%;
        height: 92%;
        background-color: #d9d9d9;
        border-radius: 2px;
        margin: 2px 2px;
        text-align: center;
        font-weight: bolder;
        font-size: 18px;
        border: none;
        caret-color: transparent;
        box-sizing: border-box;
      }
      input[type='text']:hover {
        box-shadow: 0 0 5pt 0.5pt #d3d3d3;
      }
      input[type='text']:focus {
        box-shadow: 0 0 5pt 2pt #d3d3d3;
        outline-width: 0px;
      }
    }
  }
  .puzzles {
    width: 100vw;
    height: 180px;
    display: flex;
    flex: 1;
    flex-direction: row;
    position: relative;
    // margin-top: 20px;

    .left-control {
      flex: 1;
      text-align: center;
      vertical-align: middle;
      .left-btn {
        background: url('@/assets/image/left-button-fill.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 5px;
        border: none !important;
      }
    }

    .middle-puz {
      flex: 8;
      height: 50%;
      // border: solid rgb(67, 117, 190) 2px;
    }

    .right-control {
      flex: 1;
      border: none !important;
      text-align: center;
      vertical-align: middle;
      .right-btn {
        background: url('@/assets/image/right-button-fill.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 5px;

        border: none !important;
      }
    }
  }
  :deep(.van-notice-bar) {
    width: 100%;
    padding: 6px !important;
  }
  :deep(.van-notice-bar__wrap) {
    width: 100%;
  }
}

.count-down {
  font-size: 11px;
  color: white;
}
</style>
