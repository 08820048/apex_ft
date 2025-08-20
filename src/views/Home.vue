<template>
  <div class="min-h-screen relative bg-white">
    <!-- 简洁背景 -->
    <div class="absolute inset-0 bg-gray-50"></div>

    <!-- 博客标语区域 -->
    <div
      class="relative text-center py-12 mb-8 overflow-hidden"
      style="background: #ffffff"
    >
      <!-- 网格背景层 -->
      <div
        class="absolute inset-0"
        style="
          background-image: linear-gradient(#c7d2fe 1px, transparent 1px),
            linear-gradient(90deg, #c7d2fe 1px, transparent 1px);
          background-size: 12px 12px;
        "
      ></div>
      <!-- 渐变遮罩层 - 从上到下网格透明度递增 -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.2) 60%,
            rgba(255, 255, 255, 0) 100%
          );
        "
      ></div>
      <div class="relative max-w-4xl mx-auto px-4 z-10">
        <h1
          class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
        >
          From The Blog
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          分享技术见解，记录开发历程，探索编程世界的无限可能
        </p>
        <!-- 装饰性分割线 -->
        <div class="mt-6 flex justify-center">
          <div
            class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          ></div>
        </div>
      </div>
    </div>

    <!-- 全屏主要内容区域 -->
    <div
      class="relative max-w-full mx-auto pb-8"
      style="padding-left: 90px; padding-right: 90px"
    >
      <!-- 置顶文章区域 - 两个大卡片 -->
      <section v-if="topArticles.length > 0" class="mb-12 relative">
        <!-- 区域分割线 -->
        <div
          class="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"
        ></div>
        <div
          class="absolute -top-4 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40"
        ></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article
            v-for="article in topArticles.slice(0, 2)"
            :key="'top-' + article.id"
            class="glass-effect cursor-pointer card-hover relative group h-[480px] overflow-hidden"
            :style="getArticleStyle(article)"
            @click="goToArticle(article.id)"
          >
            <!-- 置顶标识 -->
            <div class="absolute top-4 right-4 z-20">
              <div
                class="px-3 py-1 text-sm font-medium shadow-lg"
                style="background-color: #0751cf; color: #ffffff !important"
              >
                置顶
              </div>
            </div>

            <!-- 封面图片区域 (2/3 高度 = 320px) -->
            <div class="relative h-80 overflow-hidden">
              <!-- 浅蓝色斜线条背景 -->
              <div class="absolute inset-0 diagonal-stripes-bg"></div>
              <!-- 封面图片容器 - 带间隔 -->
              <div class="absolute inset-1.5">
                <img
                  v-if="article.coverImage"
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
                >
                  <DocumentTextIcon class="w-16 h-16 text-white opacity-50" />
                </div>
              </div>
              <!-- 渐变遮罩 -->
              <div
                class="absolute inset-1.5 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              ></div>
            </div>

            <!-- 内容信息区域 (1/3 高度 = 160px) -->
            <div
              class="p-6 h-40 flex flex-col justify-between paper-texture-bg"
            >
              <div>
                <h2
                  class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
                >
                  {{ article.title }}
                </h2>
                <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                  {{ article.summary }}
                </p>
              </div>

              <!-- 底部信息 - 时间、分类、标签都在一行 -->
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center text-gray-500">
                  <CalendarIcon class="w-3 h-3 mr-1" />
                  {{ formatDate(article.createdAt) }}
                </div>
                <div class="flex flex-wrap gap-1">
                  <!-- 分类标识 -->
                  <span
                    v-if="article.category"
                    class="px-2 py-1 text-white font-medium"
                    style="background-color: #0751cf"
                  >
                    {{ article.category.name }}
                  </span>
                  <!-- 标签 -->
                  <span
                    v-for="tag in article.tags?.slice(0, 3)"
                    :key="tag.id"
                    class="px-2 py-1"
                    :style="`background-color: ${
                      tag.color || '#3b82f6'
                    }20; color: ${tag.color || '#3b82f6'};`"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- 最新文章区域 - 三个较小卡片 -->
      <section v-if="latestArticles.length > 0" class="mb-16 relative">
        <!-- 区域分割线 -->
        <div
          class="absolute -top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"
        ></div>
        <div
          class="absolute -top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-40"
        ></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="article in latestArticles.slice(0, 3)"
            :key="'latest-' + article.id"
            class="glass-effect cursor-pointer card-hover relative group h-96 overflow-hidden flex flex-col"
            :style="getArticleStyle(article)"
            @click="goToArticle(article.id)"
          >
            <!-- 封面图片区域 (2/3 高度 = 213px) -->
            <div class="relative h-52 overflow-hidden">
              <!-- 浅蓝色斜线条背景 -->
              <div class="absolute inset-0 diagonal-stripes-bg"></div>
              <!-- 封面图片容器 - 带间隔 -->
              <div class="absolute inset-1.5">
                <img
                  v-if="article.coverImage"
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center"
                >
                  <DocumentTextIcon class="w-12 h-12 text-white opacity-50" />
                </div>
              </div>
              <!-- 渐变遮罩 -->
              <div
                class="absolute inset-1.5 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              ></div>
            </div>

            <!-- 内容信息区域 (剩余高度) -->
            <div
              class="p-4 flex-1 flex flex-col justify-between paper-texture-bg"
            >
              <div>
                <h3
                  class="text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors"
                >
                  {{ article.title }}
                </h3>
                <p class="text-gray-600 text-sm line-clamp-1 mb-2">
                  {{ article.summary }}
                </p>
              </div>

              <!-- 底部信息 - 时间、分类、标签都在一行 -->
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center text-gray-500">
                  <CalendarIcon class="w-3 h-3 mr-1" />
                  {{ formatDate(article.createdAt) }}
                </div>
                <div class="flex flex-wrap gap-1">
                  <!-- 分类标识 -->
                  <span
                    v-if="article.category"
                    class="px-2 py-1 text-white font-medium"
                    style="background-color: #0751cf"
                  >
                    {{ article.category.name }}
                  </span>
                  <!-- 标签 -->
                  <span
                    v-for="tag in article.tags?.slice(0, 2)"
                    :key="tag.id"
                    class="px-2 py-1"
                    :style="`background-color: ${
                      tag.color || '#3b82f6'
                    }20; color: ${tag.color || '#3b82f6'};`"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- 更多文章区域 - 动态加载 -->
      <section class="relative">
        <!-- 区域分割线 -->
        <div
          class="absolute -top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"
        ></div>
        <div
          class="absolute -top-8 left-1/5 right-1/5 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40"
        ></div>
        <!-- 文章列表 -->
        <div class="space-y-6">
          <!-- 加载状态 -->
          <Transition name="loading">
            <div v-if="loading" class="space-y-6">
              <div
                v-for="i in 3"
                :key="i"
                class="glass-effect p-6 animate-pulse"
              >
                <div class="flex gap-4">
                  <div class="w-32 h-24 bg-gray-600"></div>
                  <div class="flex-1">
                    <div class="h-6 bg-gray-600 mb-3"></div>
                    <div class="h-4 bg-gray-600 mb-2"></div>
                    <div class="h-4 bg-gray-600 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 更多文章列表 - 长条卡片 -->
          <TransitionGroup
            v-if="moreArticles.length > 0"
            name="list"
            tag="div"
            class="space-y-6"
          >
            <article
              v-for="article in moreArticles"
              :key="'more-' + article.id"
              class="glass-effect cursor-pointer card-hover h-48 overflow-hidden relative group"
              :style="getArticleStyle(article)"
              @click="goToArticle(article.id)"
            >
              <div class="flex h-full">
                <!-- 封面图片区域 (2/3 宽度) -->
                <div class="relative w-2/3 overflow-hidden">
                  <img
                    v-if="article.coverImage"
                    :src="article.coverImage"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
                  >
                    <DocumentTextIcon class="w-16 h-16 text-white opacity-50" />
                  </div>
                  <!-- 渐变遮罩 -->
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60"
                  ></div>
                </div>

                <!-- 内容信息区域 (1/3 宽度) -->
                <div
                  class="w-1/3 p-6 flex flex-col justify-between paper-texture-bg"
                >
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors"
                    >
                      {{ article.title }}
                    </h3>
                    <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                      {{ article.summary }}
                    </p>
                  </div>

                  <!-- 底部信息 - 时间、阅读量、分类、标签都在一行 -->
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center text-gray-500">
                      <CalendarIcon class="w-3 h-3 mr-1" />
                      {{ formatDate(article.publishedAt || article.createdAt) }}
                      <span class="mx-2">•</span>
                      <EyeIcon class="w-3 h-3 mr-1" />
                      {{ article.viewCount || 0 }} 阅读
                    </div>

                    <div class="flex flex-wrap gap-1">
                      <!-- 文章分类 -->
                      <span
                        v-if="article.category"
                        class="px-2 py-1 text-white font-medium"
                        style="background-color: #0751cf"
                      >
                        {{ article.category.name }}
                      </span>
                      <!-- 标签 -->
                      <span
                        v-for="tag in article.tags?.slice(0, 2)"
                        :key="tag.id"
                        class="px-2 py-1"
                        :style="`background-color: ${
                          tag.color || '#3b82f6'
                        }20; color: ${tag.color || '#3b82f6'};`"
                      >
                        {{ tag.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </TransitionGroup>

          <!-- 空状态 -->
          <div
            v-else-if="!loading && moreArticles.length === 0"
            class="glass-effect p-12 text-center"
          >
            <div class="text-gray-400 mb-4">
              <DocumentTextIcon class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              暂无更多文章
            </h3>
            <p class="text-gray-600">所有文章都已展示完毕。</p>
          </div>

          <!-- 加载更多按钮 -->
          <div v-if="hasMore && !loading" class="text-center mt-8">
            <button
              @click="loadMoreArticles"
              class="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-all duration-200 border-2 border-black"
            >
              <span v-if="!loadingMore">加载更多</span>
              <span v-else class="flex items-center justify-center">
                <div class="loading-spinner mr-2"></div>
                加载中...
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { articleApi } from "../api";

// 图标组件
const CalendarIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>`,
};

const EyeIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
  </svg>`,
};

const router = useRouter();

// 响应式数据
const topArticles = ref([]);
const latestArticles = ref([]);
const moreArticles = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;

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

// 生成文章的简洁样式（无边框）
const getArticleStyle = (article) => {
  // 使用简洁的阴影效果，不添加边框
  return {
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };
};

// 跳转到文章详情页
const goToArticle = (articleId) => {
  router.push({ name: "article", params: { id: articleId } });
};

// 加载置顶文章
const loadTopArticles = async () => {
  try {
    const data = await articleApi.getTop();
    topArticles.value = data || [];
    console.log("置顶文章数据:", topArticles.value);
  } catch (error) {
    console.error("加载置顶文章失败:", error);
    topArticles.value = [];
  }
};

// 加载最新文章
const loadLatestArticles = async () => {
  try {
    const data = await articleApi.getList({
      page: 0,
      size: 6, // 获取更多文章，然后过滤掉置顶的
    });

    const allArticles = data.content || [];
    const topIds = topArticles.value.map((a) => a.id);

    // 过滤掉置顶文章，取前3篇作为最新文章
    latestArticles.value = allArticles
      .filter((article) => !topIds.includes(article.id))
      .slice(0, 3);

    console.log("最新文章数据:", latestArticles.value);
  } catch (error) {
    console.error("加载最新文章失败:", error);
    latestArticles.value = [];
  }
};

// 加载更多文章
const loadMoreArticles = async (isInitial = false) => {
  try {
    if (isInitial) {
      loading.value = true;
      currentPage.value = 1;
    } else {
      loadingMore.value = true;
    }

    const data = await articleApi.getList({
      page: currentPage.value - 1,
      size: pageSize,
    });

    const newArticles = data.content || [];

    if (isInitial) {
      // 过滤掉置顶文章和最新文章中已经显示的文章
      const topIds = topArticles.value.map((a) => a.id);
      const latestIds = latestArticles.value.map((a) => a.id);
      const excludeIds = [...topIds, ...latestIds];

      moreArticles.value = newArticles.filter(
        (article) => !excludeIds.includes(article.id)
      );
    } else {
      moreArticles.value = [...moreArticles.value, ...newArticles];
    }

    hasMore.value = currentPage.value < (data.totalPages || 0);
    currentPage.value++;
  } catch (error) {
    console.error("加载更多文章失败:", error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 初始化所有数据
const initializeData = async () => {
  try {
    loading.value = true;

    // 先加载置顶文章
    await loadTopArticles();

    // 然后加载最新文章（需要过滤掉置顶文章）
    await loadLatestArticles();

    // 最后加载更多文章（初始加载）
    await loadMoreArticles(true);
  } catch (error) {
    console.error("初始化数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  initializeData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 文章卡片中的markdown内容样式 */
.markdown-content {
  font-size: 0.875rem;
  line-height: 1.5;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: inherit;
}

.markdown-content :deep(p) {
  margin: 0.25rem 0;
  color: inherit;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.25rem 0;
  padding-left: 1rem;
}

.markdown-content :deep(li) {
  margin: 0.125rem 0;
}

.markdown-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.markdown-content :deep(blockquote) {
  border-left: 2px solid #e5e7eb;
  padding-left: 0.5rem;
  margin: 0.25rem 0;
  font-style: italic;
  color: #6b7280;
}

/* 亮色模式样式 */
html.light .sidebar-title {
  color: #111827 !important;
}

html.light .text-2xl {
  color: #111827 !important;
}

html.light .text-xs {
  color: #6b7280 !important;
}

html.light .text-sm {
  color: #374151 !important;
}

/* 亮色模式下的统计卡片 */
html.light .bg-gradient-to-br.from-blue-900\/30 {
  background: linear-gradient(
    to bottom right,
    rgba(59, 130, 246, 0.1),
    rgba(147, 197, 253, 0.05)
  ) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}

html.light .bg-gradient-to-br.from-green-900\/30 {
  background: linear-gradient(
    to bottom right,
    rgba(34, 197, 94, 0.1),
    rgba(134, 239, 172, 0.05)
  ) !important;
  border-color: rgba(34, 197, 94, 0.3) !important;
}

html.light .bg-gradient-to-br.from-purple-900\/30 {
  background: linear-gradient(
    to bottom right,
    rgba(168, 85, 247, 0.1),
    rgba(196, 181, 253, 0.05)
  ) !important;
  border-color: rgba(168, 85, 247, 0.3) !important;
}

html.light .bg-gradient-to-br.from-red-900\/30 {
  background: linear-gradient(
    to bottom right,
    rgba(239, 68, 68, 0.1),
    rgba(252, 165, 165, 0.05)
  ) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
}

/* 亮色模式下的文章卡片 */
html.light .glass-effect h2 {
  color: #111827 !important;
}

html.light .glass-effect .text-gray-300 {
  color: #6b7280 !important;
}

html.light .glass-effect .text-gray-400 {
  color: #9ca3af !important;
}

/* 亮色模式下的分页按钮 */
html.light .glass-effect button {
  color: #374151 !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

html.light .glass-effect button:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

html.light .glass-effect input {
  color: #111827 !important;
  background: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

/* 亮色模式下的分类标签优化 */
html.light .bg-gradient-to-r.from-purple-900\/40 {
  background: linear-gradient(
    to right,
    rgba(147, 51, 234, 0.15),
    rgba(126, 34, 206, 0.1)
  ) !important;
  border-color: rgba(147, 51, 234, 0.4) !important;
}

html.light .text-purple-300 {
  color: #7c3aed !important; /* 保持紫色但在亮色模式下更深 */
}

/* 保持标签悬停效果，不覆盖颜色 */
html.light .sidebar-tag:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 确保标签文字颜色不被全局样式覆盖 */
html.light .article-tag,
html.light .sidebar-tag {
  /* 完全依赖JavaScript设置的内联样式 */
}

/* 亮色模式下的置顶文本颜色 */
html.light .top-badge {
  color: #ffffff !important;
  background-color: #0751cf !important;
}
</style>
