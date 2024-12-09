<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Blues. OC Maker</h2>
        <p>创建您的账号</p>
      </div>
      <div class="form-content">
        <div class="form-group">
          <label>用户名</label>
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            :maxlength="32"
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
            :maxlength="32"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            :maxlength="32"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="form-actions">
          <el-button 
            type="primary" 
            :loading="isRegistering"
            @click="handleRegister"
          >
            注册
          </el-button>
          <div class="login-link">
            已有账号？
            <router-link to="/login">立即登录</router-link>
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
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'

export default defineComponent({
  name: 'RegisterView',

  components: {
    User,
    Lock
  },

  setup() {
    const router = useRouter()
    const isRegistering = ref(false)

    const form = reactive({
      username: '',
      password: '',
      confirmPassword: ''
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
      if (!form.confirmPassword) {
        ElMessage.warning('请确认密码')
        return false
      }
      if (form.password !== form.confirmPassword) {
        ElMessage.warning('两次输入的密码不一致')
        return false
      }
      if (form.password.length < 6) {
        ElMessage.warning('密码长度不能少于6位')
        return false
      }
      return true
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      try {
        isRegistering.value = true
        await register({
          username: form.username.trim(),
          password: form.password
        })
        ElMessage.success('注册成功')
        router.push('/login')
      } catch (error: any) {
        form.password = ''
        form.confirmPassword = ''
      } finally {
        isRegistering.value = false
      }
    }

    return {
      form,
      isRegistering,
      handleRegister
    }
  }
})
</script>

<style scoped>
.register-container {
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

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h2 {
  color: #2c3e50;
  font-size: 28px;
  margin: 0 0 10px;
}

.register-header p {
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

.login-link {
  font-size: 0.95rem;
  color: #4a5568;
}

.login-link a {
  color: #8B5CF6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #7C3AED;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    margin: 20px;
    padding: 30px;
  }
}
</style> 