import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/history/index.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/explore/index.vue'),
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/views/mine/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
