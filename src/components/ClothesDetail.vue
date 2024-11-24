<template>
  <el-dialog
    v-model="dialogVisible"
    :title="clothesDetail?.name || '服装详情'"
    :close-on-click-modal="false"
    width="65%"
    destroy-on-close
    class="clothes-detail-dialog"
  >
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

          <div class="detail-card">
            <div class="card-content">
              <div class="form-actions">
                <el-button type="danger" plain class="delete-button" @click="handleDelete">
                  <el-icon><Delete /></el-icon>
                  删除服装
                </el-button>
                <el-button color="#8B5CF6" plain class="edit-button" @click="handleEdit">
                  <el-icon><Edit /></el-icon>
                  修改服装
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-drawing-section">
        <div class="section-header">
          <h3>服装插画</h3>
        </div>
        
        <div class="section-content">
          <div v-if="clothesDetail.imgUrl" class="clothes-image">
            <img :src="clothesDetail.imgUrl" :alt="clothesDetail.name">
            <div class="image-actions">
              <el-button class="regenerate-button" @click="handleRegenerate">
                <el-icon><Refresh /></el-icon>
                重新生成
              </el-button>
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
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { getClothesDetail, ClothesData } from '@/api/clothes'
import { Edit, Delete, Refresh } from '@element-plus/icons-vue'
import EditClothes from './EditClothes.vue'

export default defineComponent({
  name: 'ClothesDetail',

  components: {
    Edit,
    Delete,
    Refresh,
    EditClothes
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
    }
  },

  emits: ['update:visible'],

  data() {
    return {
      clothesDetail: null as ClothesData | null,
      isLoading: false,
      showEditDialog: false
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
      // 实现删除功能
    },

    handleStartDrawing() {
      if (!this.clothesDetail) return
      // 这里添加启动AI绘画的逻辑
      console.log('启动AI绘画')
    },

    handleRegenerate() {
      if (!this.clothesDetail) return
      // 这里添加重新生成图片的逻辑
      ElMessage.info('重新生成图片功能开发中...')
    },

    handleEditSuccess() {
      this.fetchClothesDetail()
      ElMessage.success('服装信息已更新')
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
}

.clothes-detail {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 10px;
}

.detail-card {
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
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

/* 修改空值样式 */
.empty-value {
  color: #9CA3AF !important; /* 浅灰色文字 */
  background: transparent !important; /* 移除背景色 */
  font-style: italic; /* 斜体 */
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
  width: 100%;
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

/* 响应式调整 */
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

/* 重新生成按钮样式 */
.image-actions {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.regenerate-button {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.regenerate-button:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-1px);
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

/* 按钮样式 */
.delete-button,
.edit-button,
.regenerate-button {
  padding: 12px 24px;
  font-size: 1.05rem;
  height: auto;
}

.delete-button .el-icon,
.edit-button .el-icon,
.regenerate-button .el-icon {
  font-size: 1.2em;
  margin-right: 8px;
}

</style> 