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
          @click="showOcDetail(oc.ocId)"
        >
          <div class="card-image">
            <template v-if="oc.imageUrl">
              <img 
                :src="oc.imageUrl" 
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
        width="60%"
      >
        <NewOc @save-success="handleSaveSuccess" @cancel="handleClose" />
      </el-dialog>

      <el-dialog
        v-model="detailDialogVisible"
        :title="currentOc?.name || '角色详情'"
        width="65%"
        custom-class="oc-dialog compact-dialog"
      >
        <OcDetail 
          v-if="currentOcId"
          :oc-id="currentOcId"
          @show-new-costume="showNewCostumeDialog"
          @delete-success="handleDeleteSuccess"
        />
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainLayout from '@/components/Layout/MainLayout.vue'
import NewOc from '@/components/NewOc.vue'
import OcDetail from '@/components/OcDetail.vue'
import { ElDialog, ElMessage } from 'element-plus'
import { getOcBaseInfo, type OcBaseInfo } from '@/api/oc'

export default defineComponent({
  name: 'MyOc',
  components: {
    MainLayout,
    NewOc,
    OcDetail,
    ElDialog
  },
  data() {
    return {
      createDialogVisible: false,
      detailDialogVisible: false,
      ocList: [] as OcBaseInfo[],
      currentOcId: null as number | null
    }
  },
  computed: {
    currentOc(): OcBaseInfo | undefined {
      return this.ocList.find((oc: OcBaseInfo) => oc.ocId === this.currentOcId)
    }
  },
  async created() {
    await this.fetchOcList()
  },
  methods: {
    async fetchOcList() {
      try {
        const response = await getOcBaseInfo()
        this.ocList = response.data
        console.log(this.ocList)
      } catch (error) {
        console.error('获取角色列表失败:', error)
      }
    },
    showNewOcDialog() {
      this.createDialogVisible = true
    },
    handleClose() {
      this.createDialogVisible = false
      this.detailDialogVisible = false
      this.currentOcId = null
    },
    async handleSaveSuccess() {
      this.createDialogVisible = false
      await this.fetchOcList() // 创建成功后刷新列表
    },
    async showOcDetail(ocId: number) {
      this.currentOcId = ocId
      this.detailDialogVisible = true
    },
    showNewCostumeDialog() {
      console.log('显示添加服装对话框')
    },
    handleDeleteSuccess() {
      // 重新获取OC列表数据
      this.fetchOcList()
      // 关闭详情对话框
      this.detailDialogVisible = false
      // 清空选中的OC
      this.currentOcId = null
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
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  width: 100%;
  min-width: 200px;
  max-width: 250px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.create-card {
  cursor: pointer;
  border: none;
  background: white;
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

.create-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  width: 100%;
}

.oc-name {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
  text-align: left;
  padding-left: 8px;
}

.oc-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .action-cards {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    padding: 16px;
  }
  
  .card {
    min-width: 180px;
  }
  
  .card-image {
    height: 180px;
  }
}

:deep(.oc-dialog) {
  width: 60% !important;
  height: 80vh !important;
  margin: 10vh auto !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(20px);
  animation: dialogSlideIn 0.3s ease-out forwards;
}

@keyframes dialogSlideIn {
  to {
    transform: translateY(0);
  }
}

:deep(.el-dialog__header) {
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px 16px 0 0;
}

:deep(.el-dialog__body) {
  padding: 0;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

/* 自定义滚动条样式 */
:deep(.el-dialog__body::-webkit-scrollbar) {
  width: 8px;
}

:deep(.el-dialog__body::-webkit-scrollbar-track) {
  background: rgba(66, 153, 225, 0.05);
  border-radius: 4px;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb) {
  background: rgba(66, 153, 225, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb:hover) {
  background: rgba(66, 153, 225, 0.5);
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
  justify-content: center;
  gap: 8px;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.value {
  color: #333;
  font-size: 0.9rem;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .action-cards {
    grid-template-columns: repeat(2, 1fr);
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .action-cards {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
  }
  
  .card-image {
    height: 160px;
  }
}

/* 添加动画关键帧 */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 对话框全屏适配样式 */
:deep(.full-height-dialog) {
  display: flex;
  flex-direction: column;
  margin: 15vh auto !important;
  max-height: 70vh !important;
}

:deep(.full-height-dialog .el-dialog__body) {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
}

:deep(.full-height-dialog .el-dialog__header) {
  padding: 20px 30px;
  margin: 0;
  border-bottom: 1px solid #eee;
}

:deep(.full-height-dialog .el-dialog__footer) {
  padding: 20px 30px;
  border-top: 1px solid #eee;
}

:deep(.full-height-modal) {
  display: flex;
  align-items: center;
}

/* 美化滚动条 */
:deep(.el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog__body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* 调整内容区域的内边距和布局 */
.oc-detail {
  padding: 0;
  height: 100%;
}

.detail-section:last-child {
  margin-bottom: 0;
}

/* 响应式调整 */
@media screen and (max-height: 800px) {
  :deep(.full-height-dialog) {
    margin: 10vh auto !important;
    max-height: 80vh !important;
  }
}

@media screen and (max-height: 600px) {
  :deep(.full-height-dialog) {
    margin: 5vh auto !important;
    max-height: 90vh !important;
  }
}

/* 紧凑型对话框样式 */
:deep(.compact-dialog) {
  margin: 5vh auto !important;
}

:deep(.compact-dialog .el-dialog__body) {
  padding: 20px 25px;
}

:deep(.compact-dialog .el-dialog__header) {
  padding: 15px 25px;
  margin: 0;
  border-bottom: 1px solid #eee;
}

:deep(.compact-dialog .el-dialog__footer) {
  padding: 15px 25px;
  border-top: 1px solid #eee;
}

/* 调整内容区域的间距 */
.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  margin-bottom: 15px;
}

.detail-grid {
  gap: 15px;
  margin-bottom: 15px;
}

.detail-text {
  margin-bottom: 15px;
}

.detail-item {
  gap: 6px;
}

/* 移除外部滚动条 */
:deep(html),
:deep(body) {
  overflow: hidden;
}

/* 调整响应式布局 */
@media screen and (max-width: 1200px) {
  :deep(.compact-dialog) {
    width: 75% !important;
  }
}

@media screen and (max-width: 768px) {
  :deep(.compact-dialog) {
    width: 90% !important;
  }
  
  .oc-detail-container {
    grid-template-columns: 1fr;
    height: calc(80vh - 140px);
  }
}

/* 防止外部出现滚动�� */
:deep(.el-overlay) {
  overflow: hidden !important;
}

/* 优化响应式布局 */
@media screen and (max-height: 800px) {
  :deep(.oc-dialog) {
    max-height: 80vh !important;
    margin: 10vh auto !important;
  }
  
  .oc-detail-container {
    height: calc(80vh - 120px);
  }
}

@media screen and (max-width: 768px) {
  .oc-detail-container {
    grid-template-columns: 1fr;
    height: 400px;
  }
  
  .oc-detail {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

/* 统一滚动条样式 */
.oc-detail::-webkit-scrollbar,
.costume-section::-webkit-scrollbar {
  width: 6px;
}

.oc-detail::-webkit-scrollbar-track,
.costume-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.oc-detail::-webkit-scrollbar-thumb,
.costume-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.oc-detail::-webkit-scrollbar-thumb:hover,
.costume-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 移除之前的滚动条样式 */
:deep(.el-dialog__body::-webkit-scrollbar),
:deep(.el-dialog__body::-webkit-scrollbar-track),
:deep(.el-dialog__body::-webkit-scrollbar-thumb),
:deep(.el-dialog__body::-webkit-scrollbar-thumb:hover) {
  display: none;
}

/* 调整内容区域的padding */
.oc-detail {
  padding: 20px 20px 20px 24px;
}

.costume-section {
  padding: 20px 20px 20px 24px;
}

/* 确保遮罩层正确显示 */
:deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden !important;
}

/* 响应式调整 */
@media screen and (max-height: 800px) {
  :deep(.oc-dialog) {
    height: 85vh !important; /* 在较小高度的屏幕上略微增加高度 */
    margin: 7.5vh auto !important; /* (100vh - 85vh) / 2 = 7.5vh */
  }
}

@media screen and (max-height: 600px) {
  :deep(.oc-dialog) {
    height: 90vh !important; /* 在更小高度的屏幕上进一步增加高度 */
    margin: 5vh auto !important; /* (100vh - 90vh) / 2 = 5vh */
  }
}

/* 统一对话框尺寸样式 */
:deep(.oc-dialog) {
  width: 60% !important;
  height: 80vh !important;
  margin: 10vh auto !important; /* 上下10vh，保持垂直居中 */
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  :deep(.oc-dialog) {
    width: 75% !important;
  }
}

@media screen and (max-width: 768px) {
  :deep(.oc-dialog) {
    width: 90% !important;
  }
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

/* 确保图片区域高度一致 */
.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.oc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .card-image {
    height: 180px;
  }
  
  .no-image-placeholder {
    padding: 15px;
  }
  
  .no-image-placeholder p {
    font-size: 0.9rem;
  }
}
</style>
