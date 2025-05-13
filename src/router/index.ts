import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'icp',
    component: () => import('@/views/icp/index.vue'),
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      keepAlive: true, //设置页面是否需要使用缓存
      title: '斯文填字',
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/history',
    name: 'history',
    meta: {
      title: '斯文填字',
    },
    component: () => import('@/views/history/index.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    meta: {
      title: '斯文填字',
    },
    component: () => import('@/views/explore/index.vue'),
  },
  {
    path: '/mine',
    name: 'mine',
    meta: {
      title: '斯文填字',
    },
    component: () => import('@/views/mine/index.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = '澄昊信息科技' // 如果没有指定 title，则设置默认标题
  }
  next()
})

export default router
