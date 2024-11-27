<template>
  <el-dialog
    v-model="dialogVisible"
    width="65%"
    :show-close="false"
    :close-on-click-modal="true"
    class="image-preview-dialog"
    destroy-on-close
  >
    <div class="preview-wrapper">
      <!-- 左侧图片区域 -->
      <div class="preview-container">
        <img :src="imageUrl" :alt="imageAlt">
        <el-button
          v-if="showRedrawButton"
          class="redraw-button"
          type="primary"
          circle
          @click="handleRedraw"
        >
          <el-icon><Brush /></el-icon>
        </el-button>
      </div>

      <!-- 右侧信息区域 -->
      <div class="info-container">
        <div class="info-header">
          <h2 class="oc-name">名称</h2>
          <h3 class="clothes-name">{{ clothesName }}</h3>
        </div>
        
        <div class="info-content">
          <div class="description-section">
            <h4>服装介绍</h4>
            <p class="description-text">{{ description }}</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Brush } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ImagePreview',

  components: {
    Brush
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    },
    imageUrl: {
      type: String as PropType<string>,
      required: true,
      validator: (value: string) => value.length > 0
    },
    imageAlt: {
      type: String,
      default: ''
    },
    showRedrawButton: {
      type: Boolean,
      default: true
    },
    // 新增属性
    ocName: {
      type: String,
      required: true
    },
    clothesName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '暂无介绍'
    }
  },

  emits: ['update:visible', 'redraw'],

  computed: {
    dialogVisible: {
      get(): boolean {
        return this.visible
      },
      set(value: boolean) {
        this.$emit('update:visible', value)
      }
    }
  },

  methods: {
    handleRedraw() {
      this.$emit('redraw')
    }
  }
})
</script>

<style scoped>
.image-preview-dialog :deep(.el-dialog) {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  overflow: hidden;
  max-width: 1400px;
}

.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.image-preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.preview-wrapper {
  display: grid;
  grid-template-columns: 65% 35%;
  min-height: 70vh;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.info-container {
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}

.info-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
}

.oc-name {
  font-size: 2em;
  margin: 0 0 10px 0;
  color: var(--primary-color, #8B5CF6);
  font-weight: 600;
}

.clothes-name {
  font-size: 1.5em;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.info-content {
  flex: 1;
}

.description-section h4 {
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.description-text {
  font-size: 1.1em;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  white-space: pre-line;
}

.redraw-button {
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 56px;
  height: 56px;
  background: var(--primary-color, #8B5CF6);
  border: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.redraw-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  background: var(--primary-dark, #7C3AED);
}

.redraw-button :deep(.el-icon) {
  font-size: 24px;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .preview-wrapper {
    grid-template-columns: 60% 40%;
  }
  
  .info-container {
    padding: 30px;
  }
  
  .oc-name {
    font-size: 1.8em;
  }
  
  .clothes-name {
    font-size: 1.3em;
  }
}

@media screen and (max-width: 768px) {
  .preview-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  .preview-container {
    height: 50vh;
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .info-container {
    padding: 20px;
    min-height: 30vh;
  }

  .redraw-button {
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;
  }

  .redraw-button :deep(.el-icon) {
    font-size: 20px;
  }
  
  .oc-name {
    font-size: 1.5em;
  }
  
  .clothes-name {
    font-size: 1.2em;
  }
  
  .description-text {
    font-size: 1em;
  }
}
</style> 