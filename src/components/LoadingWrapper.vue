<template>
  <div 
    class="loading-wrapper"
    v-loading="loading" 
    :element-loading-text="loadingText || '资源加载中...'" 
    element-loading-background="rgba(255, 255, 255, 0.9)"
  >
    <slot v-if="!loading || showContentWhileLoading"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'LoadingWrapper',

  props: {
    // 是否正在加载
    loading: {
      type: Boolean,
      required: true
    },
    // 加载文本
    loadingText: {
      type: String,
      default: ''
    },
    // 加载时是否显示内容
    showContentWhileLoading: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.loading-wrapper {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* 加载动画淡入淡出效果 */
:deep(.el-loading-mask) {
  transition: opacity 0.3s ease;
}
</style> 