<template>
  <div class="container">
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
</style>
