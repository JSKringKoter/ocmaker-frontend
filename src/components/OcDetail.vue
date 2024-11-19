<template>
  <div v-if="ocDetail" class="oc-detail-container">
    <div class="oc-detail">
      <div class="detail-section">
        <h3>基本信息</h3>
        <div class="detail-grid basic-info-grid">
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

      <div class="detail-section">
        <h3>外貌特征</h3>
        <div class="detail-grid appearance-grid">
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

      <div class="detail-section">
        <h3>个性特征</h3>
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
        
        <div class="form-actions">
          <el-button 
            type="danger" 
            @click="handleDelete"
            :loading="isDeleting"
          >
            <el-icon><Delete /></el-icon>
            删除角色
          </el-button>
          <el-button 
            type="primary" 
            @click="showEditDialog"
            class="edit-button"
          >
            <el-icon><Edit /></el-icon>
            修改角色信息
          </el-button>
        </div>
      </div>
    </div>
    
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOcDetail, updateOcDetail, deleteOc, type OcDetail } from '@/api/oc'
import EditOc from './EditOc.vue'
import { Edit, Delete, Warning } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'OcDetail',
  
  components: {
    EditOc,
    Edit,
    Delete,
    Warning
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
      isDeleting: false
    }
  },

  watch: {
    ocId: {
      immediate: true,
      handler(newId: number) {
        if (newId) {
          this.fetchOcDetail(newId)
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
      this.$emit('show-new-costume')
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
        ElMessage.error('修改失败')
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
    }
  }
})
</script>

<style scoped>
.oc-detail-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 20px;
  height: calc(80vh - 120px);
  padding: 20px;
}

.oc-detail {
  padding-right: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  height: 100%;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(66, 153, 225, 0.3);
  transition: all 0.3s ease;
}

.detail-section:hover h3 {
  color: #2b6cb0;
  border-bottom-color: #4299e1;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.basic-info-grid {
  grid-template-areas: 
    "gender age"
    "height weight";
}

.appearance-grid {
  grid-template-areas:
    "skin hair"
    "hairColor eyesColor";
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-text {
  margin-bottom: 20px;
}

.detail-item label,
.detail-text label {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item span,
.detail-text p {
  font-size: 1.1em;
  line-height: 1.8;
  text-decoration: underline;
  font-family: 'Noto Sans SC', sans-serif !important;
  transition: all 0.3s ease;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 空值样式 */
.empty-value {
  color: #a0aec0 !important;
  text-decoration: none !important;
  font-style: italic;
  font-family: 'Noto Sans SC', sans-serif !important;
}

.costume-section {
  padding-right: 20px;
  overflow-y: auto;
  height: 100%;
}

.costume-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

/* 滚动条样式 */
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

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 0 0 0;
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.el-button) {
  padding: 12px 24px;
  font-size: 16px;
  height: auto;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-button .el-icon) {
  font-size: 18px;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.detail-section:last-child {
  margin-bottom: 0;
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
</style> 