<template>
  <div class="embedded-browser-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加载网站预览...</p>
      </div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <p class="error-title">无法加载网站预览</p>
        <p class="error-description">{{ errorMessage }}</p>
        <button @click="retryLoad" class="retry-button">
          重试加载
        </button>
      </div>
    </div>
    
    <!-- 浏览器工具栏 -->
    <div v-if="showToolbar && !isLoading && !hasError" class="browser-toolbar">
      <div class="browser-controls">
        <div class="traffic-lights">
          <div class="traffic-light red"></div>
          <div class="traffic-light yellow"></div>
          <div class="traffic-light green"></div>
        </div>
      </div>
      
      <div class="address-bar">
        <div class="address-input">
          <span class="protocol">🔒</span>
          <span class="url-text">{{ displayUrl }}</span>
        </div>
      </div>
      
      <div class="browser-actions">
        <button @click="refreshIframe" class="action-button" title="刷新">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
        
        <button @click="openInNewTab" class="action-button" title="在新标签页打开">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- iframe内容 -->
    <div class="iframe-container" :class="{ 'with-toolbar': showToolbar }">
      <iframe
        ref="iframeRef"
        :src="iframeSrc"
        :title="`${fallbackText} - 网站预览`"
        class="embedded-iframe"
        :class="{ 'loading': isLoading, 'error': hasError }"
        @load="handleIframeLoad"
        @error="handleIframeError"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
      ></iframe>
    </div>
    
    <!-- 备用内容 -->
    <div v-if="showFallback" class="fallback-content">
      <div class="fallback-icon">
        {{ fallbackText }}
      </div>
      <p class="fallback-url">{{ displayUrl }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  fallbackText: {
    type: String,
    default: 'W'
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  timeout: {
    type: Number,
    default: 10000
  },
  scale: {
    type: Number,
    default: 0.75
  },
  enableInteraction: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['load', 'error', 'timeout'])

// 响应式数据
const isLoading = ref(true)
const hasError = ref(false)
const showFallback = ref(false)
const errorMessage = ref('')
const iframeRef = ref(null)
const loadTimeout = ref(null)

// 计算属性
const normalizedUrl = computed(() => {
  if (!props.url) return ''
  
  let url = props.url.trim()
  if (!url.match(/^https?:\/\//)) {
    url = 'https://' + url
  }
  return url
})

const displayUrl = computed(() => {
  try {
    const urlObj = new URL(normalizedUrl.value)
    return urlObj.hostname
  } catch {
    return props.url
  }
})

const iframeSrc = computed(() => {
  if (!normalizedUrl.value) return ''
  
  // 对于一些已知的问题网站，可以使用代理服务
  const problematicDomains = [
    'x.com', 'twitter.com', 'facebook.com', 'instagram.com',
    'waer.ltd'
  ]
  const hostname = displayUrl.value.toLowerCase()
  
  if (problematicDomains.some(domain => hostname.includes(domain))) {
    // 这些网站通常不允许iframe嵌入，直接显示备用内容
    showFallback.value = true
    return ''
  }
  
  return normalizedUrl.value
})

/**
 * 处理iframe加载完成
 */
const handleIframeLoad = () => {
  clearTimeout(loadTimeout.value)
  
  // 成功加载
  isLoading.value = false
  hasError.value = false
  showFallback.value = false
  
  emit('load', {
    url: normalizedUrl.value,
    iframe: iframeRef.value
  })
  
  // 应用缩放
  if (props.scale !== 1 && iframeRef.value) {
    nextTick(() => {
      try {
        const iframe = iframeRef.value
        iframe.style.transform = `scale(${props.scale})`
        iframe.style.transformOrigin = 'top left'
        iframe.style.width = `${100 / props.scale}%`
        iframe.style.height = `${100 / props.scale}%`
      } catch (error) {
        console.warn('应用iframe缩放失败:', error)
      }
    })
  }
}

/**
 * 处理iframe加载错误
 */
const handleIframeError = (event) => {
  clearTimeout(loadTimeout.value)
  isLoading.value = false
  hasError.value = true
  
  // 检测具体的错误类型
  const hostname = displayUrl.value
  if (hostname.includes('waer.ltd')) {
    errorMessage.value = `${hostname} 网站设置了安全策略，不允许在iframe中显示`
  } else {
    errorMessage.value = '网站拒绝在iframe中显示或网络连接失败'
  }
  
  emit('error', {
    url: normalizedUrl.value,
    error: event,
    message: errorMessage.value
  })
}

/**
 * 处理加载超时
 */
const handleTimeout = () => {
  if (isLoading.value) {
    isLoading.value = false
    hasError.value = true
    errorMessage.value = '加载超时，请检查网络连接或稍后重试'
    
    emit('timeout', {
      url: normalizedUrl.value
    })
  }
}

/**
 * 重试加载
 */
const retryLoad = () => {
  hasError.value = false
  showFallback.value = false
  isLoading.value = true
  errorMessage.value = ''
  
  // 重新设置iframe src来触发重新加载
  if (iframeRef.value) {
    const currentSrc = iframeRef.value.src
    iframeRef.value.src = ''
    nextTick(() => {
      iframeRef.value.src = currentSrc
      startLoadTimeout()
    })
  }
}

/**
 * 刷新iframe
 */
const refreshIframe = () => {
  if (iframeRef.value) {
    iframeRef.value.src = iframeRef.value.src
  }
}

/**
 * 在新标签页打开
 */
const openInNewTab = () => {
  if (normalizedUrl.value) {
    window.open(normalizedUrl.value, '_blank', 'noopener,noreferrer')
  }
}

/**
 * 开始加载超时计时
 */
const startLoadTimeout = () => {
  clearTimeout(loadTimeout.value)
  loadTimeout.value = setTimeout(handleTimeout, props.timeout)
}

/**
 * 初始化加载
 */
const initLoad = () => {
  if (!normalizedUrl.value) {
    showFallback.value = true
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  hasError.value = false
  showFallback.value = false
  startLoadTimeout()
}

// 监听URL变化
watch(() => props.url, () => {
  initLoad()
}, { immediate: false })

// 组件挂载时初始化
onMounted(() => {
  initLoad()
})

// 组件卸载时清理
const cleanup = () => {
  clearTimeout(loadTimeout.value)
}

// 暴露方法给父组件
defineExpose({
  refresh: refreshIframe,
  retry: retryLoad,
  openInNewTab,
  iframe: iframeRef
})
</script>

<style scoped>
.embedded-browser-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

/* 浏览器工具栏 */
.browser-toolbar {
  display: flex;
  align-items: center;
  height: 40px;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
  padding: 0 12px;
  gap: 12px;
}

.browser-controls {
  display: flex;
  align-items: center;
}

.traffic-lights {
  display: flex;
  gap: 6px;
}

.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.traffic-light.red {
  background: #ff5f57;
}

.traffic-light.yellow {
  background: #ffbd2e;
}

.traffic-light.green {
  background: #28ca42;
}

.address-bar {
  flex: 1;
  margin: 0 8px;
}

.address-input {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #6b7280;
}

.protocol {
  margin-right: 4px;
  font-size: 10px;
}

.url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-actions {
  display: flex;
  gap: 4px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

.action-button svg {
  width: 14px;
  height: 14px;
}

/* iframe容器 */
.iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.iframe-container.with-toolbar {
  height: calc(100% - 40px);
}

.embedded-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
  transition: opacity 0.3s ease;
}

.embedded-iframe.loading {
  opacity: 0;
}

.embedded-iframe.error {
  display: none;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

.loading-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* 错误状态 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.error-content {
  text-align: center;
  max-width: 280px;
  padding: 20px;
}

.error-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #ef4444;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.error-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px;
  line-height: 1.4;
}

.retry-button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-button:hover {
  background: #2563eb;
}

/* 备用内容 */
.fallback-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.fallback-icon {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fallback-url {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  word-break: break-all;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .browser-toolbar {
    height: 36px;
    padding: 0 8px;
  }
  
  .iframe-container.with-toolbar {
    height: calc(100% - 36px);
  }
  
  .address-input {
    font-size: 11px;
  }
  
  .fallback-icon {
    font-size: 2.5rem;
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .embedded-browser-container {
    background: #1f2937;
    border-color: #374151;
  }
  
  .browser-toolbar {
    background: linear-gradient(to bottom, #374151, #1f2937);
    border-bottom-color: #4b5563;
  }
  
  .address-input {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .action-button {
    color: #9ca3af;
  }
  
  .action-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }
  
  .loading-overlay,
  .error-overlay {
    background: #1f2937;
  }
  
  .loading-text {
    color: #9ca3af;
  }
  
  .error-title {
    color: #f3f4f6;
  }
  
  .error-description {
    color: #9ca3af;
  }
}
</style>