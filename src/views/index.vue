<template>
  <div class="container">
    <div class="fillin-col">
      <div v-for="r in 10" :key="r" class="fillin-row">
        <input
          v-for="c in 10"
          :key="c"
          type="text"
          maxlength="1"
          :class="[highLight ? 'highlight' : '', `r${r}-c${c}`]"
        />
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
      <div class="middle-puz">{{ puzShow }}</div>
      <div class="right-control">
        <button
          class="right-btn"
          style="width: 32px; height: 32px"
          @click="clickRightButton"
        ></button>
      </div>
    </div>
  </div>
  <a
    href="https://beian.miit.gov.cn/"
    style="position: fixed; bottom: 2px; left: calc(50% - 89px)"
    target="_blank"
    >京ICP备2024063915号-1</a
  >
  <!-- <bottom-nav></bottom-nav> -->
</template>

<script setup lang="ts">
// import BottomNav from '@/components/BottomNav/index.vue';
import { onMounted, ref } from 'vue'
const highLight = ref(false)
const puzShow = ref('')

// 固定位置input置为disabled
const disabledInputIndies = ref([
  '.r1-c8',
  '.r1-c10',
  '.r2-c2',
  '.r2-c4',
  '.r2-c5',
  '.r2-c6',
  '.r2-c7',
  '.r3-c2',
  '.r3-c6',
  '.r3-c9',
  '.r4-c1',
  '.r4-c2',
  '.r4-c4',
  '.r4-c6',
  '.r4-c7',
  '.r4-c8',
  '.r4-c9',
  '.r5-c2',
  '.r5-c4',
  '.r5-c7',
  '.r5-c9',
  '.r6-c4',
  '.r6-c6',
  '.r6-c7',
  '.r7-c1',
  '.r7-c3',
  '.r7-c4',
  '.r7-c9',
  '.r7-c10',
  '.r8-c1',
  '.r8-c5',
  '.r8-c6',
  '.r8-c7',
  '.r9-c3',
  '.r9-c7',
  '.r9-c8',
  '.r9-c9',
  '.r9-c10',
  '.r10-c1',
  '.r10-c2',
  '.r10-c5',
  '.r10-c10',
])
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
const heightLightInput = () => {
  let adjInputsArray: string[] = []

  // 自动选定第一个输入框元素，并设置样式
  const inputFirst = document.querySelector('input') as HTMLElement
  if (inputFirst) {
    inputFirst.classList.add('highlight')
    inputFirst.style.borderColor = 'green'
    inputFirst.style.borderRadius = '1px'
    inputFirst.style.borderStyle = 'solid'
    adjInputsArray = getAdjInputsArray(1, 1, true)
    setCurrInputsBackground(adjInputsArray)
  }

  // 获取所有的输入框元素
  const inputs = document.querySelectorAll('input')
  let lastClickedInput = 'r1-c1'
  let lastInputsArray: any = adjInputsArray
  // 遍历每个输入框，为其添加点击事件监听器
  inputs.forEach((input) => {
    input.addEventListener('click', (e) => {
      // 相邻两次点击不是同一个input
      if (e.target.classList[0] !== lastClickedInput) {
        inputDirection.value = true
        lastClickedInput = e.target.classList[0]
      } else {
        inputDirection.value = !inputDirection.value
      }

      // 获取当前坐标
      const rowIndex = parseInt(input.classList[0].split('-')[0].match(/\d+/)[0])
      const colIndex = parseInt(input.classList[0].split('-')[1].match(/\d+/)[0])
      // true:横向 false:竖向
      if (inputDirection.value) {
        adjInputsArray = getAdjInputsArray(rowIndex, colIndex, true)
      } else {
        adjInputsArray = getAdjInputsArray(rowIndex, colIndex, false)
      }
      setCurrInputsBackground(adjInputsArray)
      removeLastInputsBackground(lastInputsArray)
      lastInputsArray = adjInputsArray

      // 移除所有输入框的高亮样式
      inputs.forEach((i) => {
        i.classList.remove('highlight')
        i.style.border = 'none'
      })
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

// row or col : 3, arr: [1,5,10],return [1,5]
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
    input.style.backgroundColor = '#bbb5b5'
  }
}

const rowPuzzles = ref([
  '1.辛弃疾《南乡子·登京口北固亭有怀》中的一句，上句为天下英雄谁敌手？曹刘。',
  '2.1905年谭鑫培主演的中国第一部电影。',
  '3.2022年6月17日下水的我国第三艘航空母舰的名字。',
  '4.湖北省宜昌市下辖区。区内有三峡人家、三峡大坝等旅游景点。',
  '5.一年生草本植物，是人类最早使用的天然植物纤维。具有吸汗、透气性良好和对人体无害等特点。',
  '6.由罗维执导，李小龙主演的影片。',
  '7.蔡依林演唱的歌曲。翻唱自BWO空壳乐队的歌曲Sunshine in the Rain。崔惟楷填词。',
  '8.中国香港的一个渡轮码头，位于香港岛湾仔海旁，邻近香港会议展览中心。',
  '9.巴西职业足球运动员罗纳尔多的绰号。',
  '10.将宽度不等的多个黑条和空白，按照一定的编码规则排列，用以表达一组信息的图形标识符。',
  '11.中国台湾男歌手、音乐人。代表作《我很丑，可是我很温柔》《我是一只小小鸟》《爱要怎么说出口》《给所有知道我名字的人》。',
  '12.足球比赛中，轨迹怪异到让门将都没办法的进球。13.河北省辖县级市，以金丝小枣、鸭梨、驴肉火烧闻名。14.一家意大利汽车生产商，全球顶级跑车制造商。标志是一头充满力量的斗牛。',
])
const colPuzzles = ref([
  '一、生物体生命活动的内在节律性，由生物体内的时间结构序所决定。',
  '二、一种高级煤，具有明亮的金属光泽。密度比较大，可雕刻加工。',
  '三、由尚敬执导，闫妮、沙溢、姚晨、喻恩泰、姜超、王莎莎等主演的章回体古装情景喜剧。',
  '四、由加布里尔·穆奇诺执导，威尔·史密斯、贾登·史密斯、桑迪·牛顿等主演的电影。',
  '五、当代作家梁晓声创作的长篇小说，获第十届茅盾文学奖。',
  '六、由王万东、焦晓雨执导，范志博、胡可、黑子主演的军事题材电视剧。',
  '七、欧洲中部国家，首都华沙。',
  '八、明万历皇帝及皇后陵寝，位于北京市昌平区大峪山东麓。',
  '九、新闻资讯客户端，北京字节跳动科技有限公司开发。',
  '十、中国内地男演员，出演《蓝宇》《天龙八部》。',
  '十一、唐代韦应物《秋夜寄邱员外》中的一句，下句为幽人应未眠。',
])

const clickLeftButton = () => {
  if (puzShow.value !== rowPuzzles.value[0]) {
    const index = rowPuzzles.value.indexOf(puzShow.value)
    puzShow.value = rowPuzzles.value[index - 1]
  }
}

const clickRightButton = () => {
  if (puzShow.value !== rowPuzzles.value[9]) {
    const index = rowPuzzles.value.indexOf(puzShow.value)
    puzShow.value = rowPuzzles.value[index + 1]
  }
}

onMounted(() => {
  puzShow.value = rowPuzzles.value[0]
  disabledInput()
  heightLightInput()
  // inputTransformer()
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  .fillin-col {
    display: flex;
    flex: 4;
    flex-direction: column;
    width: 100vw;
    height: auto;
    position: relative;
    .fillin-row {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      input {
        width: 10%;
        background-color: #bbb5b5;
        border-radius: 2px;
        margin: 2px 2px;
        text-align: center;
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
        border: none !important;
      }
    }

    .middle-puz {
      flex: 6;
      height: 50%;
      border: solid rgb(67, 117, 190) 2px;
    }

    .right-control {
      flex: 1;
      border: none !important;
      text-align: center;
      vertical-align: middle;
      .right-btn {
        background: url('@/assets/image/right-button-fill.png') no-repeat;
        background-size: 100% 100%;
        border: none !important;
      }
    }
  }

  // .highlight {
  //   border-color: limegreen !important;
  //   border-radius: 1px;
  //   border-style: solid;
  //   box-sizing: border-box;
  // }
}
</style>
