<template>
  <div class="container">
    <van-cell-group inset style="background-color: #f1f1f1; margin-bottom: 5px; margin-top: 14px">
      <van-cell title="个人信息" value="" />
      <van-cell title="昵称" value="{{ userInfo.userName }}">
        <template #value>
          <div>{{ userInfo.userName }}</div>
        </template>
      </van-cell>
      <van-cell title="手机号" value="{{ userInfo.phoneNumber }}">
        <template #value>
          <div>{{ userInfo.phoneNumber }}</div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
  <bottom-nav class="bottom"></bottom-nav>
</template>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav/index.vue'
import { getUserInfo } from '@/service/api/getPhoneNumber'
import { ref, onMounted } from 'vue'

const anchors = [Math.round(0.4 * window.innerHeight), Math.round(0.7 * window.innerHeight)]
const height = ref(anchors[0])

const userInfo = ref({})
const phoneNumber = localStorage.getItem('phoneNumber')

onMounted(async () => {
  userInfo.value = await getUserInfo({ phoneNumber })
})
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
