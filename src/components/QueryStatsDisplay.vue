<template>
  <!-- 查询统计展示 - 技术特色 -->
  <div
    v-if="showStats && hasStats"
    class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
          🔍 数据库查询透明度
        </h4>
        <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
          实时
        </span>
      </div>
      <button
        @click="toggleDisplay"
        class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        {{ showDetails ? '收起' : '展开' }}
      </button>
    </div>

    <!-- 核心指标 -->
    <div class="grid grid-cols-3 gap-4 mb-3">
      <div class="text-center">
        <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
          {{ lastStats?.totalQueries || 0 }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">SQL查询</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold" :class="getPerformanceColor(lastStats?.totalExecutionTime)">
          {{ lastStats?.totalExecutionTime || 0 }}ms
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">执行时间</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-green-600 dark:text-green-400">
          {{ getPerformanceGrade(lastStats?.averageExecutionTime) }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">性能等级</div>
      </div>
    </div>

    <!-- 详细信息 -->
    <Transition name="slide-down">
      <div v-if="showDetails && lastStats" class="pt-3 border-t border-blue-200 dark:border-gray-600">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- 查询类型 -->
          <div v-if="lastStats.queryTypeStats">
            <div class="font-medium text-gray-600 dark:text-gray-300 mb-1">查询类型</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="[type, count] in Object.entries(lastStats.queryTypeStats)"
                :key="type"
                class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border"
              >
                {{ type }}: {{ count }}
              </span>
            </div>
          </div>

          <!-- 涉及表 -->
          <div v-if="lastStats.tableAccessStats">
            <div class="font-medium text-gray-600 dark:text-gray-300 mb-1">涉及数据表</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="[table, count] in Object.entries(lastStats.tableAccessStats)"
                :key="table"
                class="px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 border font-mono text-xs"
              >
                {{ table }} ({{ count }})
              </span>
            </div>
          </div>
        </div>

        <!-- 技术说明 -->
        <div class="mt-3 p-2 bg-blue-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
          💡 <strong>技术透明度：</strong>本站展示每个页面的数据库查询情况，体现系统的开放性和技术实力。
          所有查询都经过优化，确保最佳性能。
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { globalQueryStats } from '../composables/useQueryStats.js'

// 响应式数据
const showStats = ref(true)
const showDetails = ref(false)

// 从全局状态获取最新的查询统计
const { queryStatsHistory } = globalQueryStats
const lastStats = computed(() => queryStatsHistory.value[0] || null)
const hasStats = computed(() => queryStatsHistory.value.length > 0)

// 性能等级
const getPerformanceGrade = (avgTime) => {
  if (!avgTime) return '-'
  if (avgTime < 10) return 'A+'
  if (avgTime < 25) return 'A'
  if (avgTime < 50) return 'B'
  if (avgTime < 100) return 'C'
  return 'D'
}

// 性能颜色
const getPerformanceColor = (time) => {
  if (!time) return 'text-gray-400'
  if (time < 50) return 'text-green-600 dark:text-green-400'
  if (time < 100) return 'text-yellow-600 dark:text-yellow-400'
  if (time < 200) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

// 切换显示详情
const toggleDisplay = () => {
  showDetails.value = !showDetails.value
}

// 监听新的查询统计，自动展开一次
let hasAutoExpanded = false
watch(lastStats, (newStats) => {
  if (newStats && !hasAutoExpanded) {
    showDetails.value = true
    hasAutoExpanded = true
    
    // 3秒后自动收起
    setTimeout(() => {
      showDetails.value = false
    }, 3000)
  }
})
</script>

<style scoped>
/* 滑动动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
