<template>
  <MainLayout>
    <LoadingWrapper :loading="isLoading">
      <div class="home">
        <div class="welcome-section">
          <h1>我的OC角色</h1>
          <p>在这里管理你的原创角色</p>
        </div>

        <!-- 浮动工具栏 -->
        <div class="floating-toolbar">
          <transition name="slide-fade">
            <div v-if="isSearchExpanded" class="search-filter">
              <el-input
                v-model="searchQuery"
                placeholder="搜索角色名称"
                clearable
                @input="handleSearch"
                class="search-input"
              >
                <template #prefix>
                  <i class="fas fa-search"></i>
                </template>
              </el-input>
            </div>
          </transition>
          
          <transition name="slide-fade">
            <div v-if="isFilterExpanded" class="filter-wrapper">
              <el-select
                v-model="filterGender"
                placeholder="性别筛选"
                clearable
                @change="handleFilter"
                class="filter-select"
              >
                <el-option label="全部" value="" />
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="其他" value="其他" />
              </el-select>
            </div>
          </transition>

          <transition name="slide-fade">
            <div v-if="isSortExpanded" class="sort-wrapper">
              <el-select
                v-model="sortBy"
                placeholder="排序方式"
                @change="handleSort"
                class="sort-select"
              >
                <el-option label="创建时间 ↑" value="timeAsc" />
                <el-option label="创建时间 ↓" value="timeDesc" />
                <el-option label="名称 A-Z" value="nameAsc" />
                <el-option label="名称 Z-A" value="nameDesc" />
              </el-select>
            </div>
          </transition>

          <div class="action-buttons">
            <el-tooltip content="搜索" placement="left">
              <el-button
                circle
                :type="isSearchExpanded ? 'primary' : 'default'"
                @click="toggleSearch"
              >
                <i class="fas fa-search"></i>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="筛选" placement="left">
              <el-button
                circle
                :type="isFilterExpanded ? 'primary' : 'default'"
                @click="toggleFilter"
              >
                <i class="fas fa-filter"></i>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="排序" placement="left">
              <el-button
                circle
                :type="isSortExpanded ? 'primary' : 'default'"
                @click="toggleSort"
              >
                <i class="fas fa-sort"></i>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="批量选择" placement="left">
              <el-button
                circle
                :type="isSelectionMode ? 'success' : 'default'"
                @click="toggleSelectionMode"
              >
                <i class="fas" :class="isSelectionMode ? 'fa-check-square' : 'fa-square'"></i>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="批量删除" placement="left">
              <el-button
                circle
                type="danger"
                :disabled="!selectedOcs.length"
                @click="handleBatchDelete"
              >
                <i class="fas fa-trash-alt"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <div class="action-cards">
          <div class="card create-card" @click="showNewOcDialog" v-if="!isSelectionMode">
            <div class="card-image create-image">
              <i class="fas fa-plus"></i>
            </div>
            <div class="card-content">
              <h3>创建新角色</h3>
              <p>开始创建一个新的原创角色</p>
            </div>
          </div>
          
          <div 
            v-for="oc in filteredOcList" 
            :key="oc.ocId" 
            class="card oc-card"
            :class="{
              'selected': selectedOcs.includes(oc.ocId),
              'selection-mode': isSelectionMode
            }"
            @click="isSelectionMode ? toggleOcSelection(oc.ocId) : handleOcClick(oc.ocId)"
          >
            <div class="selection-indicator" v-if="isSelectionMode && selectedOcs.includes(oc.ocId)">
              <i class="fas fa-check"></i>
            </div>
            <div class="card-image">
              <template v-if="oc.abbUrl">
                <div class="image-container" :class="{ 'loading': imageLoadingStates[oc.ocId] }">
                  <img 
                    :src="oc.abbUrl" 
                    :alt="oc.name"
                    class="oc-image"
                    @load="handleImageLoad(oc.ocId)"
                    @error="handleImageError(oc.ocId)"
                  >
                  <div v-if="imageLoadingStates[oc.ocId]" class="image-loading-overlay">
                    <el-icon class="loading-icon"><Loading /></el-icon>
                  </div>
                  <div v-if="imageErrorStates[oc.ocId]" class="image-error-overlay">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>加载失败</span>
                  </div>
                </div>
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

        <!-- 确认删除对话框 -->
        <el-dialog
          v-model="deleteDialogVisible"
          title="确认删除"
          width="30%"
        >
          <span>{{ deleteDialogMessage }}</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="deleteDialogVisible = false">取消</el-button>
              <el-button type="danger" @click="confirmDelete">确认删除</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </LoadingWrapper>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOcBaseInfo, batchDeleteOcs } from '@/api/oc'
