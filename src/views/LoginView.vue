<template>
  <div class="login-page">
    <div class="login-container">
      <div class="form-section">
        <div class="login-header">
          <h2>Blues. OC Maker</h2>
          <p>登录您的账号</p>
        </div>

        <el-form 
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <div class="form-group">
            <label>用户名 <span class="required">*</span></label>
            <el-form-item prop="account">
              <el-input
                v-model="loginForm.account"
                placeholder="请输入用户名"
                :prefix-icon="UserFilled"
                size="large"
              />
            </el-form-item>
          </div>

          <div class="form-group">
            <label>密码 <span class="required">*</span></label>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                size="large"
              />
            </el-form-item>
          </div>

          <div class="form-options">
            <el-checkbox v-model="rememberMe" size="large">记住我</el-checkbox>
            <el-button type="text" size="large" @click="forgotPassword">忘记密码？</el-button>
          </div>

          <el-button 
            type="primary" 
            class="login-button"
            :loading="isLoading"
            size="large"
            @click="handleLogin"
          >
            登录
          </el-button>

          <div class="register-link">
            还没有账号？
            <el-button type="text" size="large" @click="goToRegister">立即注册</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { login } from '@/api/auth'  // 导入登录API

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const loginFormRef = ref<FormInstance>()
    const isLoading = ref(false)
    const rememberMe = ref(false)

    const loginForm = reactive({
      account: "",
      password: ""
    })

    const rules = {
      account: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        isLoading.value = true
        
        const response = await login({
          account: loginForm.account,
          password: loginForm.password
        })

        // 检查登录是否成功
        if (response.code === 1 && response.data) {
          // 保存token和用户名
          localStorage.setItem('token', response.data.token)
          sessionStorage.setItem('userName', response.data.name)
          
          ElMessage.success('登录成功')
          router.push('/my-oc')
        } else {
          ElMessage.error(response.msg || '登录失败')
        }
      } catch (error: any) {
        // 处理不同的错误情况
        if (error.response) {
          switch (error.response.status) {
            case 401:
              ElMessage.error('用户名或密码错误')
              break
            case 429:
              ElMessage.error('登录尝试次数过多，请稍后再试')
              break
            default:
              ElMessage.error('登录失败，请稍后重试')
          }
        }
      } finally {
        isLoading.value = false
      }
    }

    const forgotPassword = () => {
      ElMessage.info('密码找回功能开发中...')
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      loginFormRef,
      loginForm,
      rules,
      isLoading,
      rememberMe,
      handleLogin,
      forgotPassword,
      goToRegister,
      UserFilled,
      Lock
    }
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f3ff 0%, #c8e1ff 100%);
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

.login-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.form-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
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
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 16px;
}

.required {
  color: #f56c6c;
  margin-left: 4px;
}

:deep(.el-input__wrapper) {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: none;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
}

.login-button {
  width: 100%;
  padding: 12px 24px;
  font-size: 16px;
  height: auto;
  line-height: 1.5;
}

.register-link {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 16px;
}

:deep(.el-form-item__error) {
  font-size: 14px;
  padding-top: 4px;
}

@media (max-width: 600px) {
  .form-section {
    padding: 30px 20px;
  }
}
</style> 