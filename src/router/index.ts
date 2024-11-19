import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MyOc from '@/views/MyOc.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/my-oc',
    name: 'MyOc',
    component: MyOc,
    meta: {
      title: '我的OC',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/settings',
    name: 'SettingsView',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: '设置',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Blues. OC Maker`
  next()
})

export default router
