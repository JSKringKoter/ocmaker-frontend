<template>
    <el-dialog
      v-model="dialogVisible"
      title="修改服装"
      :close-on-click-modal="false"
      width="60%"
      destroy-on-close
    >
      <div class="edit-clothes">
        <div class="clothes-form">
          <div class="form-section">
            <h2>基本信息</h2>
            <div class="form-group">
              <label>服装名称 <span class="required">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                maxlength="64"
                placeholder="给这套服装起个名字（最多64个字符）"
              >
            </div>
            
            <div class="form-group">
              <label>服装描述</label>
              <textarea 
                v-model="form.describe" 
                maxlength="255"
                rows="3" 
                placeholder="描述这套服装的整体风格、特点等（最多255个字符）"
              ></textarea>
            </div>
          </div>
  
          <div class="form-section">
            <h2>服装��节</h2>
            <div class="form-row">
              <div class="form-group half">
                <label>帽饰</label>
                <input 
                  v-model="form.hat"
                  type="text"
                  maxlength="64"
                  placeholder="帽子、头饰等"
                >
              </div>
              
              <div class="form-group half">
                <label>面部装饰</label>
                <input 
                  v-model="form.faceDecorate"
                  type="text"
                  maxlength="64"
                  placeholder="面具、眼镜等"
                >
              </div>
            </div>
  
            <div class="form-group">
              <label>上装</label>
              <input 
                v-model="form.uppers"
                type="text"
                maxlength="64"
                placeholder="上衣、外套等"
              >
            </div>
  
            <div class="form-row">
              <div class="form-group half">
                <label>腰带</label>
                <input 
                  v-model="form.belt"
                  type="text"
                  maxlength="64"
                  placeholder="腰带、饰带等"
                >
              </div>
              
              <div class="form-group half">
                <label>下装</label>
                <input 
                  v-model="form.bottoms"
                  type="text"
                  maxlength="64"
                  placeholder="裤子、裙子等"
                >
              </div>
            </div>
  
            <div class="form-row">
              <div class="form-group half">
                <label>腿部装饰</label>
                <input 
                  v-model="form.legDecorate"
                  type="text"
                  maxlength="64"
                  placeholder="袜子、绑带等"
                >
              </div>
              
              <div class="form-group half">
                <label>鞋子</label>
                <input 
                  v-model="form.shoes"
                  type="text"
                  maxlength="64"
                  placeholder="鞋子、靴子等"
                >
              </div>
            </div>
  
            <div class="form-group">
              <label>其他装饰</label>
              <textarea 
                v-model="form.otherDecorate"
                maxlength="128"
                rows="2"
                placeholder="其他配饰、装饰品等（最多128个字符）"
              ></textarea>
            </div>
          </div>

          <div class="detail-card action-card">
            <div class="form-actions">
              <el-button @click="dialogVisible = false">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
              <el-button color="#8B5CF6" @click="handleSubmit" :loading="isSubmitting">
                <el-icon><Check /></el-icon>
                保存修改
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, PropType, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { ClothesData, ClothesDetailVO, updateClothes } from '@/api/clothes'
  import { Check, Close } from '@element-plus/icons-vue'
  
  export default defineComponent({
    name: 'EditClothes',
  
    components: {
      Check,
      Close
    },
  
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      clothesDetail: {
        type: Object as PropType<ClothesData>,
        required: true
      }
    },
  
    emits: ['update:visible', 'submit-success'],
  
    setup(props, { emit }) {
      const isSubmitting = ref(false)
      const dialogVisible = ref(props.visible)
  
      // 表单数据
      const form = ref<Partial<ClothesData>>({
        name: '',
        describe: '',
        hat: '',
        faceDecorate: '',
        uppers: '',
        belt: '',
        bottoms: '',
        legDecorate: '',
        shoes: '',
        otherDecorate: ''
      })
  
      // 监听 visible 变化
      watch(() => props.visible, (newVal) => {
        dialogVisible.value = newVal
        if (newVal && props.clothesDetail) {
          form.value = JSON.parse(JSON.stringify(props.clothesDetail))
        }
      })
  
      // 监听对话框关闭
      watch(dialogVisible, (newVal) => {
        emit('update:visible', newVal)
      })
  
      // 提交表单
      const handleSubmit = async () => {
        if (!form.value.name) {
          ElMessage.warning('请输入服装名称')
          return
        }
  
        try {
          isSubmitting.value = true
  
          if (!form.value.clothesId || !form.value.clothesOcId) {
            throw new Error('缺少必要的参数')
          }
  
          const updateData: ClothesDetailVO = {
            clothesId: form.value.clothesId,
            clothesOcId: form.value.clothesOcId,
            name: form.value.name!,
            describe: form.value.describe!,
            imgUrl: form.value.imgUrl,
            hat: form.value.hat || undefined,
            faceDecorate: form.value.faceDecorate || undefined,
            uppers: form.value.uppers || undefined,
            belt: form.value.belt || undefined,
            bottoms: form.value.bottoms || undefined,
            legDecorate: form.value.legDecorate || undefined,
            shoes: form.value.shoes || undefined,
            otherDecorate: form.value.otherDecorate || undefined
          }
  
          await updateClothes(updateData)
          
          ElMessage.success('修改成功')
          emit('submit-success', {
            clothesId: form.value.clothesId,
            name: form.value.name,
            describe: form.value.describe
          })
          dialogVisible.value = false
        } catch (error) {
          if (error instanceof Error) {
            ElMessage.error(error.message)
          } else {
            ElMessage.error('修改失败，请重试')
          }
          console.error('提交失败:', error)
        } finally {
          isSubmitting.value = false
        }
      }
  
      return {
        form,
        isSubmitting,
        dialogVisible,
        handleSubmit
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
  
  .edit-clothes {
    position: relative;
    height: calc(80vh - 120px);
    overflow-y: auto;
    padding: 20px;
  }
  
  .clothes-form {
    height: 100%;
  }
  
  .form-section {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(139, 92, 246, 0.1);
    margin-bottom: 20px;
  }
  
  .form-section:hover {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.15);
    transform: translateY(-2px);
  }
  
  .form-section h2 {
    background: var(--primary-lighter);
    padding: 16px 24px;
    border-bottom: 2px solid var(--primary-light);
    color: var(--primary-dark);
    margin: 0;
    font-size: 1.2em;
    font-weight: 600;
  }
  
  .form-section .card-content {
    padding: 24px;
  }
  
  .form-group {
    padding: 24px;
  }
  
  .form-row {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .form-group.half {
    flex: 1;
    min-width: 0;
  }
  
  .form-group label {
    font-weight: 500;
    color: var(--primary-dark);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .required {
    color: #f56c6c;
    margin-left: 4px;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 16px;
    background: white;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 0 0 0;
    margin-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-button) {
    padding: 12px 24px;
    font-size: 1.05rem;
    height: auto;
  }
  
  :deep(.el-button.el-button--primary) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
  
  :deep(.el-button.el-button--primary:hover) {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
  }
  
  :deep(.el-button .el-icon) {
    font-size: 18px;
  }
  
  :deep(.el-button:hover) {
    transform: translateY(-1px);
    transition: all 0.3s ease;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 10px;
    }
    
    .form-group.half {
      width: 100%;
    }
    
    .form-section {
      padding: 16px;
    }
  }
  
  ::placeholder {
    color: #a0aec0;
  }
  
  /* 添加表单动画效果 */
  .form-group {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease;
  }
  
  .form-group:hover {
    transform: translateY(-2px);
  }
  
  /* 对话框样式优化 */
  :deep(.el-dialog) {
    margin: 0 auto;
    max-width: 800px;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  :deep(.el-dialog__title) {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  /* 操作按钮卡片样式 */
  .action-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(139, 92, 246, 0.1);
    margin-top: 20px; /* 与上方卡片的间距 */
  }
  
  .action-card:hover {
    box-shadow: 0 8px 12px rgba(139, 92, 246, 0.15);
    transform: translateY(-2px);
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 24px; /* 调整内边距 */
    border-top: none; /* 移除原有的上边框 */
    margin-top: 0; /* 移除原有的上边距 */
  }
  
  /* 按钮样式优化 */
  :deep(.el-button) {
    padding: 12px 24px;
    font-size: 1.05rem;
    height: auto;
    line-height: 1.5;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  :deep(.el-button .el-icon) {
    font-size: 1.2em;
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .action-card {
      margin-top: 16px;
    }
    
    .form-actions {
      padding: 16px 20px;
    }
  }
  </style> 