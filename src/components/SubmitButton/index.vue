<template>
  <button class="button">
    <div class="inner">
      <div class="icon">
        <div class="person">
          <div class="arm"></div>
          <div class="arm right"></div>
          <div class="leg"></div>
          <div class="leg right"></div>
        </div>
        <div class="weight"></div>
      </div>
      <div class="text">
        <span>确认提交</span>
        <span>奥里给！！</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref } from 'vue'

const confettiAmount = ref(100)
const confettiColors = ref(['#7d32f5', '#f6e434', '#63fdf1', '#e672da', '#295dfe', '#6e57ff'])

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const createConfetti = (to: Element) => {
  const elem = document.createElement('i'),
  set = Math.random() < 0.5 ? -1 : 1
  elem.style.setProperty('--x', random(-360, 360) + 'px')
  elem.style.setProperty('--y', random(-200, 200) + 'px')
  elem.style.setProperty('--r', random(0, 360) + 'deg')
  elem.style.setProperty('--s', random(0.6, 1).toString())
  elem.style.setProperty('--b', confettiColors.value[random(0, 5)])
  to.appendChild(elem)
}

onMounted(() => {
  document.querySelectorAll('.button').forEach((button) => {
    let complete = false,
      timeline = gsap.timeline({
        paused: true,
        ease: 'none',
        onComplete() {
          complete = true
          button.classList.add('complete')
          for (let i = 0; i < confettiAmount.value; i++) {
            createConfetti(button)
          }
          setTimeout(() => {
            button.classList.add('confetti')
            setTimeout(() => button.querySelectorAll('i').forEach((i) => i.remove()), 600)
          }, 300)
          // Reset
          setTimeout(() => {
            button.classList.remove('complete', 'confetti')
            complete = false
          }, 2000)
        },
      }),
      up = 0

    timeline.to(button, {
      keyframes: [
        {
          '--weight-y': -6,
          '--arm-rotate-s-x': 90,
          duration: 0.3,
        },
        {
          '--weight-y': -10,
          '--arm-rotate-s-x': 45,
          '--arm-rotate-s': 130,
          duration: 0.2,
        },
        {
          '--weight-y': -12,
          '--arm-rotate-s': 130,
          '--arm-rotate-s-x': 0,
          duration: 0.1,
        },
        {
          '--weight-y': -20,
          '--person-y': -4,
          '--arm-rotate': 100,
          '--arm-rotate-s': 90,
          '--leg-y': 0,
          '--leg-rotate': 20,
          '--leg-rotate-s': -20,
          duration: 0.2,
        },
        {
          '--weight-y': -25,
          '--arm-rotate': 150,
          '--arm-rotate-s': 30,
          duration: 0.2,
        },
      ],
    })

    button.addEventListener('click', (e) => {
      up = 1

      const rippleDiv = document.createElement('div')

      rippleDiv.className = 'ripple'

      const boundingClientRect = button.getBoundingClientRect()

      button.style.setProperty('--ripple-x', e.clientX - boundingClientRect.left)
      button.style.setProperty('--ripple-y', e.clientY - boundingClientRect.top)

      button.querySelector('.inner').appendChild(rippleDiv)

      setTimeout(() => rippleDiv.remove(), 500)
    })

    setInterval(() => {
      up = up > 0 ? up - 0.1 : 0

      const progress = timeline.progress(),
        direction = up > 0 ? 1 : -1.5

      if (!complete) {
        timeline.progress(progress + 0.01 * direction)
      }
    }, 1000 / 60)
  })
})
</script>

