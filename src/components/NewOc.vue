<template>
  <div class="new-oc">
    <div class="character-form">
      <div class="form-row-sections">
        <div class="form-section half">
          <h2>基本信息</h2>
          <div class="form-group">
            <label>角色名称 <span class="required">*</span></label>
            <input 
              v-model="character.name" 
              type="text" 
              maxlength="64"
              placeholder="给你的角色起个名字（最多64个字符）"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group third">
              <label>性别 <span class="required">*</span></label>
              <input 
                v-model="character.gender" 
                type="text"
                maxlength="16"
                placeholder="角色性别"
              >
            </div>
  
            <div class="form-group third">
              <label>年龄 <span class="required">*</span></label>
              <input 
                v-model.number="character.age" 
                type="number" 
                min="0"
                required
                placeholder="角色年龄"
              >
            </div>
  
            <div class="form-group third">
              <label>体重(kg) <span class="required">*</span></label>
              <input 
                v-model.number="character.weight" 
                type="number"
                min="0" 
                required
                placeholder="角色体重"
              >
            </div>
          </div>
  
          <div class="form-row">
            <div class="form-group third">
              <label>身高(cm) <span class="required">*</span></label>
              <input 
                v-model.number="character.height" 
                type="number"
                min="0" 
                required
                placeholder="角色身高"
              >
            </div>
  
            <div class="form-group third">
              <label>肤色</label>
              <input 
                v-model="character.skinColor" 
                type="text"
                maxlength="16"
                placeholder="描述肤色"
              >
            </div>
  
            <div class="form-group third">
              <label>瞳色</label>
              <input 
                v-model="character.eyesColor" 
                type="text"
                maxlength="16"
                placeholder="描述瞳色"
              >
            </div>
          </div>
        </div>
  
        <div class="form-section half">
          <h2>外观特征</h2>
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
  
      <div class="form-section">
        <h2>性格与特长</h2>
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
  
      <div class="form-actions">
        <el-button @click="$emit('cancel')">
          <el-icon><Close /></el-icon>
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          <el-icon><Check /></el-icon>
          保存角色
        </el-button>
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
          age: 0,
          height: 0,
          weight: 0,
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
      async handleSubmit() {
        // 表单验证
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
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
  
  .new-oc {
    position: relative;
    padding-bottom: 60px;
  }
  
  .character-form {
    background: transparent;
    padding: 0;
    border-radius: 16px;
  }
  
  .form-section {
    margin-bottom: 24px;
  }
  
  .form-section h2 {
    color: #2d3748;
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group.half {
    flex: 1;
  }
  
  .form-group.third {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #409EFF;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .form-actions {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 16px 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: right;
  }
  
  .form-actions button {
    margin-left: 12px;
  }
  
  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  /* 响应式设计 */
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
  
  /* 添加输入框占位符样式 */
  ::placeholder {
    color: #a0aec0;
  }
  
  /* 添加平滑滚动 */
  html {
    scroll-behavior: smooth;
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
  
  /* 调整输入框样式 */
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;  /* 增加内边距 */
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    font-size: 16px;  /* 增加字体大小 */
  }
  
  /* 调整标签文字大小 */
  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
    color: #2c3e50;
    font-size: 16px;  /* 增加字体大小 */
  }
  
  /* 调整按钮样式 */
  :deep(.el-button) {
    padding: 12px 24px;  /* 增加按钮内边距 */
    font-size: 16px;    /* 增加按钮文字大小 */
    height: auto;        /* 允许按钮高度自适应 */
    line-height: 1.5;    /* 调整行高 */
    display: inline-flex;
    align-items: center;
    gap: 8px;  /* 图标和文字之间的间距 */
  }
  
  :deep(.el-button .el-icon) {
    font-size: 18px;  /* 图标大小 */
  }
  
  /* 可选：添加按钮悬停效果 */
  :deep(.el-button:hover) {
    transform: translateY(-1px);
    transition: all 0.3s ease;
  }
  
  .form-actions {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 20px 24px;  /* 增加底部操作区内边距 */
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: right;
  }
  
  .form-actions button {
    margin-left: 16px;  /* 增加按钮间距 */
  }
  
  /* 调整文本域高度 */
  textarea {
    min-height: 120px;  /* 增加文本域最小高度 */
  }
  
  /* 调整表单间距 */
  .form-group {
    margin-bottom: 24px;  /* 增加表单组间距 */
  }
  
  .form-row {
    gap: 24px;  /* 增加横向排列的表单间距 */
    margin-bottom: 24px;
  }
  
  /* 调整区块标题 */
  .form-section h2 {
    font-size: 1.6em;  /* 增加标题大小 */
    margin-bottom: 24px;
  }
  
  /* 调整下拉框高度 */
  select {
    height: 46px;  /* 确保下拉框与输入框高度一致 */
  }
  
  .form-row-sections {
    display: flex;
    gap: 32px;
    margin-bottom: 24px;
  }
  
  .form-section.half {
    flex: 1;
    min-width: 0; /* 防止flex子项溢出 */
  }
  
  /* 在小屏幕上改为垂直布局 */
  @media (max-width: 1024px) {
    .form-row-sections {
      flex-direction: column;
      gap: 24px;
    }
    
    .form-section.half {
      width: 100%;
    }
  }
  
  /* 调整section内部间距 */
  .form-section {
    background: rgba(255, 255, 255, 0.5);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  /* 调整标题样式 */
  .form-section h2 {
    font-size: 1.4em;
    margin-bottom: 20px;
    color: #2c3e50;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 8px;
  }
  
  .required {
    color: #f56c6c;
    margin-left: 4px;
  }
  </style>