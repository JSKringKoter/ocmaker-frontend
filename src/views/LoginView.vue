<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Blues. OC Maker</h2>
        <p>登录您的账号</p>
      </div>
      <div class="form-content">
        <div class="form-group">
          <label>用户名</label>
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="form-group">
          <label>密码</label>
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="form-actions">
          <el-button 
            type="primary" 
            :loading="isLoggingIn"
            @click="handleLogin"
          >
            登录
          </el-button>
          <div class="register-link">
            还没有账号？
            <router-link to="/register">立即注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api/auth'
import type { LoginResponse } from '@/api/auth'

export default defineComponent({
  name: 'LoginView',

  components: {
    User,
    Lock
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const isLoggingIn = ref(false)

    const form = reactive({
      username: '',
      password: ''
    })

    const validateForm = () => {
      if (!form.username.trim()) {
        ElMessage.warning('请输入用户名')
        return false
      }
      if (!form.password) {
        ElMessage.warning('请输入密码')
        return false
      }
      return true
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      try {
        isLoggingIn.value = true
        const response = await login({
          username: form.username.trim(),
          password: form.password
        })

        const data = response.data as LoginResponse
        if (data) {
          // 保存token和用户名
          localStorage.setItem('token', data.token)
          sessionStorage.setItem('userName', data.username)
          
          ElMessage.success('登录成功')
          
          // 如果有重定向地址，则跳转到重定向地址
          const redirect = route.query.redirect as string
          router.push(redirect || '/my-oc')
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        } else {
          ElMessage.error('登录失败，请重试')
        }
      } finally {
        isLoggingIn.value = false
      }
    }

    return {
      form,
      isLoggingIn,
      handleLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%);
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #2c3e50;
  font-size: 28px;
  margin: 0 0 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  padding-left: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #8B5CF6;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

:deep(.el-input__prefix) {
  margin-right: 8px;
  color: #8B5CF6;
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.el-button {
  width: 100%;
  height: 44px;
  font-size: 1.05rem;
  background: #8B5CF6;
  border-color: #8B5CF6;
  transition: all 0.3s ease;
}

.el-button:hover {
  background: #7C3AED;
  border-color: #7C3AED;
  transform: translateY(-1px);
}

.el-button:focus, .el-button:active {
  background: #6D28D9;
  border-color: #6D28D9;
}

.register-link {
  font-size: 0.95rem;
  color: #4a5568;
}

.register-link a {
  color: #8B5CF6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.register-link a:hover {
  color: #7C3AED;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 30px;
  }
}
</style> 