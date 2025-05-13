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
        position: absolute;
      "
    >
      <img src="/src/assets/image/logo.png" style="flex: 1" />
      <el-tabs
        v-model="activeName"
        type="card"
        style="flex: 3; margin-left: 50px"
        @tab-click="handleClick"
      >
        <el-tab-pane label="文章" name="first"></el-tab-pane>
        <el-tab-pane label="项目" name="second"></el-tab-pane>
        <el-tab-pane label="日常" name="third"></el-tab-pane>
        <el-tab-pane label="简介" name="fourth"></el-tab-pane>
      </el-tabs>
    </h1>
    <!-- <van-swipe :autoplay="3000" lazy-render style="width: 100%; height: 1000px">
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" style="background-size: 100% 100%" />
      </van-swipe-item>
    </van-swipe> -->
    <div class="threeCanvas">
      <canvas ref="canvasContainer" class="canvasContainer"></canvas>
    </div>
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
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, ref } from 'vue'
const activeName = ref('second')
const handleClick = (e: any) => {
  console.log(e)
}
// const images = ['/cover1.jpg', '/cover2.jpg', '/cover3.jpg']
const initThreeScene = () => {
  const canvas = document.getElementsByClassName('canvasContainer')[0] as HTMLCanvasElement
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  console.log('🚀 ~ canvas:', canvas)

  ///// SCENE CREATION
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#000000')

  ///// RENDERER CONFIG
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas }) // turn on antialias
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
  // renderer.outputEncoding = THREE.sRGBEncoding // set color encoding

  ///// CAMERAS CONFIG
  const camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 1, 5000)
  // camera.position.set(34, 16, -20)
  camera.position.set(3, 1, 30)
  scene.add(camera)

  ///// MAKE EXPERIENCE FULL SCREEN
  window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
  })

  ///// CREATE ORBIT CONTROLS
  const controls = new OrbitControls(camera, renderer.domElement)

  /////////////////////////////////////////////////////////////////////////
  ///// SCENE LIGHTS
  const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
  scene.add(ambient)

  const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
  sunLight.position.set(-69, 44, 14)
  scene.add(sunLight)

  //// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
  const dracoLoader = new DRACOLoader()
  const loader = new GLTFLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  loader.setDRACOLoader(dracoLoader)

  ///// LOADING GLB/GLTF MODEL FROM BLENDER
  loader.load('models/3d_dragon.glb', function (gltf) {
    const model = gltf.scene
    scene.add(model)

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log('Found a mesh:', child.name)
      } else if (child instanceof THREE.Group) {
        console.log('Found a group:', child.name)
      } else {
        console.log('Found Other type of object:', child.type, child.name)
      }
    })
  })

  //// INTRO CAMERA ANIMATION USING TWEEN
  const introAnimation = () => {
    controls.enabled = false //disable orbit controls to animate the camera

    new TWEEN.Tween(camera.position.set(26, 4, -35))
      .to(
        {
          // from camera position
          x: 16, //desired x position to go
          y: 50, //desired y position to go
          z: -0.1, //desired z position to go
        },
        6500,
      ) // time take to animate
      .delay(1000)
      .easing(TWEEN.Easing.Quartic.InOut)
      .start() // define delay, easing
      .onComplete(function () {
        //on finish animation
        controls.enabled = true //enable orbit controls
        setOrbitControlsLimits() //enable controls limits
        TWEEN.remove(this) // remove the animation from memory
      })
  }

  const setOrbitControlsLimits = () => {
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    controls.minDistance = 35
    controls.maxDistance = 60
    controls.enableRotate = true
    controls.enableZoom = true
    controls.maxPolarAngle = Math.PI / 2.5
  }
  // introAnimation()

  const rendeLoop = () => {
    TWEEN.update() // update animations

    controls.update() // update orbit controls

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(rendeLoop) //loop the render function
  }
  rendeLoop()
}

onMounted(() => {
  initThreeScene()
})
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
