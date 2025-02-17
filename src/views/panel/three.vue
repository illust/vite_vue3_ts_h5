<template>
  <div class="container">
    <canvas class="main-content"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'

onMounted(() => {
  const canvas = document.querySelector('.main-content') as HTMLCanvasElement
  // 在画布中使用three.js
  // 创建场景，相机和渲染器
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 300)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  // 添加立方体到场景中
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  // 设置相机位置
  camera.position.z = 5
  // 渲染场景
  function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.main-content {
  width: 50%;
  height: 100%;
}
</style>
