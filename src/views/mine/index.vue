<template>
  <div class="container">
    <van-cell-group inset style="background-color: #f1f1f1; margin-bottom: 5px; margin-top: 14px">
      <van-cell title="个人信息" value="内容" />
      <van-cell title="单元格1" value="内容1" label="描述信息1" />
      <van-cell title="单元格2" value="内容2" label="描述信息2" />
      <van-cell title="单元格3" value="内容3" label="描述信息3" />
      <van-cell title="单元格4" value="内容4" label="描述信息4" />
      <van-cell title="单元格5" value="内容5" label="描述信息5" />
    </van-cell-group>
    <van-floating-panel v-model:height="height" :anchors="anchors">
      <div style="text-align: center; padding: 15px">
        <p>面板显示高度 {{ height }} px</p>
      </div>
    </van-floating-panel>
  </div>
  <bottom-nav class="bottom"></bottom-nav>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'
import { ref } from 'vue'

const anchors = [Math.round(0.4 * window.innerHeight), Math.round(0.7 * window.innerHeight)]
const height = ref(anchors[0])
</script>

<style lang="scss" scoped>
// .container {
//   height: 100%;
//   background-color: grey;
// }
.bottom {
  z-index: 10000;
}
:deep(.van-floating-panel) {
  background-color: #fbebeb;
}
:deep(.van-floating-panel__content) {
  background-color: #fbebeb;
}
:deep(.van-cell) {
  background: #f1f1f1;
}
</style>
