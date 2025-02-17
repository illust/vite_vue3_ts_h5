<template>
  <div class="container">
    <div ref="containerRef" class="main-content"></div>
    <input
      ref="inputRef"
      v-model="inputText"
      @keyup.enter="handleInput"
      @keyup.space="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

const containerRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const inputText = ref('')
let app: PIXI.Application
let selectedBox: PIXI.Graphics | null = null
const boxes: PIXI.Graphics[] = []
const texts: PIXI.Text[] = []

onMounted(async () => {
  if (containerRef.value) {
    // 创建 Pixi 应用
    app = new PIXI.Application()
    globalThis.__PIXI_APP__ = app
    await app.init({
      width: 400,
      height: 300,
      background: '#1099bb',
      resizeTo: window,
    })

    // 将 Pixi 画布添加到 DOM 中
    containerRef.value.appendChild(app.canvas)

    // 创建5x5的方框网格
    const boxSize = 34 // 方框尺寸
    const gap = 3 // 网格间距

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const box = new PIXI.Graphics()
        box.fill(0xffffff)
        box.rect(0, 0, boxSize, boxSize)
        box.fill()
        box.position.set(3.8 + i * (boxSize + gap), 3 + j * (boxSize + gap))

        box.eventMode = 'static'
        box.cursor = 'pointer'
        box.interactive = true

        box.on('pointerdown', () => {
          if (selectedBox) {
            selectedBox.clear() // 清除原有图形
            selectedBox.fill(0xffffff) // 重新绘制白色
            selectedBox.rect(0, 0, boxSize, boxSize)
            selectedBox.fill()
          }

          selectedBox = box
          box.clear() // 清除原有图形
          box.fill(0x00ff00) // 绘制绿色
          box.rect(0, 0, boxSize, boxSize)
          box.fill()
          // 点击方框自动聚焦输入框
          const focusInput = () => {
            inputRef.value?.focus()
            // 移除事件监听，避免重复绑定
            window.removeEventListener('mouseup', focusInput)
          }

          // 在鼠标松开时聚焦输入框
          window.addEventListener('mouseup', focusInput)
        })

        // 调整文字大小和位置
        const text = new PIXI.Text('', {
          fontSize: 20, // 增大字体大小
          fill: 0x000000,
          //fontFamily: 'Arial', // 添加字体设置
          align: 'center',
        })
        // 将文字居中显示在方框中
        text.position.set(box.x + (boxSize - text.width) / 2, box.y + (boxSize - text.height) / 2)

        app.stage.addChild(box)
        app.stage.addChild(text)

        boxes.push(box)
        texts.push(text)

        // 默认选中第一个方框（第一行第一列）
        if (i === 0 && j === 0) {
          selectedBox = box
          box.clear()
          box.fill(0x00ff00)
          box.rect(0, 0, boxSize, boxSize)
          box.fill()

          // 延迟一帧后聚焦输入框，确保DOM已经完全加载
          requestAnimationFrame(() => {
            if (inputRef.value) {
              inputRef.value.focus()
            }
          })
        }
      }
    }
  }
})

const handleInput = (event: KeyboardEvent) => {
  // 如果是空格键，阻止默认行为（防止输入框出现空格）
  if (event.key === ' ') {
    event.preventDefault()
  }
  const boxSize = 34
  // 去除输入文本两端的空格再判断
  if (selectedBox && inputText.value.trim()) {
    const startIndex = boxes.indexOf(selectedBox)
    if (startIndex !== -1) {
      // 去除输入文本两端的空格后再转换为字符数组
      const chineseChars = inputText.value.trim().match(/[\u4e00-\u9fa5]/g) // 提取中文汉字
      chineseChars?.forEach((char, offset) => {
        const currentIndex = startIndex + offset
        if (currentIndex < boxes.length) {
          // 更新文字
          texts[currentIndex].text = char

          // 位置保持居中
          const box = boxes[currentIndex]
          texts[currentIndex].position.set(
            box.x + (boxSize - texts[currentIndex].width) / 2,
            box.y + (boxSize - texts[currentIndex].height) / 2,
          )

          // 如果不是最后一个字符，将当前方框重置为白色
          if (offset < chineseChars.length - 1) {
            boxes[currentIndex].clear()
            boxes[currentIndex].fill(0xffffff)
            boxes[currentIndex].rect(0, 0, boxSize, boxSize)
            boxes[currentIndex].fill()
          }
        }
      })

      // 选中最后一个填充字符后的方框
      const nextIndex = Math.min(startIndex + chineseChars.length, boxes.length - 1)
      selectedBox = boxes[nextIndex]
      selectedBox.clear()
      selectedBox.fill(0x00ff00)
      selectedBox.rect(0, 0, boxSize, boxSize)
      selectedBox.fill()

      // 清空输入框并保持焦点
      inputText.value = ''
      if (inputRef.value) {
        inputRef.value.focus()
      }
    }
  }
}

onUnmounted(() => {
  // 销毁 Pixi 应用
  if (app) {
    app.destroy(true, { children: true, texture: true, baseTexture: true })
  }
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.main-content {
  width: 100%;
  height: 100%;
}

input {
  position: fixed;
  top: 20px;
  left: 70%;
  transform: translateX(-50%);
  padding: 5px;
  width: 100px;
  z-index: -1000;
}

input:focus {
  border-color: #00ff00; /* 聚焦时边框变绿 */
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.3); /* 添加轻微阴影效果 */
}
</style>
