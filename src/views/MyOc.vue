<template>
  <MainLayout>
    <div class="home">
      <div class="welcome-section">
        <h1>我的OC角色</h1>
        <p>在这里管理你的原创角色</p>
      </div>

      <div class="action-cards">
        <div class="card create-card" @click="showNewOcDialog">
          <div class="card-image create-image">
            <i class="fas fa-plus"></i>
          </div>
          <div class="card-content">
            <h3>创建新角色</h3>
            <p>开始创建一个新的原创角色</p>
          </div>
        </div>
        
        <div 
          v-for="oc in ocList" 
          :key="oc.ocId" 
          class="card oc-card"
          @click="handleOcClick(oc.ocId)"
        >
          <div class="card-image">
            <template v-if="oc.abbUrl">
              <img 
                :src="oc.abbUrl" 
                :alt="oc.name"
                class="oc-image"
              >
            </template>
            <div v-else class="no-image-placeholder">
              <i class="fas fa-paint-brush"></i>
              <p>设计服装以启动AI绘画</p>
            </div>
          </div>
          <div class="card-content">
            <h3 class="oc-name">{{ oc.name }}</h3>
            <div class="oc-details">
              <div class="detail-item">
                <span class="label">性别:</span>
                <span class="value">{{ oc.gender }}</span>
              </div>
              <div class="detail-item">
                <span class="label">年龄:</span>
                <span class="value">{{ oc.age }}岁</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog
        v-model="createDialogVisible"
        title="创建新角色"
        custom-class="oc-dialog compact-dialog"
        :before-close="handleClose"
        width="65%"
      >
        <NewOc @save-success="handleSaveSuccess" @cancel="handleClose" />
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOcBaseInfo } from '@/api/oc'
import type { OcBaseInfo } from '@/api/oc'
import MainLayout from '@/components/Layout/MainLayout.vue'
import NewOc from '@/components/NewOc.vue'

export default defineComponent({
  name: 'MyOc',
  
  components: {
    MainLayout,
    NewOc
  },

  setup() {
    const router = useRouter()
    const createDialogVisible = ref(false)
    const ocList = ref<OcBaseInfo[]>([])

    const fetchOcList = async () => {
      try {
        const response = await getOcBaseInfo()
        if (response.data) {
          ocList.value = response.data
        }
      } catch (error) {
        ElMessage.error('获取角色列表失败')
      }
    }

    const showNewOcDialog = () => {
      createDialogVisible.value = true
    }

    const handleClose = () => {
      createDialogVisible.value = false
    }

    const handleSaveSuccess = () => {
      createDialogVisible.value = false
      fetchOcList()
    }

    const handleOcClick = (ocId: number) => {
      router.push(`/oc/${ocId}`)
    }

    onMounted(() => {
      fetchOcList()
    })

    return {
      createDialogVisible,
      ocList,
      showNewOcDialog,
      handleClose,
      handleSaveSuccess,
      handleOcClick
    }
  }
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
}

.welcome-section h1 {
  color: #1a365d;
  font-size: 2.5em;
  margin-bottom: 10px;
  animation: fadeInDown 0.8s ease-out;
}

.welcome-section p {
  color: #718096;
  font-size: 1.1em;
  animation: fadeInUp 0.8s ease-out;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.create-card {
  cursor: pointer;
  border: none;
  background: white;
}

.create-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.create-card .create-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.create-card .create-image i {
  font-size: 2.5em;
  color: #666;
}

.create-card .card-content {
  padding: 16px;
  text-align: left;
}

.create-card .card-content h3 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.25rem;
}

.create-card .card-content p {
  color: #666;
  font-size: 0.9rem;
}

.oc-card {
  cursor: pointer;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.oc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.oc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
  text-align: left;
}

.oc-name {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.oc-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #666;
  font-size: 0.9rem;
  min-width: 36px;
}

.value {
  color: #333;
  font-size: 0.9rem;
}

/* 添加无图片时的占位样式 */
.no-image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
}

.no-image-placeholder i {
  font-size: 2em;
  color: #666;
}

.no-image-placeholder p {
  color: #666;
  font-size: 1rem;
  text-align: center;
  margin: 0;
}

/* 对话框样式 */
:deep(.oc-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.oc-dialog .el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.oc-dialog .el-dialog__title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.oc-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.oc-dialog .el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-cards {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    padding: 16px;
  }

  .card-image {
    height: 180px;
  }
}

/* 动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
