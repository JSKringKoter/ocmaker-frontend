<template>
  <el-dialog
    v-model="dialogVisible"
    width="65%"
    :close-on-click-modal="false"
    class="image-preview-dialog"
    destroy-on-close
  >
    <div class="preview-wrapper">
      <!-- 左侧图片区域 -->
      <div class="preview-container">
        <div class="image-wrapper">
          <img :src="imageUrl" :alt="imageAlt">
          <div class="action-buttons">
            <el-tooltip
              content="重新生成"
              placement="top"
              effect="light"
            >
              <div 
                v-if="showRedrawButton"
                class="action-button edit"
                @click="handleRedraw"
              >
                <i class="fas fa-sync"></i>
              </div>
            </el-tooltip>

            <el-tooltip
              content="下载图片"
              placement="top"
              effect="light"
            >
              <div
                class="action-button download"
                @click="handleDownload"
              >
                <i class="fas fa-download"></i>
              </div>
            </el-tooltip>

            <el-tooltip
              content="删除图片"
              placement="top"
              effect="light"
            >
              <div
                class="action-button delete"
                @click="handleDelete"
              >
                <i class="fas fa-trash-alt"></i>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>

      <!-- 右侧信息区域 -->
      <div class="info-container">
        <div class="info-header">
          <div class="header-content">
            <h2 class="oc-name">{{ ocName }}</h2>
            <h3 class="clothes-name">{{ clothesName }}</h3>
          </div>
        </div>
        
        <div class="info-content">
          <div class="description-section">
            <h4>服装介绍</h4>
            <div class="description-card">
              <p class="description-text">{{ description || '暂无介绍' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      class="delete-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="delete-content">
        <div class="warning-icon-wrapper">
          <el-icon class="warning-icon"><Warning /></el-icon>
        </div>
        <div class="delete-message">
          <h3>删除图片</h3>
          <p>确定要删除这张图片吗？</p>
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
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Warning, Close } from '@element-plus/icons-vue'
import { deleteClothes } from '@/api/ai'

export default defineComponent({
  name: 'ImagePreview',

  components: {
    Delete,
    Warning,
    Close
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    imageUrl: {
      type: String as PropType<string>,
      required: true,
      validator: (value: string) => value.length > 0
    },
    imageAlt: {
      type: String,
      default: ''
    },
    showRedrawButton: {
      type: Boolean,
      default: true
    },
    ocName: {
      type: String,
      required: true
    },
    clothesName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '暂无介绍'
    },
    clothesId: {
      type: Number,
      required: true
    }
  },

  emits: ['update:visible', 'redraw', 'delete'],

  setup(props, { emit }) {
    const deleteDialogVisible = ref(false)
    const isDeleting = ref(false)

    const dialogVisible = computed({
      get: () => props.visible,
      set: (value: boolean) => emit('update:visible', value)
    })

    const handleRedraw = () => {
      emit('redraw')
    }

    const handleDownload = () => {
      const link = document.createElement('a')
      link.href = props.imageUrl
      link.download = `${props.ocName}-${props.clothesName}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      ElMessage.success('正在下载')
    }

    const handleDelete = () => {
      deleteDialogVisible.value = true
    }

    const confirmDelete = async () => {
      try {
        isDeleting.value = true
        await deleteClothes({ clothesId: props.clothesId })
        emit('delete')
        deleteDialogVisible.value = false
        dialogVisible.value = false
        ElMessage.success('图片删除成功')
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败，请重试')
      } finally {
        isDeleting.value = false
      }
    }

    return {
      dialogVisible,
      deleteDialogVisible,
      isDeleting,
      handleRedraw,
      handleDownload,
      handleDelete,
      confirmDelete
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
  --download-color: #10B981;
}

.image-preview-dialog :deep(.el-dialog) {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(20px);
  animation: dialogSlideIn 0.3s ease-out forwards;
}

@keyframes dialogSlideIn {
  to {
    transform: translateY(0);
  }
}

.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.image-preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.preview-wrapper {
  display: grid;
  grid-template-columns: 60% 40%;
  
}

.preview-container {
  position: relative;
  width: 100%;
  height: 72vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-container {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: white;
}

.info-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
}

.oc-name {
  font-size: 2em;
  margin: 0 0 12px 0;
  color: #1a365d;
  font-weight: 600;
}

.clothes-name {
  font-size: 1.5em;
  margin: 0;
  color: #4a5568;
  font-weight: 500;
}

.info-content {
  flex: 1;
}

.description-section h4 {
  font-size: 1.1em;
  color: #4a5568;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.description-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.description-text {
  font-size: 1.1em;
  line-height: 1.8;
  color: #4a5568;
  margin: 0;
  white-space: pre-line;
}

.action-buttons {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 12px;
  z-index: 1;
}

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

.action-button.edit i {
  color: var(--edit-color);
}

.action-button.download i {
  color: var(--download-color);
}

.action-button.delete i {
  color: var(--delete-color);
}

/* 删除对话框样式 */
.delete-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.delete-content {
  text-align: center;
  padding: 20px;
}

.warning-icon-wrapper {
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 48px;
  color: #EF4444;
}

.delete-message h3 {
  font-size: 1.5em;
  margin: 0 0 12px 0;
  color: #1F2937;
}

.delete-message p {
  margin: 0;
  color: #4B5563;
}

.warning-text {
  color: #EF4444 !important;
  font-size: 0.875em;
  margin-top: 8px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
}

/* 响应式调整 */
@media screen and (max-width: 1400px) {
  .preview-wrapper {
    grid-template-columns: 60% 40%;
  }
  
  .info-container {
    padding: 30px;
  }
  
  .oc-name {
    font-size: 1.8em;
  }
  
  .clothes-name {
    font-size: 1.3em;
  }

  .preview-container {
    padding: 30px;
  }
}

@media screen and (max-width: 1024px) {
  .image-preview-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto !important;
  }
}

@media screen and (max-width: 768px) {
  .preview-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    min-height: auto;
  }

  .preview-container {
    height: 50vh;
    padding: 20px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .info-container {
    padding: 20px;
    min-height: 30vh;
  }

  .oc-name {
    font-size: 1.6em;
  }
  
  .clothes-name {
    font-size: 1.2em;
  }
  
  .description-text {
    font-size: 1em;
  }

  .description-card {
    padding: 16px;
  }

  .action-button {
    width: 48px !important;
    height: 48px !important;
  }

  .action-button i {
    font-size: 20px;
  }

  .action-buttons {
    right: 16px;
    bottom: 16px;
    gap: 8px;
  }
}

/* 自定义滚动条样式 */
.info-container::-webkit-scrollbar {
  width: 6px;
}

.info-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.info-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.info-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 