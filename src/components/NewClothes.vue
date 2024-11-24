<template>
  <div class="new-clothes">
    <div class="clothes-form">
      <div class="form-section">
        <h2>基本信息</h2>
        <div class="form-group">
          <label>服装名称 <span class="required">*</span></label>
          <input 
            v-model="clothes.name" 
            type="text" 
            maxlength="64"
            placeholder="给这套服装起个名字（最多64个字符）"
          >
        </div>
        
        <div class="form-group">
          <label>服装描述</label>
          <textarea 
            v-model="clothes.describe" 
            maxlength="255"
            rows="3" 
            placeholder="描述这套服装的整体风格、特点等（最多255个字符）"
          ></textarea>
        </div>
      </div>

      <div class="form-section">
        <h2>服装细节</h2>
        <div class="form-row">
          <div class="form-group half">
            <label>帽饰</label>
            <input 
              v-model="clothes.hat"
              type="text"
              maxlength="64"
              placeholder="帽子、头饰等"
            >
          </div>
          
          <div class="form-group half">
            <label>面部装饰</label>
            <input 
              v-model="clothes.faceDecorate"
              type="text"
              maxlength="64"
              placeholder="面具、眼镜等"
            >
          </div>
        </div>

        <div class="form-group">
          <label>上装</label>
          <input 
            v-model="clothes.uppers"
            type="text"
            maxlength="64"
            placeholder="上衣、外套等"
          >
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>腰带</label>
            <input 
              v-model="clothes.belt"
              type="text"
              maxlength="64"
              placeholder="腰带、饰带等"
            >
          </div>
          
          <div class="form-group half">
            <label>下装</label>
            <input 
              v-model="clothes.bottoms"
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
              v-model="clothes.legDecorate"
              type="text"
              maxlength="64"
              placeholder="袜子、绑带等"
            >
          </div>
          
          <div class="form-group half">
            <label>鞋子</label>
            <input 
              v-model="clothes.shoes"
              type="text"
              maxlength="64"
              placeholder="鞋子、靴子等"
            >
          </div>
        </div>

        <div class="form-group">
          <label>其他装饰</label>
          <textarea 
            v-model="clothes.otherDecorate"
            maxlength="128"
            rows="2"
            placeholder="其他配饰、装饰品等（最多128个字符）"
          ></textarea>
        </div>
      </div>

      <div class="detail-card action-card">
        <div class="form-actions">
          <el-button @click="handleCancel">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button color="#8B5CF6" @click="handleSubmit" :loading="isSubmitting">
            <el-icon><Check /></el-icon>
            保存服装
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { createNewClothes, ClothesData } from '@/api/clothes'
import { Check, Close } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'NewClothes',
  
  components: {
    Check,
    Close
  },

  props: {
    ocId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      isSubmitting: false,
      clothes: {
        name: '',
        describe: '',
        imgUrl: '',
        hat: '',
        faceDecorate: '',
        uppers: '',
        belt: '',
        bottoms: '',
        legDecorate: '',
        shoes: '',
        otherDecorate: '',
        clothesOcId: this.ocId
      } as ClothesData
    }
  },

  methods: {
    handleCancel() {
      // 重置表单数据
      this.clothes = {
        name: '',
        describe: '',
        imgUrl: '',
        hat: '',
        faceDecorate: '',
        uppers: '',
        belt: '',
        bottoms: '',
        legDecorate: '',
        shoes: '',
        otherDecorate: '',
        clothesOcId: this.ocId
      }
      this.$emit('cancel')
    },

    async handleSubmit() {
      // 表单验证
      if (!this.clothes.name) {
        ElMessage.warning('请输入服装名称')
        return
      }

      try {
        this.isSubmitting = true
        await createNewClothes(this.clothes)
        
        ElMessage.success('服装创建成功！')
        this.$emit('save-success')
        
      } catch (error: any) {
        console.error('创建服装失败:', error)
        ElMessage.error(
          error.response?.data?.message || 
          '创建失败，请稍后重试'
        )
      } finally {
        this.isSubmitting = false
      }
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

.new-clothes {
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

/* 操作按钮卡片样式 */
.action-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
  margin-top: 20px;
}

.action-card:hover {
  box-shadow: 0 8px 12px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 20px 24px;
  border-top: none;
  margin-top: 0;
}

/* 按钮样式 */
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

/* 响应式调整 */
@media (max-width: 768px) {
  .action-card {
    margin-top: 16px;
  }
  
  .form-actions {
    padding: 16px 20px;
  }
  
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
</style> 