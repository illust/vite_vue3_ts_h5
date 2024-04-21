import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/Login'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
