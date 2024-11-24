<template>
  <div v-if="ocDetail" class="oc-detail-container">
    <div class="left-section">
      <div class="oc-detail">
        <!-- 基本信息卡片 -->
        <div class="detail-card">
          <div class="card-header">
            <h3>基本信息</h3>
          </div>
          <div class="card-content">
            <div class="detail-grid">
              <div class="detail-item">
                <label>性别</label>
                <span :class="{ 'empty-value': !ocDetail.gender }">
                  {{ ocDetail.gender || '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>年龄</label>
                <span :class="{ 'empty-value': !ocDetail.age }">
                  {{ ocDetail.age ? `${ocDetail.age}岁` : '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>身高</label>
                <span :class="{ 'empty-value': !ocDetail.height }">
                  {{ ocDetail.height ? `${ocDetail.height}cm` : '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>体重</label>
                <span :class="{ 'empty-value': !ocDetail.weight }">
                  {{ ocDetail.weight ? `${ocDetail.weight}kg` : '没有内容' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 外貌特征卡片 -->
        <div class="detail-card">
          <div class="card-header">
            <h3>外貌特征</h3>
          </div>
          <div class="card-content">
            <div class="detail-grid">
              <div class="detail-item">
                <label>肤色</label>
                <span :class="{ 'empty-value': !ocDetail.skinColor }">
                  {{ ocDetail.skinColor || '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>发型</label>
                <span :class="{ 'empty-value': !ocDetail.hair }">
                  {{ ocDetail.hair || '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>发色</label>
                <span :class="{ 'empty-value': !ocDetail.hairColor }">
                  {{ ocDetail.hairColor || '没有内容' }}
                </span>
              </div>
              <div class="detail-item">
                <label>瞳色</label>
                <span :class="{ 'empty-value': !ocDetail.eyesColor }">
                  {{ ocDetail.eyesColor || '没有内容' }}
                </span>
              </div>
            </div>
            <div class="detail-text">
              <label>身体特征</label>
              <p :class="{ 'empty-value': !ocDetail.body }">
                {{ ocDetail.body || '没有内容' }}
              </p>
            </div>
            <div class="detail-text">
              <label>面部特征</label>
              <p :class="{ 'empty-value': !ocDetail.face }">
                {{ ocDetail.face || '没有内容' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 个性特征卡片 -->
        <div class="detail-card">
          <div class="card-header">
            <h3>个性特征</h3>
          </div>
          <div class="card-content">
            <div class="detail-text">
              <label>性格特点</label>
              <p :class="{ 'empty-value': !ocDetail.personality }">
                {{ ocDetail.personality || '没有内容' }}
              </p>
            </div>
            <div class="detail-text">
              <label>特长</label>
              <p :class="{ 'empty-value': !ocDetail.skill }">
                {{ ocDetail.skill || '没有内容' }}
              </p>
            </div>
            <div class="detail-text">
              <label>爱好</label>
              <p :class="{ 'empty-value': !ocDetail.hobby }">
                {{ ocDetail.hobby || '没有内容' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮卡片 -->
        <div class="detail-card">
          <div class="card-content">
            <div class="form-actions">
              <el-button type="danger" plain class="delete-button" @click="handleDelete">
                <el-icon><Delete /></el-icon>
                删除角色
              </el-button>
              <el-button color="#8B5CF6" plain class="edit-button" @click="showEditDialog">
                <el-icon><Edit /></el-icon>
                修改角色信息
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧服装部分保持不变 -->
    <div class="costume-section">
      <h3>Ta的服装</h3>
      <div class="costume-grid">
        <div class="card create-card" @click="showNewCostumeDialog">
          <div class="card-image create-image">
            <i class="fas fa-plus"></i>
          </div>
          <div class="card-content">
            <h3>添加新服装</h3>
            <p>为角色添加新的服装搭配</p>
          </div>
        </div>
        
        <draggable 
          v-model="clothesList"
          class="draggable-container"
          item-key="clothesId"
          :animation="200"
        >
          <template #item="{ element }">
            <div 
              class="card clothes-card"
              @click="handleClothesClick(element.clothesId)"
            >
              <div class="card-image">
                <template v-if="element.imageUrl">
                  <img 
                    :src="element.imageUrl" 
                    :alt="element.name"
                    class="clothes-image"
                  >
                </template>
                <div v-else class="no-image-placeholder">
                  <i class="fas fa-paint-brush"></i>
                  <p>点击以启动AI绘画</p>
                </div>
              </div>
              <div class="card-content">
                <h3 class="clothes-name">{{ element.name }}</h3>
                <p class="clothes-describe">{{ element.describe }}</p>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <EditOc
      v-model:visible="editDialogVisible"
      :oc-detail="ocDetail"
      @submit="handleEditSubmit"
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
        <el-icon class="warning-icon"><Warning /></el-icon>
        <div class="delete-message">
          <h3>删除角色</h3>
          <p>确定要删除这个角色以及Ta的所有服装吗？</p>
          <p class="warning-text">此操作不可恢复</p>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="deleteDialogVisible = false"
            :disabled="isDeleting"
          >
            取消
          </el-button>
          <el-button
            type="danger"
            @click="confirmDelete"
            :loading="isDeleting"
          >
            确定删除
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="newClothesDialogVisible"
      title="添加新服装"
      width="60%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <NewClothes
        :oc-id="ocId"
        @cancel="newClothesDialogVisible = false"
        @save-success="handleClothesCreated"
      />
    </el-dialog>

    <ClothesDetail
      v-if="selectedClothesId"
      v-model:visible="clothesDetailVisible"
      :clothes-id="selectedClothesId"
      :oc-id="ocId"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOcDetail, updateOcDetail, deleteOc, type OcDetail } from '@/api/oc'
import EditOc from './EditOc.vue'
import { Edit, Delete, Warning } from '@element-plus/icons-vue'
import { getClothesBaseInfo, type ClothesBaseInfo } from '@/api/clothes'
import draggable from 'vuedraggable'
import NewClothes from './NewClothes.vue'
import ClothesDetail from './ClothesDetail.vue'

export default defineComponent({
  name: 'OcDetail',
  
  components: {
    EditOc,
    Edit,
    Delete,
    Warning,
    draggable,
    NewClothes,
    ClothesDetail
  },
  
  props: {
    ocId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      ocDetail: null as OcDetail | null,
      editDialogVisible: false,
      deleteDialogVisible: false,
      isDeleting: false,
      clothesList: [] as ClothesBaseInfo[],
      newClothesDialogVisible: false,
      clothesDetailVisible: false,
      selectedClothesId: null as number | null
    }
  },

  watch: {
    ocId: {
      immediate: true,
      handler(newId: number) {
        if (newId) {
          this.fetchOcDetail(newId)
          this.fetchClothesList()
        }
      }
    }
  },

  methods: {
    async fetchOcDetail(ocId: number) {
      try {
        const response = await getOcDetail(ocId)
        if (response.data) {
          this.ocDetail = response.data
        }
      } catch (error) {
        ElMessage.error('获取角色详情失败')
      }
    },

    showNewCostumeDialog() {
      this.newClothesDialogVisible = true
    },

    showEditDialog() {
      this.editDialogVisible = true
    },

    async handleEditSubmit(updatedData: OcDetail) {
      try {
        await updateOcDetail(this.ocId, updatedData)
        ElMessage.success('修改成功')
        this.fetchOcDetail(this.ocId)
      } catch (error) {
        ElMessage.error('修��失败')
      }
    },

    handleDelete() {
      this.deleteDialogVisible = true
    },

    async confirmDelete() {
      try {
        this.isDeleting = true
        await deleteOc(this.ocId)
        
        // 1. 立即关闭删除确认对话框和详情模态框
        this.deleteDialogVisible = false
        this.$emit('update:visible', false)
        
        // 2. 通知父组件更新列表
        this.$emit('delete-success')
        
        // 3. 显示成功消息（不需要在onClose中处理）
        ElMessage({
          type: 'success',
          message: '角色已删除',
          duration: 2000
        })
        
      } catch (error: any) {
        ElMessage.error(
          error.response?.data?.message || 
          '删除失败，请稍后重试'
        )
      } finally {
        this.isDeleting = false
      }
    },

    async fetchClothesList() {
      try {
        const response = await getClothesBaseInfo(this.ocId)
        if (response.data) {
          this.clothesList = response.data
        }
      } catch (error) {
        ElMessage.error('获取服装列表失败')
      }
    },

    handleClothesClick(clothesId: number) {
      this.selectedClothesId = clothesId
      this.clothesDetailVisible = true
    },

    handleClothesCreated() {
      this.newClothesDialogVisible = false
      this.fetchClothesList() // 刷新服装列表
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

.oc-detail-container {
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

.oc-detail {
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

.empty-value {
  color: #9CA3AF !important;
  background: transparent !important;
  font-style: italic;
  font-weight: 300;
}

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

/* 按钮样式 */
.delete-button,
.edit-button {
  padding: 12px 24px;
  font-size: 1.05rem;
  height: auto;
}

.delete-button .el-icon,
.edit-button .el-icon {
  font-size: 1.2em;
  margin-right: 8px;
}

/* 统一的滚动条样式 */
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

/* 右侧服装区域样式优化 */
.costume-section {
  padding-right: 20px;
  overflow-y: auto;
  height: 100%;
  scrollbar-gutter: stable; /* 防止滚动条出现时布局抖动 */
}

.costume-section h3 {
  color: var(--primary-dark);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-light);
  font-size: 1.2em;
  font-weight: 600;
}

.costume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  padding: 20px 0;
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
  border-bottom: none;
  padding-bottom: 0;
}

.create-card .card-content p {
  color: #666;
  font-size: 0.9rem;
}

@media screen and (max-width: 768px) {
  .costume-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
  
  .create-card .create-image {
    height: 180px;
  }
}

/* 删除确认对话框样式 */
:deep(.delete-dialog .el-dialog__header) {
  padding: 20px 20px 10px;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #eee;
}

:deep(.delete-dialog .el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.delete-dialog .el-dialog__body) {
  padding: 30px 20px;
}

.delete-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 0 10px;
}

.warning-icon {
  font-size: 24px;
  color: #f56c6c;
  margin-top: 4px;
}

.delete-message h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.delete-message p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.warning-text {
  color: #f56c6c !important;
  font-size: 0.9em;
  margin-top: 8px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

:deep(.delete-dialog .el-dialog__footer) {
  padding: 10px 20px 20px;
  margin: 0;
}

:deep(.delete-dialog .el-button) {
  padding: 9px 20px;
  font-size: 14px;
  border-radius: 4px;
}

/* 添加对话框动画 */
:deep(.delete-dialog .el-dialog) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 禁用状态下的取消按钮样式 */
:deep(.el-button.is-disabled) {
  opacity: 0.7;
  cursor: not-allowed;
}

.clothes-card {
  cursor: pointer;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.clothes-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 图片区域样式 */
.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.clothes-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 无图片时的占位样式 */
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

/* 卡片内容样式 */
.card-content {
  padding: 16px;
  text-align: left;
}

.clothes-name {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
  border-bottom: none;
  padding-bottom: 0;
}

.clothes-describe {
  color: #666;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  line-height: 1.5;
  height: 2.7em;
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

/* 拖拽容器样式优化 */
.draggable-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  grid-column: 1 / -1;
  padding-right: 10px; /* 为滚动条预留空间 */
}

/* 拖拽时的样式 */
.clothes-card.sortable-ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

.clothes-card.sortable-drag {
  cursor: move;
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .draggable-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }
}
</style> 