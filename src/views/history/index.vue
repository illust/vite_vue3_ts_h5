<template>
  <div class="container">
    <van-grid :column-num="3" :gutter="25" :clickable="true">
      <van-grid-item
        v-for="value in 9"
        :key="value"
        icon="photo-o"
        :text="`第` + value + `期`"
        to="/"
      />
    </van-grid>
  </div>
  <bottom-nav></bottom-nav>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'
// import { ref } from 'vue';
</script>

<style lang="scss" scoped></style>
