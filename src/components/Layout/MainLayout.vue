<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <el-button type="text" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </el-button>
        <h2>Blues. OC Maker</h2>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-profile">
            <i class="fas fa-user-circle"></i>
            <span>{{ userName }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                <i class="fas fa-sign-out-alt"></i> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 侧边栏 -->
    <el-drawer
      v-model="sidebarVisible"
      direction="ltr"
      size="250px"
      :with-header="false"
      :modal="true"
      :append-to-body="true"
      class="sidebar-drawer"
    >
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>导航菜单</h3>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleSelect"
        >
          <el-menu-item index="/my-oc">
            <i class="fas fa-user-friends"></i>
            <span>我的角色</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const sidebarVisible = ref(false)
    const userName = ref('')

    onMounted(() => {
      // 从sessionStorage获取用户名
      userName.value = sessionStorage.getItem('userName') || '未登录'
    })

    const activeMenu = computed(() => route.path)

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value
    }

    const handleSelect = (key: string) => {
      router.push(key)
      sidebarVisible.value = false
    }

    const handleLogout = () => {
      // 清除登录信息
      localStorage.removeItem('token')
      sessionStorage.removeItem('userName')
      router.push('/login')
    }

    return {
      sidebarVisible,
      activeMenu,
      toggleSidebar,
      handleSelect,
      handleLogout,
      userName
    }
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.header {
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h2 {
  margin: 0;
  color: #2c3e50;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-profile i {
  font-size: 20px;
  color: #409EFF;
}

.user-profile span {
  color: #2c3e50;
  font-size: 14px;
}

.main-content {
  margin-top: 60px;
  padding: 20px;
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
  background: #f8f9fa;
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h3 {
  margin: 0;
  color: #2c3e50;
}

.sidebar-menu {
  border-right: none;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.el-drawer) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.el-drawer__container) {
  position: fixed;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .header {
    padding: 0 10px;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .header-left h2 {
    font-size: 1.2rem;
  }
}
</style> 