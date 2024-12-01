<template>
  <el-dialog
    v-model="dialogVisible"
    title="AI绘画设置"
    width="65%"
    :close-on-click-modal="false"
    class="ai-drawing-dialog"
  >
    <div class="drawing-form">
      <div class="form-content">
        <div class="auth-section">
          <el-radio-group v-model="authType" class="auth-type-group">
            <el-radio-button label="apiKey">使用 API Key</el-radio-button>
            <el-radio-button label="inviteCode">使用邀请码</el-radio-button>
          </el-radio-group>

          <div class="form-item" v-if="authType === 'apiKey'">
            <label>API Key <span class="required">*</span></label>
            <el-input 
              v-model="form.apiKey"
              type="password"
              placeholder="请输入您的 API Key"
              show-password
            />
            <div class="hint-text">首次使用需要提供 API Key</div>
          </div>

          <div class="form-item" v-else>
            <label>邀请码 <span class="required">*</span></label>
            <el-input 
              v-model="form.inviteCode"
              type="text"
              placeholder="请输入邀请码"
            />
            <div class="hint-text">使用邀请码可以让店长给你爆大米</div>
          </div>
        </div>

        <div class="form-section">
          <h3>绘画设置</h3>
          
          <div class="form-item">
            <label>画风</label>
            <el-radio-group v-model="form.config.style" class="style-radio-group">
              <el-radio-button 
                v-for="style in styles" 
                :key="style.value" 
                :label="style.value"
                class="style-radio"
              >
                <div class="style-option">
                  <img :src="style.image" :alt="style.label">
                  <span>{{ style.label }}</span>
                </div>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-item">
            <label>表情</label>
            <el-radio-group v-model="form.config.expression" class="expression-radio-group">
              <el-radio-button 
                v-for="expression in expressions" 
                :key="expression.value" 
                :label="expression.value"
                class="expression-radio"
              >
                <div class="expression-option">
                  <div class="emoji-icon">{{ expression.emoji }}</div>
                  <span>{{ expression.label }}</span>
                </div>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-item">
            <label>人物比例</label>
            <el-radio-group v-model="form.config.proximity" class="proximity-radio-group">
              <el-radio-button 
                v-for="proximity in proximities" 
                :key="proximity.value" 
                :label="proximity.value"
                class="proximity-radio"
              >
                <div class="proximity-option">
                  <img :src="proximity.image" :alt="proximity.label">
                  <span>{{ proximity.label }}</span>
                </div>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-item">
            <label>背景</label>
            <el-radio-group v-model="form.config.background" class="background-radio-group">
              <el-radio-button 
                v-for="background in backgrounds" 
                :key="background.value" 
                :label="background.value"
                class="background-radio"
              >
                <div class="background-option">
                  <img :src="background.image" :alt="background.label">
                  <span>{{ background.label }}</span>
                </div>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <div class="detail-card action-card">
        <div class="form-actions">
          <el-button @click="handleCancel" :disabled="isGenerating">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button 
            color="#8B5CF6" 
            @click="handleConfirm"
            :loading="isGenerating"
            :disabled="!canSubmit"
          >
            <el-icon><Check /></el-icon>
            开始生成
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { generateImage, type AiGenerateConfig } from '@/api/ai'
import { Check, Close } from '@element-plus/icons-vue'

const API_KEY_STORAGE_KEY = 'ai_drawing_api_key'

export default defineComponent({
  name: 'AIDrawingDialog',

  components: {
    Check,
    Close
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
    clothesOcId: {
      type: Number,
      required: true
    }
  },

  emits: ['update:visible', 'success'],

  setup(props, { emit }) {
    // 画风选项
    const styles = [
      { value: 1, label: 'NovelAI原版风格', image: '/images/styles/1.jpg' },
      { value: 2, label: '风格1', image: '/images/styles/2.jpg' },
      { value: 3, label: '风格2', image: '/images/styles/3.jpg' },
      { value: 4, label: '风格3', image: '/images/styles/4.jpg' }
    ]

    // 表情选项
    const expressions = [
      { value: 1, label: '微笑', emoji: '😊' },
      { value: 2, label: '开心', emoji: '😄' },
      { value: 3, label: '伤心', emoji: '😢' },
      { value: 4, label: '面无表情', emoji: '😐' },
      { value: 5, label: '生气', emoji: '😠' }
    ]

    // 人物比例选项
    const proximities = [
      { value: 1, label: '全身', image: '/images/proximities/1.jpg' },
      { value: 2, label: '上半身', image: '/images/proximities/2.jpg' },
      { value: 3, label: '牛仔射击式', image: '/images/proximities/3.jpg' },
      { value: 4, label: '下半身', image: '/images/proximities/4.jpg' }
    ]

    // 背景选项
    const backgrounds = [
      { value: 1, label: '纯白背景', image: '/images/backgrounds/1.jpg' },
      { value: 2, label: '粉色背景', image: '/images/backgrounds/2.jpg' },
      { value: 3, label: '灰色背景', image: '/images/backgrounds/3.jpg' },
      { value: 4, label: '室外场景', image: '/images/backgrounds/4.jpg' },
      { value: 5, label: '室内背景', image: '/images/backgrounds/5.jpg' }
    ]

    // 认证类型
    const authType = ref('apiKey')

    const form = ref({
      apiKey: '',
      inviteCode: '',
      config: {
        style: 1,
        expression: 1,
        proximity: 2,
        background: 1
      } as AiGenerateConfig
    })
    
    const isGenerating = ref(false)
    
    const dialogVisible = computed({
      get: () => props.visible,
      set: (value) => emit('update:visible', value)
    })

    // 是否可以提交
    const canSubmit = computed(() => {
      if (authType.value === 'apiKey') {
        return !!form.value.apiKey
      } else {
        return !!form.value.inviteCode
      }
    })

    // 加载保存的 API Key
    const loadSavedApiKey = () => {
      const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY)
      if (savedApiKey) {
        form.value.apiKey = savedApiKey
      }
    }

    // 保存 API Key
    const saveApiKey = (apiKey: string) => {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey)
    }

    onMounted(() => {
      loadSavedApiKey()
    })

    const handleCancel = () => {
      dialogVisible.value = false
      // 不清除 API Key，保持记忆功能
      form.value.inviteCode = ''
      form.value.config = {
        style: 1,
        expression: 1,
        proximity: 2,
        background: 1
      }
      authType.value = 'apiKey'
    }

    const handleConfirm = async () => {
      if (authType.value === 'apiKey' && !form.value.apiKey) {
        ElMessage.warning('请输入 API Key')
        return
      }
      if (authType.value === 'inviteCode' && !form.value.inviteCode) {
        ElMessage.warning('请输入邀请码')
        return
      }

      try {
        isGenerating.value = true
        
        // 根据认证类型选择使用的密钥
        const apiKeyToUse = authType.value === 'apiKey' ? form.value.apiKey : form.value.inviteCode

        await generateImage({
          clothesId: props.clothesId,
          clothesOcId: props.clothesOcId,
          apiKey: apiKeyToUse,
          config: form.value.config
        })
        
        // 如果使用的是 API Key，则保存它
        if (authType.value === 'apiKey') {
          saveApiKey(form.value.apiKey)
        }

        ElMessage.success('图片生成成功')
        emit('success')
        dialogVisible.value = false
        
        // 清除邀请码，但保留 API Key
        form.value.inviteCode = ''
        form.value.config = {
          style: 1,
          expression: 1,
          proximity: 2,
          background: 1
        }
        authType.value = 'apiKey'
      } catch (error: any) {
        ElMessage.error(
          error.response?.data?.message || 
          '生成失败，请重试'
        )
      } finally {
        isGenerating.value = false
      }
    }

    return {
      form,
      isGenerating,
      dialogVisible,
      handleCancel,
      handleConfirm,
      styles,
      expressions,
      proximities,
      backgrounds,
      authType,
      canSubmit
    }
  }
})
</script>

