<template>
  <div class="container">
    <h1
      style="
        width: 70%;
        text-align: center;
        display: flex;
        position: relative;
        z-index: 10000;
        left: calc(50% - 890px);
        flex-direction: row;
        justify-content: center;
        align-items: center;
      "
    >
      <img src="/src/assets/image/logo.png" style="flex: 1" />
      <el-tabs v-model="activeName" type="card" style="flex: 3" @tab-click="handleClick">
        <el-tab-pane label="文章" name="first"></el-tab-pane>
        <el-tab-pane label="项目" name="second"></el-tab-pane>
        <el-tab-pane label="日常" name="third"></el-tab-pane>
        <el-tab-pane label="简介" name="fourth"></el-tab-pane>
      </el-tabs>
    </h1>
    <van-swipe :autoplay="3000" lazy-render style="width: 100%; height: 1000px">
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" style="background-size: 100% 100%" />
      </van-swipe-item>
    </van-swipe>
    <div
      class="icp"
      style="
        position: fixed;
        bottom: 20px;
        left: calc(50% - 89px);
        color: darkolivegreen;
        display: flex;
        border-top: 0.01rem solid #d1d1d1;
      "
    >
      <a href="https://beian.miit.gov.cn/" target="_blank" style="color: darkolivegreen"
        >京ICP备2024068845号-1</a
      >
      <div class="ga" style="display: flex; align-items: center">
        <img src="/src/assets/image/gongan.png" style="width: 16px; margin-left: 20px" alt="" />
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=11010102007217"
          rel="noreferrer"
          target="_blank"
          style="color: darkolivegreen"
          >京公网安备11010102007217</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeName = ref('second')
const handleClick = (e: any) => {
  console.log(e)
}
const images = ['/cover1.jpg', '/cover2.jpg', '/cover3.jpg']
</script>

<style lang="scss" scoped>
.container {
  :deep(.el-tabs) {
    --el-tabs-header-height: 18px;
  }
  :deep(.el-tabs__header) {
    margin: 0 0;
  }
  :deep(.el-tabs__item) {
    font-size: 6px;
  }
}
</style>
