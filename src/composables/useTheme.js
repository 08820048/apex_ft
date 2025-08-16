import { ref, watch } from 'vue'

// 主题状态
const isDark = ref(true) // 默认暗色模式

// 从localStorage读取主题设置
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 如果没有保存的主题，检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
  }
  applyTheme()
}

// 应用主题
const applyTheme = () => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    html.classList.remove('light')
  } else {
    html.classList.add('light')
    html.classList.remove('dark')
  }
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// 监听主题变化
watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  applyTheme()
})

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', (e) => {
  // 只有在用户没有手动设置主题时才跟随系统
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches
  }
})

export function useTheme() {
  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
