<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">文章分类</h1>
        <p class="text-xl text-gray-200">按分类浏览所有文章</p>
      </div>

      <!-- 分类网格 -->
      <Transition name="loading">
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="glass-effect rounded-2xl p-6 animate-pulse"
          >
            <div class="h-6 bg-gray-600 rounded mb-3"></div>
            <div class="h-4 bg-gray-600 rounded mb-2"></div>
            <div class="h-4 bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </Transition>

      <TransitionGroup
        v-if="!loading && categories.length > 0"
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="glass-effect rounded-2xl p-6 card-hover cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-xl font-bold text-white group-hover:transition-colors"
              :class="`group-hover:${getCategoryColor(category.id).hover}`"
            >
              {{ category.name }}
            </h3>
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="getCategoryColor(category.id).bg"
            >
              <FolderIcon class="w-6 h-6 text-white folder-icon" />
            </div>
          </div>

          <p
            v-if="category.description"
            class="text-gray-200 mb-4 line-clamp-2"
          >
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">
              {{ formatDate(category.createdAt) }}
            </span>
            <div
              class="flex items-center text-blue-400 group-hover:translate-x-1 transition-transform"
            >
              <span class="text-sm mr-1">查看更多</span>
              <ArrowRightIcon class="w-4 h-4" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- 空状态 -->
      <Transition name="fade">
        <div
          v-if="!loading && categories.length === 0"
          class="glass-effect rounded-2xl p-12 text-center"
        >
          <div class="text-gray-400 mb-4">
            <FolderIcon class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无分类</h3>
          <p class="text-gray-600">还没有创建任何分类，请稍后再来查看。</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { categoryApi } from "../api";

// 图标组件
const FolderIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>',
};
const ArrowRightIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>',
};

const router = useRouter();

// 响应式数据
const categories = ref([]);
const loading = ref(false);

// 分类颜色配置 - 使用更柔和的颜色
const categoryColors = [
  { bg: "bg-blue-500", hover: "text-blue-500" },
  { bg: "bg-green-500", hover: "text-green-500" },
  { bg: "bg-purple-500", hover: "text-purple-500" },
  { bg: "bg-red-500", hover: "text-red-500" },
  { bg: "bg-yellow-500", hover: "text-yellow-500" },
  { bg: "bg-indigo-500", hover: "text-indigo-500" },
  { bg: "bg-pink-500", hover: "text-pink-500" },
  { bg: "bg-teal-500", hover: "text-teal-500" },
  { bg: "bg-orange-500", hover: "text-orange-500" },
  { bg: "bg-cyan-500", hover: "text-cyan-500" },
];

// 根据分类ID获取颜色
const getCategoryColor = (categoryId) => {
  const index = categoryId % categoryColors.length;
  return categoryColors[index];
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 跳转到分类页面
const goToCategory = (categoryId) => {
  router.push({ name: "search", query: { category: categoryId } });
};

// 加载分类列表
const loadCategories = async () => {
  try {
    loading.value = true;
    const data = await categoryApi.getList();
    categories.value = data || [];
  } catch (error) {
    console.error("加载分类失败:", error);
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(loadCategories);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 亮色模式优化 */
/* 亮色模式下的文字颜色，但不影响文件夹图标 */
html.light .text-white:not(.folder-icon) {
  color: #111827 !important;
}

html.light .text-gray-200 {
  color: #4b5563 !important;
}

html.light .text-gray-400 {
  color: #6b7280 !important;
}

html.light .text-gray-600 {
  color: #4b5563 !important;
}

html.light .text-gray-900 {
  color: #111827 !important;
}

html.light .text-blue-400 {
  color: #2563eb !important;
}

/* 亮色模式下的图标颜色 */
html.light .glass-effect .text-white {
  color: #111827 !important;
}

/* 亮色模式下的加载状态 */
html.light .bg-gray-600 {
  background-color: #d1d5db !important;
}

/* 文件夹图标颜色强制设置 */
.folder-icon {
  color: white !important;
}

/* 亮色模式下的文件夹图标优化 */
html.light .folder-icon {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* 确保文件夹图标不被其他规则覆盖 */
html.light .glass-effect .folder-icon {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* 最高优先级的文件夹图标颜色设置 */
html.light .glass-effect .w-12.h-12 .folder-icon,
html.light .bg-blue-500 .folder-icon,
html.light .bg-green-500 .folder-icon,
html.light .bg-purple-500 .folder-icon,
html.light .bg-red-500 .folder-icon,
html.light .bg-yellow-500 .folder-icon,
html.light .bg-indigo-500 .folder-icon,
html.light .bg-pink-500 .folder-icon,
html.light .bg-teal-500 .folder-icon,
html.light .bg-orange-500 .folder-icon,
html.light .bg-cyan-500 .folder-icon {
  color: rgba(255, 255, 255, 0.95) !important;
}

/* 亮色模式下的空状态文件夹图标 */
html.light .text-gray-400 {
  color: #9ca3af !important;
}
</style>