import type { OcBaseInfo } from '@/api/oc'
import MainLayout from '@/components/Layout/MainLayout.vue'
import NewOc from '@/components/NewOc.vue'
import LoadingWrapper from '@/components/LoadingWrapper.vue'
import { Loading } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'MyOc',
  
  components: {
    MainLayout,
    NewOc,
    LoadingWrapper,
    Loading
  },

  setup() {
    const router = useRouter()
    const createDialogVisible = ref(false)
    const deleteDialogVisible = ref(false)
    const ocList = ref<OcBaseInfo[]>([])
    const isLoading = ref(true)
    const searchQuery = ref('')
    const filterGender = ref('')
    const sortBy = ref('timeAsc')
    const isSelectionMode = ref(false)
    const selectedOcs = ref<number[]>([])
    const deleteDialogMessage = ref('')
    const ocsToDelete = ref<number[]>([])
    const isSearchExpanded = ref(false)
    const isFilterExpanded = ref(false)
    const isSortExpanded = ref(false)
    const imageLoadingStates = ref<Record<number, boolean>>({})
    const imageErrorStates = ref<Record<number, boolean>>({})

    const filteredOcList = computed(() => {
      let result = [...ocList.value]
      
      // 搜索过滤
      if (searchQuery.value) {
        result = result.filter(oc => 
          oc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      // 性别过滤
      if (filterGender.value) {
        result = result.filter(oc => oc.gender === filterGender.value)
      }

      // 排序
      result.sort((a, b) => {
        switch (sortBy.value) {
          case 'nameAsc':
            return a.name.localeCompare(b.name)
          case 'nameDesc':
            return b.name.localeCompare(a.name)
          case 'timeAsc':
            return a.ocId - b.ocId
          case 'timeDesc':
            return b.ocId - a.ocId
          default:
            return a.ocId - b.ocId
        }
      })

      return result
    })

    const handleSearch = () => {
      // 搜索功能通过计算属性实现
    }

    const handleFilter = () => {
      // 筛选功能已通过计算属性实现
    }

    const handleSort = () => {
      // 排序功能已通过计算属性实现
    }

    const toggleSelectionMode = () => {
      isSelectionMode.value = !isSelectionMode.value
      if (!isSelectionMode.value) {
        selectedOcs.value = []
      }
    }

    const toggleOcSelection = (ocId: number) => {
      const index = selectedOcs.value.indexOf(ocId)
      if (index === -1) {
        selectedOcs.value.push(ocId)
      } else {
        selectedOcs.value.splice(index, 1)
      }
    }

    const handleBatchDelete = () => {
      if (selectedOcs.value.length === 0) return
      deleteDialogMessage.value = `确定要删除选中的 ${selectedOcs.value.length} 个角色吗？此操作不可撤销。`
      ocsToDelete.value = [...selectedOcs.value]
      deleteDialogVisible.value = true
    }

    const handleDelete = (ocId: number) => {
      deleteDialogMessage.value = '确定要删除这个角色吗？此操作不可撤销。'
      ocsToDelete.value = [ocId]
      deleteDialogVisible.value = true
    }

    const confirmDelete = async () => {
      try {
        await batchDeleteOcs(ocsToDelete.value)
        ElMessage.success('删除成功')
        await fetchOcList()
        selectedOcs.value = []
        isSelectionMode.value = false
      } catch (error) {
        ElMessage.error('删除失败')
      } finally {
        deleteDialogVisible.value = false
      }
    }

    const handleEdit = (ocId: number) => {
      router.push(`/oc/${ocId}/edit`)
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

    const toggleSearch = () => {
      isSearchExpanded.value = !isSearchExpanded.value
      if (!isSearchExpanded.value) {
        searchQuery.value = ''
      }
      isFilterExpanded.value = false
      isSortExpanded.value = false
    }

    const toggleFilter = () => {
      isFilterExpanded.value = !isFilterExpanded.value
      if (!isFilterExpanded.value) {
        filterGender.value = ''
      }
      isSearchExpanded.value = false
      isSortExpanded.value = false
    }

    const toggleSort = () => {
      isSortExpanded.value = !isSortExpanded.value
      isSearchExpanded.value = false
      isFilterExpanded.value = false
    }

    const handleImageLoad = (ocId: number) => {
      imageLoadingStates.value[ocId] = false
      imageErrorStates.value[ocId] = false
    }

    const handleImageError = (ocId: number) => {
      imageLoadingStates.value[ocId] = false
      imageErrorStates.value[ocId] = true
    }

    const fetchOcList = async () => {
      try {
        isLoading.value = true
        const response = await getOcBaseInfo()
        if (response.data) {
          ocList.value = response.data
          // 初始化所有图片的加载状态
          response.data.forEach((oc: OcBaseInfo) => {
            if (oc.abbUrl) {
              imageLoadingStates.value[oc.ocId] = true
              imageErrorStates.value[oc.ocId] = false
            }
          })
        }
      } catch (error) {
        ElMessage.error('获取角色列表失败')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchOcList()
    })

    return {
      createDialogVisible,
      deleteDialogVisible,
      ocList,
      filteredOcList,
      showNewOcDialog,
      handleClose,
      handleSaveSuccess,
      handleOcClick,
      isLoading,
      searchQuery,
      filterGender,
      sortBy,
      handleSearch,
      handleFilter,
      handleSort,
      isSelectionMode,
      selectedOcs,
      toggleSelectionMode,
      toggleOcSelection,
      handleBatchDelete,
      handleDelete,
      handleEdit,
      deleteDialogMessage,
      confirmDelete,
      isSearchExpanded,
      isFilterExpanded,
      isSortExpanded,
      toggleSearch,
      toggleFilter,
      toggleSort,
      imageLoadingStates,
      imageErrorStates,
      handleImageLoad,
      handleImageError
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
  border: 2px solid transparent;
}

.oc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.oc-card.selection-mode {
  transform: scale(0.98);
}

.oc-card.selection-mode:hover {
  transform: scale(1);
}

.oc-card.selected {
  border-color: #409EFF;
  background: rgba(64, 158, 255, 0.05);
}

.selection-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2;
  animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
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

/* 加载动画样式自定义 */
:deep(.el-loading-spinner .circular) {
  width: 50px;
  height: 50px;
  animation: loading-rotate 2s linear infinite;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: #8B5CF6;
  font-size: 16px;
  margin-top: 12px;
}

:deep(.el-loading-spinner .path) {
  stroke: #8B5CF6;
  stroke-width: 2;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

.toolbar {
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-filter {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-filter .el-input {
  width: 200px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.card {
  position: relative;
}

.selection-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.oc-card.selected {
  border: 2px solid #409EFF;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(64, 158, 255, 0.2);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.action-icon {
  cursor: pointer;
  color: #666;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

.action-icon:hover {
  color: #409EFF;
}

.action-icon.delete:hover {
  color: #F56C6C;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter {
    flex-direction: column;
  }

  .search-filter .el-input,
  .search-filter .el-select {
    width: 100%;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-buttons .el-button {
    flex: 1;
  }
}

.floating-toolbar {
  position: fixed;
  right: 20px;
  top: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  z-index: 100;
}

.search-filter,
.filter-wrapper,
.sort-wrapper {
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
}

.search-input,
.filter-select,
.sort-select {
  width: 200px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.action-buttons .el-button {
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: scale(1.1);
}

/* 卡片操作按钮样式 */
.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.oc-card:hover .card-actions {
  opacity: 1;
}

/* 动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floating-toolbar {
    position: fixed;
    bottom: 20px;
    top: auto;
    right: 20px;
    flex-direction: column-reverse;
  }

  .search-filter,
  .filter-wrapper,
  .sort-wrapper {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
  }
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-container.loading .oc-image {
  opacity: 0.5;
}

.image-loading-overlay,
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
  background: rgba(255, 255, 255, 0.8);
  gap: 8px;
}

.image-loading-overlay .loading-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  animation: rotate 1s linear infinite;
}

.image-error-overlay {
  background: rgba(245, 108, 108, 0.1);
}

.image-error-overlay i {
  font-size: 24px;
  color: var(--el-color-danger);
}

.image-error-overlay span {
  font-size: 14px;
  color: var(--el-color-danger);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
