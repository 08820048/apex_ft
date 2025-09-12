<template>
  <div class="website-preview-container">
    <!-- 截图预览 -->
    <img
      v-if="previewData.type === 'screenshot'"
      :src="previewData.src"
      :alt="previewData.alt"
      class="website-preview-image screenshot"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- Favicon预览 -->
    <div
      v-else-if="previewData.type === 'favicon'"
      class="website-preview-favicon"
    >
      <img
        :src="previewData.src"
        :alt="previewData.alt"
        class="favicon-image"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>
    
    <!-- 默认图标 -->
    <div
      v-else-if="previewData.type === 'default'"
      class="website-preview-default"
    >
      <img
        :src="previewData.src"
        :alt="previewData.alt"
        class="default-image"
      />
    </div>
    
    <!-- 文字备用 -->
    <div
      v-else
      class="website-preview-text"
      :class="{ 'loading': isLoading }"
    >
      <span v-if="!isLoading" class="preview-text">{{ previewData.alt }}</span>
      <div v-else class="loading-spinner"></div>
    </div>
    
    <!-- 加载状态覆盖层 -->
    <div v-if="isLoading && previewData.type !== 'text'" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCachedWebsitePreview } from '../utils/websitePreview.js'

// Props
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  fallbackText: {
    type: String,
    default: ''
  },
  useScreenshot: {
    type: Boolean,
    default: true
  },
  timeout: {
    type: Number,
    default: 5000
  }
})

// 响应式数据
const isLoading = ref(true)
const previewData = ref({
  type: 'text',
  src: '',
  alt: props.fallbackText || props.url.charAt(0).toUpperCase(),
  url: props.url
})

/**
 * 获取网站预览图
 */
const fetchPreview = async () => {
  if (!props.url) {
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    
    const result = await getCachedWebsitePreview(props.url, {
      fallbackText: props.fallbackText || props.url.charAt(0).toUpperCase(),
      timeout: props.timeout,
      useScreenshot: props.useScreenshot
    })
    
    previewData.value = result
  } catch (error) {
    console.warn('获取网站预览失败:', error)
    // 保持默认的文字显示
  } finally {
    isLoading.value = false
  }
}

/**
 * 处理图片加载错误
 */
const handleImageError = () => {
  // 如果当前是截图，尝试降级到favicon
  if (previewData.value.type === 'screenshot') {
    fetchFallbackPreview('favicon')
  } 
  // 如果是favicon，降级到默认图标
  else if (previewData.value.type === 'favicon') {
    fetchFallbackPreview('default')
  }
  // 如果是默认图标，降级到文字
  else {
    previewData.value.type = 'text'
    previewData.value.src = ''
  }
}

/**
 * 处理图片加载成功
 */
const handleImageLoad = () => {
  isLoading.value = false
}

/**
 * 获取备用预览
 * @param {string} targetType - 目标类型
 */
const fetchFallbackPreview = async (targetType) => {
  try {
    const result = await getCachedWebsitePreview(props.url, {
      fallbackText: props.fallbackText || props.url.charAt(0).toUpperCase(),
      timeout: props.timeout,
      useScreenshot: targetType === 'screenshot'
    })
    
    // 只使用指定类型的结果
    if (result.type === targetType) {
      previewData.value = result
    } else if (targetType === 'default') {
      previewData.value.type = 'default'
      previewData.value.src = result.src
    } else {
      previewData.value.type = 'text'
      previewData.value.src = ''
    }
  } catch (error) {
    previewData.value.type = 'text'
    previewData.value.src = ''
  }
}

// 监听URL变化
watch(() => props.url, () => {
  fetchPreview()
}, { immediate: false })

// 监听fallbackText变化
watch(() => props.fallbackText, (newText) => {
  previewData.value.alt = newText || props.url.charAt(0).toUpperCase()
})

// 组件挂载时获取预览
onMounted(() => {
  fetchPreview()
})
</script>

<style scoped>
.website-preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 截图样式 */
.website-preview-image.screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.website-preview-image.screenshot:hover {
  transform: scale(1.05);
}

/* Favicon样式 */
.website-preview-favicon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.favicon-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* 默认图标样式 */
.website-preview-default {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.default-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  opacity: 0.8;
}

/* 文字备用样式 */
.website-preview-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  transition: all 0.3s ease;
}

.website-preview-text.loading {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
}

.preview-text {
  font-size: 3rem;
  font-weight: bold;
  color: #4a5568;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .website-preview-container {
    height: 160px;
  }
  
  .preview-text {
    font-size: 2.5rem;
  }
  
  .favicon-image {
    width: 40px;
    height: 40px;
  }
  
  .default-image {
    width: 56px;
    height: 56px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .website-preview-container {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }
  
  .website-preview-text.loading {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  }
  
  .preview-text {
    color: #e2e8f0;
  }
  
  .loading-overlay {
    background: rgba(26, 32, 44, 0.8);
  }
}
</style>