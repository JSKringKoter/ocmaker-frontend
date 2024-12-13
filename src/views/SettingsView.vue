<template>
  <MainLayout>
    <template #title>设置</template>
    <div class="settings-container">
      <div class="settings-content">
        <div class="settings-section">
          <h3>背景设置</h3>
          <div class="setting-item">
            <div class="setting-label">
              <span>背景图片</span>
              <span class="setting-description">设置应用的整体背景图片</span>
            </div>
            
            <div class="background-preview" v-if="currentBackground">
              <el-image 
                :src="currentBackground" 
                fit="cover"
                class="preview-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>加载失败</span>
                  </div>
                </template>
              </el-image>
              <div class="preview-actions">
                <el-button 
                  type="danger" 
                  size="small"
                  @click="handleRemoveBackground"
                >
                  <el-icon><Delete /></el-icon>
                  移除背景
                </el-button>
              </div>
            </div>

            <div class="upload-area" v-else>
              <el-upload
                class="background-uploader"
                :auto-upload="false"
                :show-file-list="false"
                accept="image/*"
                @change="handleBackgroundChange"
              >
                <div class="upload-trigger">
                  <div class="upload-icon">
                    <el-icon><Plus /></el-icon>
                  </div>
                  <div class="upload-text">点击选择图片</div>
                  <div class="upload-hint">支持 jpg、png 格式</div>
                </div>
              </el-upload>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>其他设置</h3>
          <div class="setting-item">
            <div class="setting-label">
              <span>背景模糊度</span>
              <span class="setting-description">调整背景图片的模糊程度</span>
            </div>
            <div class="setting-control">
              <el-slider
                v-model="blurLevel"
                :min="0"
                :max="20"
                :step="1"
                :show-tooltip="true"
                :format-tooltip="formatBlurTooltip"
                @change="handleBlurChange"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <span>背景暗度</span>
              <span class="setting-description">调整背景图片的暗度</span>
            </div>
            <div class="setting-control">
              <el-slider
                v-model="darkenLevel"
                :min="0"
                :max="80"
                :step="1"
                :show-tooltip="true"
                :format-tooltip="formatDarkenTooltip"
                @change="handleDarkenChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Delete, Plus } from '@element-plus/icons-vue'
import MainLayout from '@/components/Layout/MainLayout.vue'

const BACKGROUND_KEY = 'app_background'
const BLUR_LEVEL_KEY = 'background_blur'
const DARKEN_LEVEL_KEY = 'background_darken'

export default defineComponent({
  name: 'SettingsView',

  components: {
    Picture,
    Delete,
    Plus,
    MainLayout
  },

  setup() {
    const currentBackground = ref<string>('')
    const blurLevel = ref(0)
    const darkenLevel = ref(30)

    // 加载保存的设置
    const loadSettings = () => {
      currentBackground.value = localStorage.getItem(BACKGROUND_KEY) || ''
      blurLevel.value = parseInt(localStorage.getItem(BLUR_LEVEL_KEY) || '0')
      darkenLevel.value = parseInt(localStorage.getItem(DARKEN_LEVEL_KEY) || '30')
    }

    // 更新背景设置
    const updateBackgroundStyle = () => {
      const event = new CustomEvent('background-updated', {
        detail: {
          background: currentBackground.value,
          blur: blurLevel.value,
          darken: darkenLevel.value
        }
      })
      window.dispatchEvent(event)
    }

    // 处理背景图片变更
    const handleBackgroundChange = (file: any) => {
      const isImage = file.raw.type.startsWith('image/')
      if (!isImage) {
        ElMessage.error('请上传图片文件')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          currentBackground.value = result
          localStorage.setItem(BACKGROUND_KEY, result)
          updateBackgroundStyle()
          ElMessage.success('背景图片设置成功')
        }
      }
      reader.readAsDataURL(file.raw)
    }

    // 移除背景图片
    const handleRemoveBackground = () => {
      currentBackground.value = ''
      localStorage.removeItem(BACKGROUND_KEY)
      updateBackgroundStyle()
      ElMessage.success('背景图片已移除')
    }

    // 处理模糊度变更
    const handleBlurChange = (value: number) => {
      localStorage.setItem(BLUR_LEVEL_KEY, value.toString())
      updateBackgroundStyle()
    }

    // 处理暗度变更
    const handleDarkenChange = (value: number) => {
      localStorage.setItem(DARKEN_LEVEL_KEY, value.toString())
      updateBackgroundStyle()
    }

    const formatBlurTooltip = (value: number) => `${value}px`
    const formatDarkenTooltip = (value: number) => `${value}%`

    onMounted(() => {
      loadSettings()
    })

    return {
      currentBackground,
      blurLevel,
      darkenLevel,
      handleBackgroundChange,
      handleRemoveBackground,
      handleBlurChange,
      handleDarkenChange,
      formatBlurTooltip,
      formatDarkenTooltip
    }
  }
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
}

.settings-section {
  margin-bottom: 40px;
}

.settings-section h3 {
  color: #2c3e50;
  font-size: 20px;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #EDE9FE;
}

.setting-item {
  margin-bottom: 30px;
}

.setting-label {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.setting-label span:first-child {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.setting-description {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.background-preview, .upload-area {
  width: 60%;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
}

.background-preview {
  background: #f8f9fa;
  border: 2px solid #EDE9FE;
}

.upload-area {
  border: 2px dashed #DDD6FE;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #8B5CF6;
  transform: translateY(-2px);
}

.upload-trigger {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 48px;
  color: #8B5CF6;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: #999;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.preview-actions {
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: flex-end;
}

.image-error {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  background: #f8f9fa;
}

.image-error .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.setting-control {
  padding: 0 12px;
}

:deep(.el-slider) {
  width: 100%;
}

:deep(.el-slider__runway) {
  background-color: #EDE9FE;
}

:deep(.el-slider__bar) {
  background-color: #8B5CF6;
}

:deep(.el-slider__button) {
  border-color: #8B5CF6;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-icon) {
  font-size: inherit;
  color: inherit;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 15px;
  }

  .settings-content {
    padding: 20px;
  }

  .background-preview, .upload-area {
    width: 100%;
  }
}
</style>