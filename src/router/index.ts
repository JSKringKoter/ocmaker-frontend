import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MyOc from '@/views/MyOc.vue'
import OcDetail from '@/views/OcDetail.vue'
import LoginView from '@/views/LoginView.vue'
import SettingsView from '@/views/SettingsView.vue'
import NotFound from '@/views/NotFound.vue'

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
    path: '/oc/:id',
    name: 'ocDetail',
    component: OcDetail,
    props: true,
    meta: {
      title: 'OC详情',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册'
    },  
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: '设置',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局路由守卫 - 检查登录状态和设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} | Blues. OC Maker`

  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 从 localStorage 获取登录状态
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
