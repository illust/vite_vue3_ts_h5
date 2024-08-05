<template>
  <van-tabbar v-model="active" route class="bottom">
    <van-tabbar-item icon="records-o" to="/home">填字</van-tabbar-item>
    <van-tabbar-item icon="browsing-history-o" to="/history">往期</van-tabbar-item>
    <van-tabbar-item icon="fire-o" to="/explore">探索</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/mine">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts" name="BottomNav">
import { ref } from 'vue'

const active = ref(0)
</script>

<style scoped>
.bottom {
  bottom: 6px;
  width: 369px;
  margin: 0 2px 0 2px;
  background-color: rgb(40, 187, 245);
  border-radius: 8px;
  box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.5);
}
:deep(.van-tabbar-item--active) {
  color: white;
  background-color: rgb(40, 187, 245);
}
:deep(.van-tabbar-item) {
  border-radius: 8px;
  background-color: #28bbf5;
}
.bottom:after {
  border-width: 0;
}
</style>
