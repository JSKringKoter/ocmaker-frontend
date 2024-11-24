<template>
  <div class="new-oc">
    <div class="oc-form">
      <div class="form-row-sections">
        <div class="form-section half">
          <h2>基本信息</h2>
          <div class="card-content">
            <div class="form-group">
              <label>角色名称 <span class="required">*</span></label>
              <input 
                v-model="character.name" 
                type="text" 
                maxlength="64"
                placeholder="给你的角色起个名字（最多64个字符）"
              >
            </div>
            
            <div class="form-group">
              <label>性别 <span class="required">*</span></label>
              <input 
                v-model="character.gender" 
                type="text"
                maxlength="16"
                placeholder="角色性别"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group third">
                <label>年龄 <span class="required">*</span></label>
                <input 
                  v-model.number="character.age" 
                  type="number" 
                  min="0"
                  placeholder="角色年龄"
                >
              </div>
              <div class="form-group third">
                <label>身高(cm) <span class="required">*</span></label>
                <input 
                  v-model.number="character.height" 
                  type="number"
                  min="0" 
                  placeholder="角色身高"
                >
              </div>
              <div class="form-group third">
                <label>体重(kg) <span class="required">*</span></label>
                <input 
                  v-model.number="character.weight" 
                  type="number"
                  min="0" 
                  placeholder="角色体重"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="form-section half">
          <h2>外观特征</h2>
          <div class="card-content">
            <div class="form-row">
              <div class="form-group half">
                <label>肤色</label>
                <input 
                  v-model="character.skinColor" 
                  type="text"
                  maxlength="16"
                  placeholder="描述肤色"
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label>发型</label>
                <input 
                  v-model="character.hair" 
                  type="text"
                  maxlength="16"
                  placeholder="描述发型"
                >
              </div>
              <div class="form-group half">
                <label>发色</label>
                <input 
                  v-model="character.hairColor" 
                  type="text"
                  maxlength="16"
                  placeholder="描述发色"
                >
              </div>
              <div class="form-group half">
                <label>瞳色</label>
                <input 
                  v-model="character.eyesColor" 
                  type="text"
                  maxlength="16"
                  placeholder="描述瞳色"
                >
              </div>
            </div>

            <div class="form-group">
              <label>身体特征</label>
              <textarea 
                v-model="character.body" 
                maxlength="255"
                rows="3" 
                placeholder="描述体型、体格等身体特征（最多255个字符）"
              ></textarea>
            </div>

            <div class="form-group">
              <label>面部特征</label>
              <textarea 
                v-model="character.face" 
                maxlength="255"
                rows="3" 
                placeholder="描述五官、面部特征等（最多255个字符）"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2>性格与特长</h2>
        <div class="card-content">
          <div class="form-group">
            <label>性格特点</label>
            <textarea 
              v-model="character.personality" 
              maxlength="255"
              rows="3" 
              placeholder="描述性格、行为方式等（最多255个字符）"
            ></textarea>
          </div>

          <div class="form-group">
            <label>特长</label>
            <textarea 
              v-model="character.skill" 
              maxlength="128"
              rows="2" 
              placeholder="描述角色的特长、擅长的领域（最多128个字符）"
            ></textarea>
          </div>

          <div class="form-group">
            <label>爱好</label>
            <textarea 
              v-model="character.hobby" 
              maxlength="128"
              rows="2" 
              placeholder="描述角色的兴趣爱好（最多128个字符）"
            ></textarea>
          </div>
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
            保存角色
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { createNewOc, OcData } from '@/api/oc'

export default defineComponent({
  name: 'NewOc',

  data() {
    return {
      isSubmitting: false,
      character: {
        name: '',
        gender: '',
        age: NaN,
        height: NaN,
        weight: NaN,
        skinColor: '',
        hair: '',
        hairColor: '',
        eyesColor: '',
        body: '',
        face: '',
        personality: '',
        skill: '',
        hobby: ''
      } as OcData
    }
  },

  methods: {
    handleCancel() {
      this.character = {
        name: '',
        gender: '',
        age: NaN,
        height: NaN,
        weight: NaN,
        skinColor: '',
        hair: '',
        hairColor: '',
        eyesColor: '',
        body: '',
        face: '',
        personality: '',
        skill: '',
        hobby: ''
      }
      this.$emit('cancel')
    },

    async handleSubmit() {
      if (!this.character.name) {
        ElMessage.warning('请输入角色名称')
        return
      }
      if (!this.character.gender) {
        ElMessage.warning('请选择性别')
        return
      }
      if (!this.character.age) {
        ElMessage.warning('请输入年龄')
        return
      }
      if (!this.character.height) {
        ElMessage.warning('请输入身高')
        return
      }
      if (!this.character.weight) {
        ElMessage.warning('请输入体重')
        return
      }

      try {
        this.isSubmitting = true
        await createNewOc(this.character)
        
        ElMessage.success('角色创建成功！')
        this.$emit('save-success')
        
      } catch (error: any) {
        console.error('创建角色失败:', error)
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

.new-oc {
  position: relative;
  height: calc(80vh - 120px);
  overflow-y: auto;
  padding: 20px;
}

.oc-form {
  height: 100%;
}

/* 卡片基础样式 */
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

.card-content {
  padding: 24px;
}

.form-row-sections {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-section.half {
  flex: 1;
  min-width: 0;
}

.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group.half {
  flex: 1;
  min-width: 0;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 16px;
}

.required {
  color: #f56c6c;
  margin-left: 4px;
}

input, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-size: 16px;
}

textarea {
  min-height: 120px;
  resize: vertical;
  max-height: 120px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
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

/* 添加三等分布局样式 */
.form-group.third {
  flex: 1;
  min-width: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-group.half,
  .form-group.third {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .form-row-sections {
    flex-direction: column;
    gap: 24px;
  }
  
  .form-section.half {
    width: 100%;
  }
}

@media screen and (max-width: 1200px) {
  :deep(.el-dialog) {
    width: 75% !important;
  }
}

@media screen and (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
  }
}

@media screen and (max-height: 800px) {
  :deep(.el-dialog) {
    height: 85vh !important;
    margin: 7.5vh auto !important;
  }
  
  .new-oc {
    height: calc(85vh - 120px);
  }
}

@media screen and (max-height: 600px) {
  :deep(.el-dialog) {
    height: 90vh !important;
    margin: 5vh auto !important;
  }
  
  .new-oc {
    height: calc(90vh - 120px);
  }
}

::placeholder {
  color: #a0aec0;
}
</style>