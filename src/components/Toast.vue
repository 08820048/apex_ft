<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-[9999] max-w-sm"
      >
        <div
          class="glass-effect rounded-lg p-4 shadow-lg border-2 border-black flex items-center space-x-3"
          :class="{
            'border-green-500': type === 'success',
            'border-red-500': type === 'error',
            'border-blue-500': type === 'info',
            'border-yellow-500': type === 'warning'
          }"
        >
          <!-- 图标 -->
          <div class="flex-shrink-0">
            <CheckCircleIcon
              v-if="type === 'success'"
              class="w-5 h-5 text-green-500"
            />
            <XCircleIcon
              v-else-if="type === 'error'"
              class="w-5 h-5 text-red-500"
            />
            <InformationCircleIcon
              v-else-if="type === 'info'"
              class="w-5 h-5 text-blue-500"
            />
            <ExclamationTriangleIcon
              v-else-if="type === 'warning'"
              class="w-5 h-5 text-yellow-500"
            />
          </div>
          
          <!-- 消息内容 -->
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ message }}</p>
            <p v-if="description" class="text-xs text-gray-600 mt-1">{{ description }}</p>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            @click="close"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 图标组件
const CheckCircleIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
  </svg>`
}

const XCircleIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
  </svg>`
}

const InformationCircleIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
  </svg>`
}

const ExclamationTriangleIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
  </svg>`
}

const XMarkIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
  </svg>`
}

// Props
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close'])

// 状态
const visible = ref(true)

/**
 * 关闭提示
 */
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // 等待动画完成
}

// 自动关闭
onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>