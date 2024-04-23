<template>
  <div class="container">
    <div class="fillin-col">
      <div v-for="r in 10" :key="r" class="fillin-row">
        <input
          v-for="c in 10"
          :key="c"
          type="text"
          maxlength="1"
          :class="[highLight ? 'highlight' : '']"
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const highLight = ref(true)
const puzShow = ref('')
const leftBtnIcon = ref('@/assets/image/left-button-fill.png')
const rightBtnIcon = ref('@/assets/image/right-button-fill.png')
const rowPuzzles = ref([
  '1.梁羽生武侠小说《白发魔女传》的女主人公',
  '2.影视男演员，在古装剧《梦华录》中饰演池衙内。',
  '3.上海证券综合指数的简称，样本股是在上海证券交易所全部上市股票，自1991年7月15日起正式发布。',
  '4.日本职业花样滑冰运动员。获得2014年、2018年冬奥会男单冠军。',
  '5.民间传说中主管婚姻的红喜神，以红绳相系男女。',
  '6.台湾的现代舞蹈表演团体，1973年由林怀民创办。',
  '7.国家AAAAA级旅游景区，位于京杭大运河的中心点，山东省枣庄市和鲁苏豫皖四省交界地带。',
  '8.清宣宗爱新觉罗·旻宁的年号。',
  '9.梁羽生的武侠小说代表作之一。于1956年在《大公报》连载。',
  '10.指投保人或被保险人一次或按期交纳保险费，保险人以被保险人生存为条件，按年、半年、季或月给付保险金。',
  '11.八达岭长城的东段部分，建于险谷口。',
  '12.中国四大民间传说之一，主人公梁山伯与祝英台。',
  '13.由刘阳执导，胡歌、林依晨主演的电视剧。剧本改编自民间传说《天仙配》。',
])
const colPuzzles = ref([
  '一、由许常德、季忠平作词，季忠平作曲，许茹芸演唱的歌曲。',
  '二、由邓紫棋作词、作曲并演唱的歌曲，电影《太空旅客》的中国区主题曲。',
  '三、一种唐代的宫廷乐舞，唐玄宗作曲。',
  '四、传统观赏花卉，石蒜科，叶由鳞茎顶端绿白色筒状鞘中抽出花茎，伞状花序。',
  '五、国家AAAAA级旅游景区，位于四川省广元市剑阁县。',
  '六、在农历的每月初七、初八，月球与太阳相距90°，月球的一半被照亮的月相。',
  '七、由佐藤纯弥执导，冈田茉莉子、三船敏郎、松田优作、乔治·肯尼迪主演的影片。改编自日本作家森村诚一的《人性的证明》。',
  '八、玄幻小说《斗罗大陆》中，魂师生活的大陆，由天斗帝国和星罗帝国组成。',
  '九、中国佛教四大名山之一，位于山西省忻州市。',
  '十、由多项式组成的方程。也泛指由未知数的代数式所组成的方程，包括整式方程、分式方程和根式方程。',
  '十一、存留在岩石中的古生物遗体、遗物或遗迹，最常见的是骨头与贝壳等。',
  '十二、成语典故，语出《庄子·齐物论》。借指奇妙的梦境，或用以形容人生变幻无常。',
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

const heightLightInput = () => {
  // 获取所有的输入框元素
  const inputs = document.querySelectorAll('input')

  // 遍历每个输入框，为其添加点击事件监听器
  inputs.forEach((input) => {
    input.addEventListener('click', () => {
      // 移除所有输入框的高亮样式
      inputs.forEach((i) => i.classList.remove('highlight'))
      // 给当前点击的输入框添加高亮样式
      input.classList.add('highlight')
      // 设置高亮样式的边框属性
      input.style.borderColor = 'green'
      input.style.borderRadius = '2px'
      input.style.borderStyle = 'dotted'
    })
  })
}

onMounted(() => {
  puzShow.value = rowPuzzles.value[0]
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
    flex: 2;
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
        box-sizing: content-box;
        background-color: #bbb5b5;
        border-radius: 2px;
        margin: 1px 1px;
        text-align: center;
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
    margin-top: 20px;

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
      flex: 5;
      height: 40%;
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

  button:after {
    border: none;
  }

  .highlight {
    border-color: limegreen;
    border-radius: 1px;
    border-style: solid;
  }
}
</style>
