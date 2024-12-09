<template>
  <el-dialog
    v-model="dialogVisible"
    :title="clothesDetail?.name || '服装详情'"
    :close-on-click-modal="false"
    width="65%"
    destroy-on-close
    class="clothes-detail-dialog"
  >
    <LoadingWrapper :loading="isLoading">
      <div v-if="clothesDetail" class="clothes-detail-container">
        <div class="left-section">
          <div class="clothes-detail">
            <div class="detail-card">
              <div class="card-header">
                <h3>基本信息</h3>
              </div>
              <div class="card-content">
                <div class="detail-text">
                  <label>服装描述</label>
                  <p :class="{ 'empty-value': !clothesDetail.describe }">
                    {{ clothesDetail.describe || '没有内容' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="detail-card">
              <div class="card-header">
                <h3>服装细节</h3>
              </div>
              <div class="card-content">
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>帽饰</label>
                    <span :class="{ 'empty-value': !clothesDetail.hat }">
                      {{ clothesDetail.hat || '没有内容' }}
                    </span>
                  </div>
                  
                  <div class="detail-item">
                    <label>面部装饰</label>
                    <span :class="{ 'empty-value': !clothesDetail.faceDecorate }">
                      {{ clothesDetail.faceDecorate || '没有内容' }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <label>上装</label>
                    <span :class="{ 'empty-value': !clothesDetail.uppers }">
                      {{ clothesDetail.uppers || '没有内容' }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <label>腰带</label>
                    <span :class="{ 'empty-value': !clothesDetail.belt }">
                      {{ clothesDetail.belt || '没有内容' }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <label>下装</label>
                    <span :class="{ 'empty-value': !clothesDetail.bottoms }">
                      {{ clothesDetail.bottoms || '没有内容' }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <label>腿部装饰</label>
                    <span :class="{ 'empty-value': !clothesDetail.legDecorate }">
                      {{ clothesDetail.legDecorate || '没有内容' }}
                    </span>
                  </div>

                  <div class="detail-item">
                    <label>鞋子</label>
                    <span :class="{ 'empty-value': !clothesDetail.shoes }">
                      {{ clothesDetail.shoes || '没有内容' }}
                    </span>
                  </div>
                </div>

                <div class="detail-text">
                  <label>其他装饰</label>
                  <p :class="{ 'empty-value': !clothesDetail.otherDecorate }">
                    {{ clothesDetail.otherDecorate || '没有内容' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <el-tooltip content="删除服装" placement="top" effect="light">
                <div class="action-button delete" @click="handleDelete">
                  <i class="fas fa-trash-alt"></i>
                </div>
              </el-tooltip>
              
              <el-tooltip content="修改服装" placement="top" effect="light">
                <div class="action-button edit" @click="handleEdit">
                  <i class="fas fa-edit"></i>
                </div>
              </el-tooltip>
              
              <el-tooltip 
                :content="clothesDetail?.collect ? '取消收藏' : '收藏'" 
                placement="top" 
                effect="light"
              >
                <div 
                  class="action-button collect" 
                  :class="{ 'active': clothesDetail?.collect }"
                  @click="handleCollectClick"
                >
                  <i :class="[
                    clothesDetail?.collect ? 'fas fa-star' : 'far fa-star'
                  ]"></i>
                </div>
              </el-tooltip>
              
              <el-tooltip 
                :content="ocDetail?.favouriteClothesId === clothesId ? '取消招牌服装' : '设为招牌服装'" 
                placement="top" 
                effect="light"
              >
                <div 
                  class="action-button favourite" 
                  :class="{ 'active': ocDetail?.favouriteClothesId === clothesId }"
                  @click="handleSetAsFavourite"
                >
                  <i class="fas fa-flag"></i>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>

        <div class="ai-drawing-section">
          <div class="section-header">
            <h3>视觉化</h3>
          </div>
          
          <div class="section-content">
            <div v-if="clothesDetail.imgUrl" class="clothes-image" @click="handlePreviewImage">
              <div class="image-container" :class="{ 'loading': imageLoading, 'error': imageError }">
                <img 
                  :src="clothesDetail.imgUrl" 
                  :alt="clothesDetail.name"
                  @load="handleImageLoad"
                  @error="handleImageError"
                >
                <div v-if="imageLoading" class="image-loading-overlay">
                  <el-icon class="loading-icon"><Loading /></el-icon>
                  <span>图片加载中...</span>
                </div>
              
                <div v-if="imageError" class="image-error-overlay">
                  <i class="fas fa-exclamation-circle"></i>
                  <span>图片加载失败</span>
                  <div class="error-actions">
                    <el-tooltip content="重新加载" placement="bottom" effect="light">
                      <div 
                        class="action-button retry" 
                        @click.stop="handleRetryLoad"
                      >
                        <i class="fas fa-redo"></i>
                      </div>
                    </el-tooltip>
                    <el-tooltip content="重新生成" placement="bottom" effect="light">
                      <div 
                        class="action-button redraw" 
                        @click.stop="handleStartDrawing"
                      >
                        <i class="fas fa-paint-brush"></i>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-image-placeholder" @click="handleStartDrawing">
              <i class="fas fa-paint-brush"></i>
              <p class="placeholder-title">点击启动AI绘画</p>
              <span class="placeholder-hint">根据服装描述自动生成插画</span>
            </div>
          </div>
        </div>
      </div>
    </LoadingWrapper>

    <EditClothes
      v-if="clothesDetail"
      v-model:visible="showEditDialog"
      :clothes-detail="{
        ...clothesDetail,
        clothesId: clothesId,
        clothesOcId: ocId
      }"
      @submit-success="handleEditSuccess"
    />

    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      class="delete-dialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="delete-content">
        <div class="warning-icon-wrapper">
          <el-icon class="warning-icon"><Warning /></el-icon>
        </div>
        <div class="delete-message">
          <h3>删除服装</h3>
          <p>确认删除这件服装吗？</p>
          <p class="warning-text">此操作不可恢复</p>
        </div>
      </div>
      
      <div class="dialog-footer">
        <el-button
          @click="deleteDialogVisible = false"
          :disabled="isDeleting"
        >
          <el-icon><Close /></el-icon>
          取消
        </el-button>
        <el-button
          type="danger"
          @click="confirmDelete"
          :loading="isDeleting"
        >
          <el-icon><Delete /></el-icon>
          确定删除
        </el-button>
      </div>
    </el-dialog>

    <AIDrawingDialog
      v-model:visible="showDrawingDialog"
      :clothes-id="clothesId"
      :clothes-oc-id="ocId"
      @success="handleDrawingSuccess"
    />

    <ImagePreview
      v-if="clothesDetail?.imgUrl"
      v-model:visible="showImagePreview"
      :image-url="clothesDetail.imgUrl"
      :image-alt="clothesDetail.name"
      :oc-name="ocName"
      :clothes-name="clothesDetail.name"
      :description="clothesDetail.describe"
      :clothes-id="clothesId"
      @redraw="handleStartDrawing"
      @delete="handleImageDelete"
    />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getClothesDetail, updateClothes, deleteClothes, setAsFavourite, collectClothes, type ClothesData } from '@/api/clothes'
import EditClothes from './EditClothes.vue'
import { Edit, Delete, Warning, Close, Loading } from '@element-plus/icons-vue'
import AIDrawingDialog from './AIDrawingDialog.vue'
import ImagePreview from './ImagePreview.vue'
import LoadingWrapper from '@/components/LoadingWrapper.vue'

// 定义OC详情类型
interface OcDetailType {
  favouriteClothesId: number | null;
  [key: string]: any;
}

export default defineComponent({
  name: 'ClothesDetail',

  components: {
    EditClothes,
    Warning,
    Close,
    AIDrawingDialog,
    ImagePreview,
    LoadingWrapper,
    Loading
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    clothesId: {
      type: Number,
      required: true
    },
    ocId: {
      type: Number,
      required: true
    },
    ocName: {
      type: String,
      required: true
    },
    ocDetail: {
      type: Object as PropType<OcDetailType>,
      required: true
    }
  },

  emits: ['update:visible', 'delete-success', 'set-favourite-success', 'collect-success', 'drawing-success'],

  data() {
    return {
      clothesDetail: null as ClothesData | null,
      isLoading: false,
      showEditDialog: false,
      deleteDialogVisible: false,
      isDeleting: false,
      showDrawingDialog: false,
      showImagePreview: false,
      imageLoading: true,
      imageError: false
    }
  },

  computed: {
    dialogVisible: {
      get(): boolean {
        return this.visible
      },
      set(value: boolean): void {
        this.$emit('update:visible', value)
      }
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchClothesDetail()
      }
    }
  },

  methods: {
    async fetchClothesDetail() {
      try {
        this.isLoading = true
        const response = await getClothesDetail({
          clothesId: this.clothesId,
          clothesOcId: this.ocId
        })
        this.clothesDetail = {
          ...response.data,
          clothesId: this.clothesId,
          clothesOcId: this.ocId
        }
      } catch (error) {
        ElMessage.error('获取服装详情失败')
        console.error('Error fetching clothes detail:', error)
      } finally {
        this.isLoading = false
      }
    },

    handleEdit() {
      this.showEditDialog = true
    },

    handleDelete() {
      this.deleteDialogVisible = true
    },

    handleStartDrawing() {
      if (!this.clothesDetail) return
      this.showDrawingDialog = true
    },

    handleEditSuccess() {
      this.fetchClothesDetail()
      ElMessage.success('服装信息已更新')
    },

    async confirmDelete() {
      if (!this.clothesDetail) return
      
      try {
        this.isDeleting = true
        await deleteClothes({
          clothesId: this.clothesId,
          clothesOcId: this.ocId
        })
        
        // 1. 关闭删除确认对话框和详情对话框
        this.deleteDialogVisible = false
        this.dialogVisible = false
        
        // 2. 显示成功消息
        ElMessage({
          type: 'success',
          message: '服装已删除',
          duration: 2000
        })
        
        // 3. 触发刷新列表事件
        this.$emit('delete-success')
        
      } catch (error: any) {
        ElMessage.error(
          error.response?.data?.message || 
          '删除失败，请稍后重试'
        )
      } finally {
        this.isDeleting = false
      }
    },

    handleDrawingSuccess() {
      // 重新获取服装详情，刷新图片
      this.fetchClothesDetail()
      // 通知父组件更新列表
      this.$emit('drawing-success')
    },

    handlePreviewImage() {
      if (this.clothesDetail?.imgUrl) {
        this.showImagePreview = true
      }
    },

    handleImageDelete() {
      // 重新获取服装详情，刷新图片状态
      this.fetchClothesDetail()
    },

    async handleSetAsFavourite() {
      try {
        const isFavourite = this.ocDetail?.favouriteClothesId === this.clothesId
        await setAsFavourite({
          ocId: this.ocId,
          clothesId: isFavourite ? null : this.clothesId
        })
        
        ElMessage.success(isFavourite ? '已取消招牌服装' : '已设置为招牌服装')
        this.$emit('set-favourite-success')
      } catch (error) {
        ElMessage.error('设置失败，请重试')
      }
    },

    async handleCollectClick() {
      try {
        await collectClothes({
          clothesId: this.clothesId,
          clothesOcId: this.ocId,
          collect: !this.clothesDetail?.collect
        })
        
        // 更新本地状态
        if (this.clothesDetail) {
          this.clothesDetail.collect = !this.clothesDetail.collect
        }
        
        ElMessage.success(this.clothesDetail?.collect ? '已收藏服装' : '已取消���藏')
        // 触发收藏状态更新事件
        this.$emit('collect-success')
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    },

    handleImageLoad() {
      this.imageLoading = false
      this.imageError = false
    },

    handleImageError() {
      this.imageLoading = false
      this.imageError = true
    },

    handleRetryLoad() {
      const currentDetail = this.clothesDetail
      if (!currentDetail?.imgUrl) return
      
      this.imageLoading = true
      this.imageError = false
      
      // 通过添加时间戳强制浏览器重新加载图片
      const img = new Image()
      const newUrl = `${currentDetail.imgUrl}?t=${Date.now()}`
      img.src = newUrl
      
      img.onload = () => {
        if (this.clothesDetail) {
          this.clothesDetail.imgUrl = newUrl
        }
        this.imageLoading = false
      }
      
      img.onerror = () => {
        this.imageError = true
        this.imageLoading = false
      }
    }
  }
})
</script>

<style scoped>
/* 定义主题色变量 */
:root {
  --primary-color: #8B5CF6;
  --primary-light: #DDD6FE;
  --primary-lighter: #EDE9FE;
  --primary-dark: #7C3AED;
  --delete-color: #909399;
  --edit-color: #8B5CF6;
  --favourite-color: #409EFF;
}

.clothes-detail-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 10px;
  height: calc(80vh - 120px);
  padding: 20px;
  background-color: #F9FAFB;
}

.left-section {
  height: 100%;
  padding-right: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  position: relative;
}

.clothes-detail {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* 为固定按钮留出空间 */
}

.detail-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
  margin-bottom: 24px;
}

.detail-card:last-child {
  margin-bottom: 80px; /* 为固定按钮留出空间 */
}

.detail-card:hover {
  box-shadow: 0 8px 12px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.card-header {
  background: var(--primary-lighter);
  padding: 16px 24px;
  border-bottom: 2px solid var(--primary-light);
}

.card-header h3 {
  color: var(--primary-dark);
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
}

.card-content {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item label,
.detail-text label {
  font-weight: 500;
  color: var(--primary-dark);
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item span,
.detail-text p {
  font-size: 1.1em;
  line-height: 1.8;
  color: #4B5563;
  padding: 8px 12px;
  background: var(--primary-lighter);
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 修改空样式 */
.empty-value {
  color: #9CA3AF !important; /* 浅灰色文字 */
  background: transparent !important; /* 移除背景色 */
  font-style: italic; /* 体 */
  font-weight: 300; /* 更细的字重 */
}

/* 可选：添加一个微妙的过渡效果 */
.detail-item span,
.detail-text p {
  transition: all 0.3s ease;
}

/* 可选：鼠标悬浮时的效果 */
.detail-item span:not(.empty-value):hover,
.detail-text p:not(.empty-value):hover {
  background: var(--primary-light);
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 20px;
}

/* 修改主按钮样式 */
:deep(.primary-button) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.primary-button:hover) {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-1px);
}

.ai-drawing-section {
  background: white;
  border-radius: 12px;
  height: 100%;
  width: 95%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  padding: 16px 24px;
}

.section-header h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
}

.section-content {
  flex: 1;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clothes-image,
.no-image-placeholder {
  width: 85%;
  max-width: 520px;
  aspect-ratio: 832 / 1216;
  position: relative;
  background: var(--primary-lighter);
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed var(--primary-light);
}

.clothes-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 16px;
  transition: all 0.3s ease;
}

.no-image-placeholder:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.no-image-placeholder i {
  font-size: 2.5em;
  color: var(--primary-color);
}

.placeholder-title {
  color: var(--primary-dark);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.placeholder-hint {
  color: var(--primary-color);
  font-size: 0.9rem;
}

/* 响应���调整 */
@media screen and (max-width: 1440px) {
  .clothes-image,
  .no-image-placeholder {
    max-width: 450px;
  }
}

@media screen and (max-width: 1200px) {
  .clothes-image,
  .no-image-placeholder {
    max-width: 400px;
  }
}

@media screen and (max-width: 992px) {
  .clothes-image,
  .no-image-placeholder {
    max-width: 350px;
  }
}

@media screen and (max-width: 768px) {
  .clothes-image,
  .no-image-placeholder {
    max-width: 300px;
  }
  
  .no-image-placeholder i {
    font-size: 2em;
  }
  
  .placeholder-title {
    font-size: 1.1rem;
  }
  
  .placeholder-hint {
    font-size: 0.8rem;
  }
}

@media screen and (max-width: 576px) {
  .clothes-image,
  .no-image-placeholder {
    max-width: 100%;
  }
  
  .section-content {
    padding: 16px;
  }
}

/* 移除右侧滚动条相关样式 */
.clothes-detail::-webkit-scrollbar {
  width: 6px;
}

.clothes-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.clothes-detail::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.clothes-detail::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 操作按钮样式 */
.action-buttons {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 12px;
  z-index: 1;
}

/* 收藏和操作按��的共同样式 */
.action-button {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.action-button:hover {
  transform: scale(1.1);
}

.action-button i {
  font-size: 1.1em;
}

.action-button.delete i {
  color: var(--delete-color);
}

.action-button.edit i {
  color: var(--edit-color);
}

.action-button.favourite i {
  color: #909399;
}

.action-button.favourite.active i {
  color: #409EFF;
}

.action-button.collect i {
  color: #666;
}

.action-button.collect.active i {
  color: #FFD700;
}

/* 删除对话框样式 */
:deep(.delete-dialog .el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.delete-dialog .el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.delete-dialog .el-dialog__body) {
  padding: 0 !important;
}

:deep(.delete-dialog .el-dialog__title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.delete-content {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.warning-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FEF2F2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-icon {
  font-size: 24px;
  color: #EF4444;
}

.delete-message h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 8px;
}

.delete-message p {
  color: #4B5563;
  margin: 0;
}

.delete-message .warning-text {
  color: #EF4444;
  font-size: 0.9rem;
  margin-top: 4px;
}

.dialog-footer {
  padding: 16px 24px;
  background: #F9FAFB;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式调�� */
@media (max-width: 768px) {
  .delete-content {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }
  
  .delete-message {
    text-align: center;
  }
  
  .dialog-footer {
    padding: 12px 16px;
  }
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  gap: 16px;
  padding: 20px;
}

.loading-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.image-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  gap: 16px;
  padding: 20px;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.error-actions .action-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.error-actions .action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.error-actions .action-button i {
  font-size: 1.2em;
}

.error-actions .action-button.retry {
  background: var(--primary-color);
}

.error-actions .action-button.retry i {
  color: white;
}

.error-actions .action-button.redraw {
  background: var(--edit-color);
}

.error-actions .action-button.redraw i {
  color: white;
}

/* 添加按钮点击效果 */
.error-actions .action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 添加工具提示效果 */
.error-actions .action-button::after {
  content: attr(title);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.error-actions .action-button:hover::after {
  opacity: 1;
  visibility: visible;
}

</style> 