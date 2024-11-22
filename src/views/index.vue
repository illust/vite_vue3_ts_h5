<template>
  <div class="container">
    <canvas id="inputCanvas" width="1300" height="100"></canvas>
    <input id="hiddenInput" type="text" class="hidden-input" />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  const canvas = <HTMLCanvasElement>document.getElementById('inputCanvas')
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
  const hiddenInput = <HTMLElement>document.getElementById('hiddenInput')

  const boxWidth = 50 // 每个输入框宽度
  const boxHeight = 50 // 每个输入框高度
  const boxMargin = 2 // 输入框间隔
  const boxes: {
    x(x: any, y: any, boxWidth: number, boxHeight: number): unknown
    y(x: any, y: any, boxWidth: number, boxHeight: number): unknown
    content(content: any, arg1: any, arg2: any): unknown
    isSelected: boolean
  }[] = [] // 存储输入框的位置及内容

  // 初始化输入框数据
  for (let i = 0; i < 15; i++) {
    boxes.push({
      x: 40 + i * (boxWidth + boxMargin),
      y: 25,
      content: '',
      isSelected: false, // 是否被选中
    })
  }

  let activeBox = -1 // 当前激活的输入框

  // 绘制输入框
  function drawBoxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    boxes.forEach((box, index) => {
      if (box.isSelected) {
        ctx.strokeStyle = 'green' // 选中时为绿色
      } else {
        ctx.strokeStyle = activeBox === index ? 'blue' : 'black'
      }
      ctx.lineWidth = box.isSelected || activeBox === index ? 2 : 1

      // 绘制矩形
      ctx.strokeRect(box.x, box.y, boxWidth, boxHeight)

      // 绘制文字
      ctx.font = '20px Arial'
      ctx.fillStyle = 'black'
      ctx.textBaseline = 'middle'
      ctx.fillText(box.content, box.x + 10, box.y + boxHeight / 2)
    })
  }

  // 点击输入框
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // 找到点击的输入框
    activeBox = boxes.findIndex(
      (box) =>
        mouseX >= box.x &&
        mouseX <= box.x + boxWidth &&
        mouseY >= box.y &&
        mouseY <= box.y + boxHeight,
    )

    // 重置所有输入框的选中状态
    boxes.forEach((box) => (box.isSelected = false))
    if (activeBox !== -1) {
      boxes[activeBox].isSelected = true // 设置当前点击的输入框为选中状态
      hiddenInput.focus() // 激活隐藏输入框
    }
    drawBoxes()
  })

  // 输入中文字符
  hiddenInput.addEventListener('input', () => {
    const input = hiddenInput.value
    const chineseChars = input.match(/[\u4e00-\u9fa5]/g) // 提取中文汉字

    if (chineseChars) {
      chineseChars.forEach((char: any) => {
        if (activeBox < boxes.length) {
          boxes[activeBox].content = char // 填入当前激活框
          boxes[activeBox].isSelected = false // 清除当前框的选中状态
          activeBox++ // 激活下一个输入框
          if (activeBox < boxes.length) {
            boxes[activeBox].isSelected = true // 自动选中下一个框
          }
        }
      })
      hiddenInput.value = '' // 清空隐藏输入框
      drawBoxes()
    }
  })

  // 处理键盘事件（Backspace 和 Enter）
  hiddenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const lastFilledBoxIndex = boxes
        .map((box) => box.content)
        .lastIndexOf(boxes.find((box) => box.content !== '').content)

      if (lastFilledBoxIndex !== -1) {
        // 重置所有输入框的选中状态
        boxes.forEach((box) => (box.isSelected = false))
        boxes[lastFilledBoxIndex].isSelected = true // 选中最后一个填充框
        activeBox = lastFilledBoxIndex // 更新激活框索引
        drawBoxes()
      }
    } else if (event.key === 'Backspace') {
      if (activeBox >= 0) {
        if (boxes[activeBox].content !== '') {
          // 删除当前激活框的内容
          boxes[activeBox].content = ''
        } else if (activeBox > 0) {
          // 当前框为空，回退到前一个框并删除内容
          activeBox--
          boxes[activeBox].content = ''
        }
        boxes.forEach((box) => (box.isSelected = false)) // 清除所有选中状态
        boxes[activeBox].isSelected = true // 设置当前框为选中状态
        drawBoxes()
      }
    }
  })

  // 初次绘制
  drawBoxes()
})
</script>

<style scoped>
    canvas {
      border: 1px solid black;
      display: block;
      margin: 20px auto;
    }
    input.hidden-input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
</style>
