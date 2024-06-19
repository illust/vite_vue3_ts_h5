<template>
  <van-tabbar v-model="active" route>
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

<style scoped></style>
