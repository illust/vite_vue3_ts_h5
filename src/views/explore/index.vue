<template>
  <div class="container">
    <van-barrage v-model="list">
      <div class="video" style="width: 100%; height: 150px"></div>
    </van-barrage>
    <van-space style="margin-top: 10px">
      <van-button type="primary" size="small" @click="add"> 弹幕 </van-button>
    </van-space>
    <van-search v-model="value" shape="round" background="#4fc08d" placeholder="请输入搜索关键词" />
  </div>
  <bottom-nav></bottom-nav>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'
import { ref } from 'vue'
const defaultList = [
  { id: 100, text: '轻量' },
  { id: 101, text: '可定制的' },
  { id: 102, text: '移动端' },
  { id: 103, text: 'Vue' },
  { id: 104, text: '组件库' },
  { id: 105, text: 'VantUI' },
  { id: 106, text: '666' },
]

const list = ref([...defaultList])
const add = () => {
  list.value.push({ id: Math.random(), text: 'Barrage' })
}
</script>

<style lang="scss" scoped></style>
