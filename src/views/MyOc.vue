<template>
  <MainLayout>
    <div class="home">
      <div class="welcome-section">
        <h1>我的OC角色</h1>
        <p>在这里管理你的原创角色</p>
      </div>

      <div class="action-cards">
        <div class="card create-card" @click="showNewOcDialog">
          <div class="card-content">
            <i class="fas fa-plus-circle"></i>
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
          <div class="card-content">
            <i class="fas fa-user-circle"></i>
            <h3>{{ oc.name }}</h3>
            <p>{{ oc.gender }} · {{ oc.age }}岁</p>
          </div>
        </div>
      </div>

      <el-dialog
        v-model="createDialogVisible"
        title="创建新角色"
        width="80%"
        :before-close="handleClose"
        custom-class="oc-dialog"
      >
        <NewOc @save-success="handleSaveSuccess" />
      </el-dialog>

      <el-dialog
        v-model="detailDialogVisible"
        :title="currentOc?.name || '角色详情'"
        width="90%"
        custom-class="oc-dialog"
      >
        <div v-if="currentOc" class="oc-detail-container">
          <div class="oc-detail">
            <div class="detail-section">
              <h3>基本信息</h3>
              <div class="detail-grid basic-info-grid">
                <div class="detail-item">
                  <label>性别</label>
                  <span>{{ currentOc.gender }}</span>
                </div>
                <div class="detail-item">
                  <label>年龄</label>
                  <span>{{ currentOc.age }}岁</span>
                </div>
                <div class="detail-item">
                  <label>身高</label>
                  <span>{{ currentOc.height }}cm</span>
                </div>
                <div class="detail-item">
                  <label>体重</label>
                  <span>{{ currentOc.weight }}kg</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>外貌特征</h3>
              <div class="detail-grid appearance-grid">
                <div class="detail-item">
                  <label>肤色</label>
                  <span>{{ currentOc.skinColor }}</span>
                </div>
                <div class="detail-item">
                  <label>发型</label>
                  <span>{{ currentOc.hair }}</span>
                </div>
                <div class="detail-item">
                  <label>发色</label>
                  <span>{{ currentOc.hairColor }}</span>
                </div>
                <div class="detail-item">
                  <label>瞳色</label>
                  <span>{{ currentOc.eyesColor }}</span>
                </div>
              </div>
              <div class="detail-text">
                <label>身体特征</label>
                <p>{{ currentOc.body }}</p>
              </div>
              <div class="detail-text">
                <label>面部特征</label>
                <p>{{ currentOc.face }}</p>
              </div>
            </div>

            <div class="detail-section">
              <h3>个性特征</h3>
              <div class="detail-text">
                <label>性格特点</label>
                <p>{{ currentOc.personality }}</p>
              </div>
              <div class="detail-text">
                <label>特长</label>
                <p>{{ currentOc.skill }}</p>
              </div>
              <div class="detail-text">
                <label>爱好</label>
                <p>{{ currentOc.hobby }}</p>
              </div>
            </div>
          </div>
          
          <div class="costume-section">
            <h3>Ta的服装</h3>
            <div class="costume-grid">
              <div class="card create-card" @click="showNewCostumeDialog">
                <div class="card-content">
                  <i class="fas fa-tshirt"></i>
                  <h3>添加新服装</h3>
                  <p>为角色添加新的服装搭配</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainLayout from '@/components/Layout/MainLayout.vue'
import NewOc from '@/components/NewOc.vue'
import { ElDialog, ElMessage } from 'element-plus'
import { getOcBaseInfo, type OcBaseInfo, getOcDetail, type OcDetail } from '@/api/oc'

export default defineComponent({
  name: 'MyOc',
  components: {
    MainLayout,
    NewOc,
    ElDialog
  },
  data() {
    return {
      createDialogVisible: false,
      detailDialogVisible: false,
      ocList: [] as OcBaseInfo[],
      currentOc: null as OcDetail | null
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
    },
    async handleSaveSuccess() {
      this.createDialogVisible = false
      await this.fetchOcList() // 创建成功后刷新列表
    },
    async showOcDetail(ocId: number) {
      try {
        const response = await getOcDetail(ocId)
        if (response.data) {
          this.currentOc = response.data
          this.detailDialogVisible = true
        }
      } catch (error) {
        ElMessage.error('获取角色详情失败')
      }
    },
    showNewCostumeDialog() {
      console.log('显示添加服装对话框')
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
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-card {
  cursor: pointer;
  border: 2px dashed #4299e1;
  background: rgba(66, 153, 225, 0.05);
}

.create-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 15px rgba(66, 153, 225, 0.2);
  border-color: #3182ce;
}

.card-content {
  padding: 30px;
  text-align: center;
}

.card-content i {
  font-size: 3em;
  color: #4299e1;
  margin-bottom: 15px;
}

.card-content h3 {
  color: #2d3748;
  margin-bottom: 10px;
}

.card-content p {
  color: #718096;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .home {
    padding: 20px 10px;
  }
  
  .welcome-section h1 {
    font-size: 2em;
  }
}

:deep(.oc-dialog) {
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
  padding: 24px;
  max-height: 85vh;
  overflow-y: auto;
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
  background: rgba(66, 153, 225, 0.05);
  border: 2px solid #4299e1;
}

.oc-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 15px rgba(66, 153, 225, 0.2);
}

.oc-card .card-content i {
  font-size: 3em;
  color: #4299e1;
  margin-bottom: 15px;
}

.oc-card .card-content h3 {
  color: #2d3748;
  margin-bottom: 10px;
}

.oc-card .card-content p {
  color: #718096;
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
    grid-template-columns: 1fr;
    padding: 20px 10px;
  }
}

/* 详情对话框样式 */
.oc-detail {
  padding: 20px;
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
  display: grid;
  grid-template-areas: 
    "gender age"
    "height weight";
  gap: 20px;
}

.appearance-grid {
  display: grid;
  grid-template-areas:
    "skin hair"
    "hairColor eyesColor";
  gap: 20px;
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

.detail-item span {
  color: #2c5282;
  font-size: 1.1em;
  text-decoration: underline;
  font-family: 'Ma Shan Zheng', cursive;
  transition: all 0.3s ease;
}

.detail-text p {
  color: #2c5282;
  font-size: 1.1em;
  line-height: 1.8;
  text-decoration: underline;
  font-family: 'Ma Shan Zheng', cursive;
  transition: all 0.3s ease;
}

.oc-detail-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 30px;
}

.oc-detail {
  padding: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.costume-section {
  padding: 20px;
  animation: fadeIn 0.8s ease-out;
}

.costume-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.costume-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px 0;
  margin: 0 auto;
  max-width: 800px;
}

.costume-card {
  width: 100%;
  min-width: 200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.costume-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 15px rgba(66, 153, 225, 0.2);
}

.costume-card .card-content i {
  font-size: 3em;
  color: #4299e1;
  margin-bottom: 15px;
}

.costume-card .card-content h3 {
  color: #2d3748;
  margin-bottom: 10px;
}

.costume-card .card-content p {
  color: #718096;
}

/* 响应式处理 */
@media (max-width: 1200px) {
  .oc-detail-container {
    grid-template-columns: 1fr;
  }
  
  .oc-detail {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
</style>
