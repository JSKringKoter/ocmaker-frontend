<template>
  <el-dialog
    v-model="dialogVisible"
    title="AI绘画设置"
    width="500px"
    :close-on-click-modal="false"
    class="ai-drawing-dialog"
  >
    <div class="drawing-form">
      <div class="form-item">
        <label>API Key <span class="required">*</span></label>
        <el-input 
          v-model="form.apiKey"
          type="password"
          placeholder="请输入您的 API Key"
          show-password
        />
        <div class="hint-text">首次使用需要提供 API Key</div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" :disabled="isGenerating">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm"
          :loading="isGenerating"
          :disabled="!form.apiKey"
        >
          开始生成
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { generateImage } from '@/api/ai'

export default defineComponent({
  name: 'AIDrawingDialog',

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
    const form = ref({
      apiKey: ''
    })
    
    const isGenerating = ref(false)
    
    const dialogVisible = computed({
      get: () => props.visible,
      set: (value) => emit('update:visible', value)
    })

    const handleCancel = () => {
      dialogVisible.value = false
      form.value.apiKey = ''
    }

    const handleConfirm = async () => {
      if (!form.value.apiKey) {
        ElMessage.warning('请输入 API Key')
        return
      }

      try {
        isGenerating.value = true
        await generateImage({
          clothesId: props.clothesId,
          clothesOcId: props.clothesOcId,
          apiKey: form.value.apiKey
        })
        
        ElMessage.success('图片生成成功')
        emit('success')
        dialogVisible.value = false
        form.value.apiKey = ''
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
      handleConfirm
    }
  }
})
</script>

<style scoped>
.drawing-form {
  padding: 20px 0;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 