<style scoped lang="scss">
.button {
  --color: #f6f8ff;
  --background: #171827;
  --background-hover: #0d0f18;
  --shadow: #{rgba(#00093d, 0.12)};
  --person: #f6f8ff;
  --person-arm: var(--person);
  --person-leg: #d1d6ee;
  --weight: #275efe;
  --weight-disk: #5c86ff;
  //
  --person-y: 0;
  --weight-y: 0;
  --arm-rotate: 40;
  --arm-rotate-s: -40;
  --arm-rotate-s-x: 0;
  --leg-y: -2;
  --leg-rotate: 45;
  --leg-rotate-s: -70;
  left: calc(50% - 75px);
  width: 40%;
  bottom: 50px;
  display: table;
  outline: none;
  border: none;
  background: none;
  padding: 0;
  position: fixed;
  cursor: pointer;
  line-height: 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  .inner {
    padding: 14px 20px;
    transition:
      transform 0.2s,
      background 0.4s;
    color: var(--color);
    position: relative;
    display: flex;
    z-index: 1;
    min-width: 140px;
    border-radius: 13px;
    background: var(--b, var(--background));
    box-shadow:
      0 1px 3px var(--shadow),
      0 3px 7px var(--shadow);
    transform: scale(var(--scale, 1)) translateZ(0);
    &:active {
      --scale: 0.95;
    }
    &:hover {
      --b: var(--background-hover);
    }
  }
  .icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    display: block;
    position: relative;
    .person,
    .weight {
      position: absolute;
    }
    .person {
      top: 7px;
      left: 9px;
      width: 6px;
      height: 10px;
      transform: translateY(calc(var(--person-y) * 1px));
      &:before,
      &:after {
        content: '';
        position: absolute;
        left: 0;
      }
      &:before {
        top: -5px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--person);
        transform: scale(0.7);
        transform-origin: 50% 25%;
      }
      &:after {
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        border-radius: 2px 2px 3px 3px;
        background: var(--person);
      }
      .arm,
      .leg {
        position: absolute;
        left: var(--left, 0);
        top: var(--top, 0);
        width: 2px;
        height: 7px;
        border-radius: 1px;
        transform-origin: 1px 1px;
        background: var(--background);
        transform: translate(calc(var(--x, 0) * 1px), calc(var(--y, 0) * 1px))
          rotateZ(calc(var(--rotate, 0) * 1deg));
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 5px;
          width: 2px;
          height: 7px;
          border-radius: 1px;
          transform-origin: 1px 1px;
          background: inherit;
          transform: rotateZ(calc(var(--rotate-s, 0) * 1deg))
            rotateX(calc(var(--rotate-s-x, 0) * 1deg));
        }
        &.right {
          --left: 4px;
          transform: translate(calc(var(--x, 0) * -1px), calc(var(--y, 0) * 1px))
            rotateZ(calc(var(--rotate, 0) * -1deg));
          &:before {
            transform: rotateZ(calc(var(--rotate-s, 0) * -1deg))
              rotateX(calc(var(--rotate-s-x, 0) * 1deg));
          }
        }
      }
      .arm {
        --background: var(--person-arm);
        --rotate: var(--arm-rotate);
        --rotate-s: var(--arm-rotate-s);
        --rotate-s-x: var(--arm-rotate-s-x);
        z-index: 1;
      }
      .leg {
        --top: 8px;
        --background: var(--person-leg);
        --y: var(--leg-y);
        --rotate: var(--leg-rotate);
        --rotate-s: var(--leg-rotate-s);
      }
    }
    .weight {
      top: 17px;
      left: 0;
      width: 24px;
      height: 2px;
      border-radius: 1px;
      background: var(--weight);
      transform: translateY(calc(var(--weight-y, 0) * 1px));
      &:before,
      &:after {
        content: '';
        position: absolute;
        border-radius: 1px;
        left: var(--l, 1px);
        top: var(--t, -2px);
        width: var(--w, 2px);
        height: var(--h, 6px);
        background: var(--weight-disk);
        box-shadow: var(--bx, 20px) 0 0 var(--weight-disk);
      }
      &:after {
        --l: 3px;
        --t: -3px;
        --h: 8px;
        --bx: 16px;
      }
    }
  }
  .text {
    position: relative;
    span {
      display: block;
      white-space: nowrap;
      opacity: var(--o, 1);
      transform: translateX(var(--x, 0));
      transition:
        transform 0.3s,
        opacity 0.2s;
      &:last-child {
        --o: 0;
        --x: 8px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .ripple {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
    &:before {
      content: '';
      position: absolute;
      top: calc(var(--ripple-y, 0) * 1px);
      left: calc(var(--ripple-x, 0) * 1px);
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      width: 200%;
      padding-bottom: 200%;
      border-radius: 50%;
      background: currentColor;
      animation: ripple 0.5s ease-in;
    }
  }
  i {
    position: absolute;
    display: block;
    width: 4px;
    height: 4px;
    top: 50%;
    left: 50%;
    margin: -2px 0 0 -2px;
    opacity: var(--o, 0);
    background: var(--b);
    transform: translate(var(--x), var(--y)) scale(var(--s, 1));
  }
  &.complete {
    .text {
      span {
        &:first-child {
          --o: 0;
          --x: -8px;
        }
        &:last-child {
          --o: 1;
          --x: 0;
        }
      }
    }
    &.confetti {
      i {
        animation: confetti 0.6s ease-out forwards;
      }
    }
  }
}

@keyframes confetti {
  from {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes ripple {
  25% {
    opacity: 0.07;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: inherit;
  &:before,
  &:after {
    box-sizing: inherit;
  }
}

// Center & dribbble
body {
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', Arial;
  justify-content: center;
  align-items: center;
  background: #e4ecfa;
  .dribbble {
    position: fixed;
    display: block;
    right: 20px;
    bottom: 20px;
    img {
      display: block;
      height: 28px;
    }
  }
  .twitter {
    position: fixed;
    display: block;
    right: 64px;
    bottom: 14px;
    svg {
      width: 32px;
      height: 32px;
      fill: #1da1f2;
    }
  }
}
</style>
