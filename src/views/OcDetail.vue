<template>
  <MainLayout>
    <div class="oc-detail-page">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ ocDetail?.name || '加载中...' }}</h1>
          <div class="header-actions">
            <el-button type="primary" @click="handleEdit">
              <i class="fas fa-edit"></i>
              编辑
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <i class="fas fa-trash-alt"></i>
              删除
            </el-button>
          </div>
        </div>
      </div>

      <div class="page-content">
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
                    <span :class="{ 'empty-value': !ocDetail?.gender }">
                      {{ ocDetail?.gender || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>年龄</label>
                    <span :class="{ 'empty-value': !ocDetail?.age }">
                      {{ ocDetail?.age || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>身高</label>
                    <span :class="{ 'empty-value': !ocDetail?.height }">
                      {{ ocDetail?.height || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>体重</label>
                    <span :class="{ 'empty-value': !ocDetail?.weight }">
                      {{ ocDetail?.weight || '没有内容' }}
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
                    <span :class="{ 'empty-value': !ocDetail?.skinColor }">
                      {{ ocDetail?.skinColor || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>发型</label>
                    <span :class="{ 'empty-value': !ocDetail?.hair }">
                      {{ ocDetail?.hair || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>发色</label>
                    <span :class="{ 'empty-value': !ocDetail?.hairColor }">
                      {{ ocDetail?.hairColor || '没有内容' }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <label>瞳色</label>
                    <span :class="{ 'empty-value': !ocDetail?.eyesColor }">
                      {{ ocDetail?.eyesColor || '没有内容' }}
                    </span>
                  </div>
                </div>
                <div class="detail-text">
                  <label>身体特征</label>
                  <p :class="{ 'empty-value': !ocDetail?.body }">
                    {{ ocDetail?.body || '没有内容' }}
                  </p>
                </div>
                <div class="detail-text">
                  <label>面部特征</label>
                  <p :class="{ 'empty-value': !ocDetail?.face }">
                    {{ ocDetail?.face || '没有内容' }}
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
                  <p :class="{ 'empty-value': !ocDetail?.personality }">
                    {{ ocDetail?.personality || '没有内容' }}
                  </p>
                </div>
                <div class="detail-text">
                  <label>特长</label>
                  <p :class="{ 'empty-value': !ocDetail?.skill }">
                    {{ ocDetail?.skill || '没有内容' }}
                  </p>
                </div>
                <div class="detail-text">
                  <label>爱好</label>
                  <p :class="{ 'empty-value': !ocDetail?.hobby }">
                    {{ ocDetail?.hobby || '没有内容' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧服装部分 -->
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
                    <template v-if="element.abbImgUrl">
                      <img 
                        :src="element.abbImgUrl" 
                        :alt="element.name"
                        class="clothes-image"
                      >
                    </template>
                    <div v-else class="no-image-placeholder">
                      <i class="fas fa-paint-brush"></i>
                      <p>点击以启动AI绘画</p>
                    </div>
                    <div 
                      class="collect-mark"
                      @click.stop="handleCollectClick(element)"
                    >
                      <el-tooltip
                        :content="element.collect ? '取消收藏' : '收藏'"
                        placement="bottom"
                        effect="light"
                      >
                        <i :class="[
                          element.collect ? 'fas fa-star' : 'far fa-star'
                        ]"></i>
                      </el-tooltip>
                    </div>
                    <div 
                      v-if="ocDetail?.favouriteClothesId === element.clothesId"
                      class="favourite-mark"
                    >
                      <el-tooltip content="招牌服装" placement="bottom" effect="light">
                        <i class="fas fa-flag"></i>
                      </el-tooltip>
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
      </div>

      <!-- 编辑OC对话框 -->
      <EditOc
        v-if="editDialogVisible && ocDetail"
        v-model:visible="editDialogVisible"
        :oc-detail="ocDetail"
        @submit="handleEditSubmit"
      />

      <!-- 删除确认对话框 -->
      <el-dialog
        v-model="deleteDialogVisible"
        title="删除确认"
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
            <h3>删除角色</h3>
            <p>确定要删除这个角色吗？</p>
            <p class="warning-text">此操作不可恢复，角色的所有服装也将被删除</p>
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

      <!-- 新建服装对话框 -->
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

      <!-- 服装详情对话框 -->
      <ClothesDetail
        v-if="selectedClothesId && ocDetail"
        v-model:visible="clothesDetailVisible"
        :clothes-id="selectedClothesId"
        :oc-id="ocId"
        :oc-name="ocDetail.name"
        :oc-detail="ocDetail"
        @delete-success="handleClothesDeleted"
        @set-favourite-success="handleSetFavouriteSuccess"
      />
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOcDetail, updateOcDetail, deleteOc, type OcDetail } from '@/api/oc'
import EditOc from '@/components/EditOc.vue'
import { Delete, Warning, Close } from '@element-plus/icons-vue'
import { getClothesBaseInfo, collectClothes, type ClothesBaseInfo } from '@/api/clothes'
import draggable from 'vuedraggable'
import NewClothes from '@/components/NewClothes.vue'
import ClothesDetail from '@/components/ClothesDetail.vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/Layout/MainLayout.vue'

export default defineComponent({
  name: 'OcDetail',

  components: {
    EditOc,
    Delete,
    Warning,
    Close,
    draggable,
    NewClothes,
    ClothesDetail,
    MainLayout
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const router = useRouter()
    const ocId = parseInt(props.id)

    return {
      ocId,
      router
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
      selectedClothesId: null as number | null,
      clothesDetailVisible: false
    }
  },

  created() {
    this.fetchOcDetail(this.ocId)
    this.fetchClothesList()
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

    handleEdit() {
      this.editDialogVisible = true
    },

    async handleEditSubmit(updatedData: OcDetail) {
      try {
        await updateOcDetail(this.ocId, updatedData)
        ElMessage.success('修改成功')
        this.fetchOcDetail(this.ocId)
        this.editDialogVisible = false
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
        ElMessage.success('删除成功')
        this.router.push('/my-oc')
      } catch (error) {
        ElMessage.error('删除失败，请重试')
      } finally {
        this.isDeleting = false
        this.deleteDialogVisible = false
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

    showNewCostumeDialog() {
      this.newClothesDialogVisible = true
    },

    handleClothesCreated() {
      this.newClothesDialogVisible = false
      this.fetchClothesList()
    },

    handleClothesDeleted() {
      this.fetchClothesList()
    },

    handleSetFavouriteSuccess() {
      this.fetchOcDetail(this.ocId)
      this.fetchClothesList()
    },

    async handleCollectClick(clothes: ClothesBaseInfo) {
      try {
        await collectClothes({
          clothesId: clothes.clothesId,
          clothesOcId: clothes.clothesOcId,
          collect: !clothes.collect
        })
        
        clothes.collect = !clothes.collect
        ElMessage.success(clothes.collect ? '已收藏服装' : '已取消收藏')
      } catch (error) {
        ElMessage.error('操作失败，请重试')
      }
    }
  }
})
</script>

<style scoped>
.oc-detail-page {
  min-height: calc(100vh - 64px); /* 减去顶部导航栏的高度 */
  background-color: #F9FAFB;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: white;
  padding: 24px 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 2em;
  color: #1a365d;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.page-content {
  flex: 1;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 40px;
}

.left-section {
  height: 100%;
}

.oc-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-card {
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

.detail-text {
  margin-bottom: 24px;
}

.detail-text:last-child {
  margin-bottom: 0;
}

/* 右侧服装部分样式 */
.costume-section {
  padding-right: 20px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.costume-section h3 {
  color: var(--primary-dark);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-light);
  font-size: 1.4em;
  font-weight: 600;
}

.costume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.create-card {
  cursor: pointer;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
}

.create-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.create-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.create-image i {
  font-size: 2.5em;
  color: #666;
}

.create-card .card-content {
  padding: 16px;
  text-align: left;
}

.create-card .card-content h3 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  border: none;
  padding: 0;
}

.create-card .card-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
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

.card-image {
  position: relative;
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

.no-image-placeholder {
  width: 100%;
  height: 100%;
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

.collect-mark,
.favourite-mark {
  position: absolute;
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
}

.collect-mark {
  top: 10px;
  left: 10px;
  cursor: pointer;
}

.favourite-mark {
  top: 10px;
  right: 10px;
}

.collect-mark:hover {
  transform: scale(1.1);
}

.collect-mark i {
  color: #666;
  font-size: 1.1em;
}

.collect-mark i.fas.fa-star {
  color: #FFD700;
}

.favourite-mark i {
  color: #409EFF;
  font-size: 1.1em;
}

.clothes-name {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: 600;
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

/* 响应式调整 */
@media (max-width: 1200px) {
  .page-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .costume-section {
    padding-right: 0;
    height: auto;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .page-content {
    padding: 20px;
  }
}

/* 美化滚动条 */
.costume-section::-webkit-scrollbar {
  width: 6px;
}

.costume-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.costume-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.costume-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 