<style scoped>
.drawing-form {
  display: flex;
  flex-direction: column;
  height: calc(80vh - 120px);
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.auth-section {
  margin-bottom: 24px;
}

.auth-type-group {
  margin-bottom: 16px;
}

:deep(.auth-type-group .el-radio-button__inner) {
  width: auto;
  height: auto;
  padding: 8px 20px;
  border-radius: 0 !important;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #DC2626;
  margin-left: 4px;
}

.hint-text {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6B7280;
}

.form-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.form-section h3 {
  margin-bottom: 16px;
  font-size: 1rem;
  color: #374151;
}

/* 单选框组样式 */
.style-radio-group,
.expression-radio-group,
.proximity-radio-group,
.background-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: fit-content;
}

/* 单选按钮样式 */
:deep(.el-radio-button__inner) {
  padding: 0;
  width: 100px;
  height: 100px;
  border: 2px solid transparent;
  border-radius: 8px !important;
  overflow: hidden;
  background: transparent;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

:deep(.el-radio-button:not(:last-child)) {
  margin-right: 0;
}

/* 移除默认样式 */
:deep(.el-radio-button__inner:hover),
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  color: inherit;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}

/* 未选中状态的悬停效果 */
:deep(.el-radio-button__inner:hover) {
  background-color: #F5F3FF !important;
  border-color: #DDD6FE !important;
  z-index: 1;
}

/* 选中状态 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border-color: #8B5CF6 !important;
  background-color: #F5F3FF !important;
  color: #6D28D9 !important;
  box-shadow: 0 0 0 1px #8B5CF6 !important;
  z-index: 1;
}

/* 选中状态的悬停效果 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner:hover) {
  background-color: #EDE9FE !important;
}

/* 禁用状态 */
:deep(.el-radio-button.is-disabled .el-radio-button__inner) {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #F9FAFB !important;
  border-color: #E5E7EB !important;
  color: #9CA3AF !important;
}

/* 移除默认的焦点样式 */
:deep(.el-radio-button__inner:focus-visible) {
  outline: none !important;
}

/* 移除相邻按钮的边框重叠 */
:deep(.el-radio-button:not(:first-child) .el-radio-button__inner) {
  border-left: 2px solid transparent;
  margin-left: 0;
}

/* 选项样式 */
.style-option,
.expression-option,
.proximity-option,
.background-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
}

/* 图片样式 */
.style-option img,
.proximity-option img,
.background-option img {
  width: 84px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

/* 选中状态下的图片效果 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .style-option img,
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .proximity-option img,
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .background-option img {
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

/* 表情图标样式 */
.emoji-icon {
  font-size: 2.5rem;
  margin-bottom: 4px;
  line-height: 60px;
  transition: all 0.3s ease;
}

/* 选中状态下的表情图标效果 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .emoji-icon {
  transform: scale(1.05);
}

/* 选项文字样式 */
.style-option span,
.expression-option span,
.proximity-option span,
.background-option span {
  font-size: 0.75rem;
  color: #374151;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
}

/* 选中状态下的文字效果 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .style-option span,
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .expression-option span,
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .proximity-option span,
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) .background-option span {
  color: #6D28D9;
  font-weight: 500;
}

/* 吸底卡片样式 */
.detail-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.action-card {
  margin-top: auto;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: white;
}

/* 美化滚动条 */
.form-content::-webkit-scrollbar {
  width: 6px;
}

.form-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.form-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  margin-top: 5vh !important;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button [class*="el-icon"] + span) {
  margin-left: 6px;
}
</style> 