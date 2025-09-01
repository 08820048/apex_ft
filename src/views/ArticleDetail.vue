<template>
  <div class="min-h-screen">
    <!-- 禅模式提示弹窗 -->
    <Transition name="modal">
      <div
        v-if="showZenTip"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeZenTip"
      >
        <div
          class="glass-effect p-8 max-w-md mx-4 text-center shadow-2xl border border-white/10"
          @click.stop
        >
          <div class="relative mb-6">
            <div class="text-6xl mb-2 animate-bounce">🧘‍♂️</div>
            <div
              class="absolute inset-0 bg-purple-100 dark:bg-purple-900 rounded-full opacity-20 blur-xl"
            ></div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">进入禅模式</h3>
          <p class="text-gray-600 mb-4">
            请输入"阿弥陀佛"，让心灵沉静下来，专注于文字的力量
          </p>

          <!-- 输入框 -->
          <div class="mb-4">
            <input
              v-model="zenInput"
              @keyup.enter="checkZenInput"
              type="text"
              placeholder="请输入：阿弥陀佛"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="
                inputStatus === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : inputStatus === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : ''
              "
            />
          </div>

          <!-- 输入状态提示 -->
          <div
            v-if="inputMessage"
            class="mb-4 p-3 rounded-lg text-sm"
            :class="
              inputStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            "
          >
            <div class="flex items-center">
              <span class="mr-2">{{
                inputStatus === "success" ? "✅" : "❌"
              }}</span>
              <span>{{ inputMessage }}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeZenTip"
              class="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              取消
            </button>
            <button
              @click="checkZenInput"
              :disabled="!zenInput.trim()"
              class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span class="flex items-center justify-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                确认进入
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 主内容区域 -->
    <div
      ref="mainContainer"
      :class="[
        'min-h-screen transition-all duration-500',
        zenMode ? 'zen-mode' : 'py-8 px-4 sm:px-6 lg:px-8',
      ]"
    >
      <div
        :class="[
          'mx-auto transition-all duration-500',
          zenMode ? 'max-w-none' : 'max-w-4xl',
        ]"
      >
        <!-- 加载状态 -->
        <div v-if="loading" class="glass-effect rounded-2xl p-8 animate-pulse">
          <div class="h-8 bg-gray-600 rounded mb-4"></div>
          <div class="h-4 bg-gray-600 rounded mb-2"></div>
          <div class="h-4 bg-gray-600 rounded w-3/4 mb-8"></div>
          <div class="h-64 bg-gray-600 rounded"></div>
        </div>

        <!-- 禅模式退出按钮 -->
        <div v-if="zenMode" class="fixed top-6 right-6 z-40">
          <button
            @click="exitZenMode"
            class="group p-3 bg-black text-white hover:bg-gray-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white"
            title="退出禅模式"
          >
            <svg
              class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 禅模式进入按钮 -->
        <div
          v-if="!zenMode && !loading && article"
          class="fixed bottom-6 right-6 z-40"
        >
          <button
            @click="showZenTip = true"
            class="group relative w-14 h-14 bg-black text-white shadow-lg hover:shadow-xl border-2 border-white hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center rounded-full"
            title="进入禅模式"
          >
            <span
              class="text-lg font-bold group-hover:scale-110 transition-transform duration-300"
              style="font-family: 'STKaiti', 'KaiTi', '楷体', serif"
            >
              禅
            </span>
            <!-- 悬浮提示 -->
            <div
              class="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
            >
              进入禅模式
              <div
                class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"
              ></div>
            </div>
          </button>
        </div>

        <!-- 文章内容 -->
        <article
          v-if="!loading && article"
          :class="[
            'overflow-hidden transition-all duration-500',
            zenMode
              ? 'zen-article fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50'
              : 'article-content-card rounded-2xl relative',
            // 当有目录时，将文章容器向左移动，为右侧目录组件腾出空间
            !zenMode && tableOfContents.length > 0 ? 'xl:-translate-x-48' : '',
          ]"
        >
          <!-- 文章头部 -->
          <header
            :class="[
              'border-b border-gray-200 transition-all duration-500',
              zenMode ? 'p-12 text-center' : 'p-8',
            ]"
          >
            <h1
              :class="[
                'font-bold text-gray-900 mb-4 transition-all duration-500',
                zenMode
                  ? 'text-4xl md:text-6xl leading-tight'
                  : 'text-3xl md:text-4xl',
              ]"
            >
              {{ article.title }}
            </h1>

            <!-- 文章元信息 -->
            <div
              v-if="!zenMode"
              class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6"
            >
              <div class="flex items-center">
                <UserIcon class="w-4 h-4 mr-1" />
                {{ article.author?.nickname || article.author?.username }}
              </div>
              <div class="flex items-center">
                <CalendarIcon class="w-4 h-4 mr-1" />
                {{ formatDate(article.publishedAt) }}
              </div>
              <div class="flex items-center">
                <EyeIcon class="w-4 h-4 mr-1" />
                {{ article.viewCount }} 次阅读
              </div>
            </div>

            <!-- 标签 -->
            <div
              v-if="!zenMode && article.tags?.length"
              class="flex flex-wrap gap-2 mb-6"
            >
              <span
                v-for="tag in article.tags"
                :key="tag.id"
                class="px-3 py-1 text-sm"
                :style="`background-color: ${tag.color}20; color: ${tag.color} !important;`"
              >
                # {{ tag.name }}
              </span>
            </div>

            <!-- 封面图片 -->
            <div v-if="!zenMode && article.coverImage" class="mb-6">
              <img
                :src="article.coverImage"
                :alt="article.title"
                class="w-full h-64 md:h-80 object-cover rounded-xl"
              />
            </div>
          </header>

          <!-- 文章正文 -->
          <div
            :class="[
              'transition-all duration-500',
              zenMode ? 'zen-content p-12 overflow-y-auto h-full' : 'p-8',
            ]"
          >
            <div
              :class="[
                'prose prose-slate dark:prose-invert max-w-none transition-all duration-500',
                zenMode ? 'zen-prose prose-xl md:prose-2xl' : 'prose-lg',
              ]"
              v-html="renderedContent"
            ></div>
          </div>

          <!-- 文章底部 -->
          <footer
            v-if="!zenMode"
            class="p-8 border-t border-white/10 bg-white/5"
          >
            <div class="text-sm text-gray-400 text-center">
              最后更新于 {{ formatDate(article.updatedAt) }}
            </div>
          </footer>
        </article>

        <!-- 文章目录导航 - 贴着内容容器右侧 -->
        <aside
          v-if="!zenMode && article && tableOfContents.length > 0"
          class="fixed top-1/2 transform -translate-y-1/2 w-80 z-30 hidden xl:block"
          :style="{
            right: tableOfContents.length > 0 ? '116px' : '132px',
          }"
        >
          <div
            class="glass-effect rounded-2xl p-6 max-h-[80vh] overflow-hidden"
          >
            <h3
              class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"
                />
              </svg>
              文章目录
            </h3>

            <!-- 目录列表 -->
            <nav class="space-y-1 max-h-96 overflow-y-auto mb-6">
              <a
                v-for="(item, index) in tableOfContents"
                :key="index"
                :href="`#${item.id}`"
                @click.prevent="scrollToHeading(item.id)"
                :class="[
                  'block text-sm py-2 px-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 border-l-2 border-transparent hover:border-blue-300',
                  item.level === 1
                    ? 'font-medium text-gray-900'
                    : 'text-gray-600',
                  item.level === 2 ? 'ml-4' : '',
                  item.level === 3 ? 'ml-8' : '',
                  item.level >= 4 ? 'ml-12' : '',
                  activeHeading === item.id
                    ? 'bg-blue-100 text-blue-700 font-medium border-blue-500'
                    : '',
                ]"
              >
                {{ item.text }}
              </a>
            </nav>

            <!-- 阅读进度 -->
            <div class="pt-4 border-t border-gray-200">
              <div
                class="flex items-center justify-between text-sm text-gray-600 mb-3"
              >
                <span class="font-medium">阅读进度</span>
                <span class="text-blue-600 font-semibold"
                  >{{ Math.round(readingProgress) }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full transition-all duration-300 shadow-sm"
                  :style="{ width: readingProgress + '%' }"
                ></div>
              </div>
              <div class="mt-2 text-xs text-gray-500 text-center">
                继续阅读，探索更多精彩内容
              </div>
            </div>
          </div>
        </aside>

        <!-- 文章不存在 -->
        <div
          v-if="!loading && !article"
          class="glass-effect rounded-2xl p-12 text-center"
        >
          <div class="text-gray-400 mb-4">
            <svg
              class="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">文章不存在</h3>
          <p class="text-gray-600 mb-6">抱歉，您访问的文章不存在或已被删除</p>
          <RouterLink
            to="/"
            class="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
          >
            返回首页
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import { articleApi } from "../api";
import { renderMarkdown } from "../utils/markdown";
import { useSEO } from "../composables/useSEO";

// 图标组件
const UserIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
};
const CalendarIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
};
const EyeIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
};

const route = useRoute();

// 响应式数据
const article = ref(null);
const loading = ref(false);
const zenMode = ref(false);
const showZenTip = ref(false);
const zenInput = ref("");
const inputStatus = ref(""); // 'success' | 'error' | ''
const inputMessage = ref("");

// 目录导航相关
const tableOfContents = ref([]);
const activeHeading = ref("");
const readingProgress = ref(0);

// 渲染内容
const renderedContent = computed(() => {
  if (!article.value?.content) return "";
  const rendered = renderMarkdown(article.value.content);
  console.log("Markdown rendered:", rendered.substring(0, 200) + "...");
  return rendered;
});

// 生成目录
const generateTableOfContents = () => {
  if (!article.value?.content) {
    tableOfContents.value = [];
    return;
  }

  const headings = [];
  const lines = article.value.content.split("\n");

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "");

      headings.push({
        level,
        text,
        id,
        line: index,
      });
    }
  });

  tableOfContents.value = headings;
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

// 禅模式相关方法
const closeZenTip = () => {
  showZenTip.value = false;
  zenInput.value = "";
  inputStatus.value = "";
  inputMessage.value = "";
};

// 检查输入的文本
const checkZenInput = () => {
  const input = zenInput.value.trim();

  if (!input) {
    inputStatus.value = "error";
    inputMessage.value = "请输入内容";
    return;
  }

  // 检查是否包含"阿弥陀佛" - 支持多种变体
  const keywords = ["阿弥陀佛", "阿弥陀", "南无阿弥陀佛", "南无阿弥陀"];
  const hasKeyword = keywords.some(
    (keyword) =>
      input.includes(keyword) || input.replace(/\s+/g, "").includes(keyword)
  );

  if (hasKeyword) {
    inputStatus.value = "success";
    inputMessage.value = "验证成功！正在进入禅模式...";

    // 延迟1秒后进入禅模式
    setTimeout(() => {
      enterZenMode();
    }, 1000);
  } else {
    inputStatus.value = "error";
    inputMessage.value = "请输入正确的内容：阿弥陀佛";
  }
};

const enterZenMode = () => {
  showZenTip.value = false;
  zenMode.value = true;
  // 隐藏页面滚动条
  document.body.style.overflow = "hidden";
  // 通知父组件隐藏导航栏
  document.body.classList.add("zen-mode-active");
  // 重置输入状态
  zenInput.value = "";
  inputStatus.value = "";
  inputMessage.value = "";
};

const exitZenMode = () => {
  zenMode.value = false;
  // 恢复页面滚动条
  document.body.style.overflow = "";
  // 通知父组件显示导航栏
  document.body.classList.remove("zen-mode-active");
};

// 滚动到指定标题
const scrollToHeading = (headingId) => {
  const element = document.getElementById(headingId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// 更新阅读进度和当前标题
const updateReadingProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  readingProgress.value = Math.min(100, Math.max(0, progress));

  // 更新当前活跃的标题
  if (tableOfContents.value.length > 0) {
    let currentHeading = "";

    for (let i = tableOfContents.value.length - 1; i >= 0; i--) {
      const heading = tableOfContents.value[i];
      const element = document.getElementById(heading.id);

      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
          break;
        }
      }
    }

    activeHeading.value = currentHeading;
  }
};

// 键盘快捷键支持
const handleKeydown = (event) => {
  if (event.key === "Escape" && zenMode.value) {
    exitZenMode();
  }
  if (event.key === "z" && event.ctrlKey && !zenMode.value && article.value) {
    showZenTip.value = true;
  }
};

// 组件挂载时添加键盘监听

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", updateReadingProgress);
  // 初始化阅读进度
  updateReadingProgress();
});

// 在组件卸载前清理状态
onBeforeUnmount(() => {
  // 立即清理禅模式状态
  if (zenMode.value) {
    exitZenMode();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("scroll", updateReadingProgress);
  // 强制清理全局状态，防止影响其他页面
  document.body.classList.remove("zen-mode-active");
  document.body.style.overflow = "";
});

// 加载文章数据
const loadArticle = async () => {
  try {
    loading.value = true;
    article.value = null;
    const data = await articleApi.getDetail(route.params.id);
    article.value = data;

    // 文章加载完成后生成目录
    if (data) {
      // 使用nextTick确保DOM已更新
      await nextTick();
      generateTableOfContents();
      // 重新计算阅读进度
      setTimeout(() => {
        updateReadingProgress();
      }, 100);

      // 设置文章页面 SEO
      const { setArticleSEO, setArticleStructuredData } = useSEO();
      setArticleSEO(data);
      setArticleStructuredData(data);
    }
  } catch (error) {
    console.error("加载文章失败:", error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// 监听路由参数变化，重新加载文章
watch(
  () => route.params.id,
  (newId) => {
    // 路由切换时，先清理禅模式状态
    if (zenMode.value) {
      exitZenMode();
    }
    if (newId) {
      loadArticle();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* 自定义 prose 样式覆盖 */
.prose {
  @apply text-gray-700;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  @apply text-gray-900;
}

.prose :deep(strong) {
  @apply text-gray-900;
}

.prose :deep(blockquote) {
  @apply border-blue-500 text-gray-600;
}

.prose :deep(code:not(pre code)) {
  color: #0751cf !important;
  background: rgba(7, 81, 207, 0.1) !important;
  border: 1px solid rgba(7, 81, 207, 0.2) !important;
  border-radius: 4px !important;
  font-weight: 500 !important;
  padding: 2px 6px !important;
}

.prose :deep(pre) {
  @apply bg-gray-800/50 border border-gray-600;
}

.prose :deep(a) {
  @apply text-blue-400 hover:text-blue-300;
}

/* 标题锚点样式 */
.prose :deep(.header-anchor) {
  @apply text-gray-400 hover:text-blue-400 no-underline transition-all duration-200;
}

/* 禅模式样式 */
.zen-mode {
  @apply p-0 bg-gradient-to-br from-amber-50 via-white to-orange-50;
}

.zen-article {
  @apply z-30;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.zen-article::-webkit-scrollbar {
  width: 8px;
}

.zen-article::-webkit-scrollbar-track {
  background: transparent;
}

.zen-article::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.zen-article::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.zen-content {
  padding-top: 2rem;
}

.zen-prose {
  @apply text-gray-800 dark:text-gray-200 leading-relaxed;
  line-height: 1.8;
  font-family: "Georgia", "Times New Roman", serif;
}

.zen-prose :deep(h1),
.zen-prose :deep(h2),
.zen-prose :deep(h3) {
  @apply text-gray-900 dark:text-gray-100 mb-6 mt-8;
  font-family: "Georgia", "Times New Roman", serif;
}

.zen-prose :deep(p) {
  @apply mb-6 text-lg leading-relaxed;
}

.zen-prose :deep(blockquote) {
  @apply border-l-4 border-amber-400 pl-6 italic text-gray-700 dark:text-gray-300;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .prose {
    @apply text-sm;
  }

  .zen-prose {
    @apply text-base;
  }
}
</style>

<style>
/* 全局样式：禅模式时隐藏导航栏和页脚 */
body.zen-mode-active header,
body.zen-mode-active footer {
  display: none !important;
}

body.zen-mode-active {
  overflow: hidden !important;
}

/* 确保禅模式下main占满全屏 */
body.zen-mode-active #app {
  height: 100vh !important;
}

body.zen-mode-active #app > main {
  height: 100vh !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* 确保禅模式不影响其他交互 */
body.zen-mode-active a,
body.zen-mode-active button:not(.zen-mode button) {
  pointer-events: auto;
}

/* 数学公式样式 */
.math-block {
  @apply my-4 text-center overflow-x-auto;
}

.math-inline {
  @apply inline-block;
}

.math-error {
  @apply text-red-500 bg-red-50 px-2 py-1 rounded text-sm border border-red-200;
}

/* KaTeX 样式优化 */
.katex-display {
  @apply my-4;
}

.katex {
  font-size: 1.1em;
}

/* 文章内容卡片样式 - 不带hover效果的glass-effect */
.article-content-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(156, 163, 175, 0.2);
  border-radius: 0;
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.1),
    0 2px 8px -2px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  position: relative;
}

.article-content-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(199, 210, 254, 0.3) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(199, 210, 254, 0.3) 1px, transparent 1px);
  background-size: 14px 14px;
  border-radius: 0;
  pointer-events: none;
  opacity: 0.3;
}

/* 亮色模式优化 */
html.light .glass-effect h1,
html.light .article-content-card h1 {
  color: #111827 !important;
}

html.light .glass-effect .text-white {
  color: #111827 !important;
}

html.light .glass-effect .text-gray-300 {
  color: #6b7280 !important;
}

html.light .glass-effect .text-gray-400 {
  color: #9ca3af !important;
}

html.light .glass-effect .border-gray-200 {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

html.light .glass-effect .border-white\/10 {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

html.light .glass-effect .bg-white\/5 {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* 亮色模式下的prose样式优化 */
html.light .prose {
  color: #111827 !important;
}

html.light .prose h1,
html.light .prose h2,
html.light .prose h3,
html.light .prose h4,
html.light .prose h5,
html.light .prose h6 {
  color: #111827 !important;
}

html.light .prose p {
  color: #374151 !important;
}

html.light .prose strong {
  color: #111827 !important;
}

/* 代码块完全不受亮色模式影响，保持暗色样式 */
html.light .prose pre {
  background: #1e293b !important; /* 强制暗色背景 */
  color: #e2e8f0 !important; /* 强制亮色文字 */
  border: 1px solid #334155 !important;
}

html.light .prose pre code {
  background: transparent !important;
  color: inherit !important;
}

/* 内联代码在亮色模式下的样式 */
html.light .prose code:not(pre code) {
  color: #0751cf !important;
  background-color: rgba(7, 81, 207, 0.1) !important;
  border: 1px solid rgba(7, 81, 207, 0.2) !important;
  border-radius: 4px !important;
  font-weight: 500 !important;
}

/* 确保代码块不受glass-effect的白色背景影响 */
html.light .glass-effect pre {
  background: #1e293b !important;
  color: #e2e8f0 !important;
}

html.light .glass-effect pre code {
  background: transparent !important;
  color: inherit !important;
}

/* 移除可能影响代码块的其他白色覆盖 */
html.light .prose pre * {
  background: inherit !important;
}

/* 确保语法高亮的颜色不被覆盖 */
html.light .prose pre .token.comment,
html.light .prose pre .token.prolog,
html.light .prose pre .token.doctype,
html.light .prose pre .token.cdata {
  color: #64748b !important;
}

html.light .prose pre .token.punctuation {
  color: #94a3b8 !important;
}

html.light .prose pre .token.property,
html.light .prose pre .token.tag,
html.light .prose pre .token.boolean,
html.light .prose pre .token.number,
html.light .prose pre .token.constant,
html.light .prose pre .token.symbol,
html.light .prose pre .token.deleted {
  color: #f87171 !important;
}

html.light .prose pre .token.selector,
html.light .prose pre .token.attr-name,
html.light .prose pre .token.string,
html.light .prose pre .token.char,
html.light .prose pre .token.builtin,
html.light .prose pre .token.inserted {
  color: #34d399 !important;
}

html.light .prose pre .token.operator,
html.light .prose pre .token.entity,
html.light .prose pre .token.url,
html.light .prose pre .language-css .token.string,
html.light .prose pre .style .token.string {
  color: #60a5fa !important;
}

html.light .prose pre .token.atrule,
html.light .prose pre .token.attr-value,
html.light .prose pre .token.keyword {
  color: #a78bfa !important;
}

html.light .prose pre .token.function,
html.light .prose pre .token.class-name {
  color: #fbbf24 !important;
}

html.light .prose pre .token.regex,
html.light .prose pre .token.important,
html.light .prose pre .token.variable {
  color: #fb7185 !important;
}

html.light .prose blockquote {
  color: #6b7280 !important;
  border-left-color: #d1d5db !important;
}

html.light .prose a {
  color: #2563eb !important;
}

html.light .prose a:hover {
  color: #1d4ed8 !important;
}

/* 视频播放器样式 */
.prose :deep(video) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin: 1.5rem 0 !important;
  background: #000 !important;
}

.prose :deep(video:focus) {
  outline: 2px solid #0751cf !important;
  outline-offset: 2px !important;
}

/* 视频容器样式 */
.prose :deep(video) {
  display: block !important;
}

/* B站视频播放器样式 - 使用全局样式，移除重复定义 */

/* 亮色模式下的目录导航样式 */
html.light .glass-effect .text-gray-900 {
  color: #111827 !important;
}

html.light .glass-effect .text-gray-600 {
  color: #4b5563 !important;
}

html.light .glass-effect .hover\\:text-blue-600:hover {
  color: #2563eb !important;
}

html.light .glass-effect .text-blue-600 {
  color: #2563eb !important;
}

html.light .glass-effect .border-l-blue-600 {
  border-left-color: #2563eb !important;
}

html.light .glass-effect .bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.1) !important;
}

/* 亮色模式下的禅模式弹窗样式 */
html.light .glass-effect .text-gray-200 {
  color: #4b5563 !important;
}

html.light .glass-effect .border-white\/10 {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* 亮色模式下的输入框样式 */
html.light .glass-effect input {
  background-color: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
  color: #111827 !important;
}

html.light .glass-effect input::placeholder {
  color: #6b7280 !important;
}

html.light .glass-effect input:focus {
  background-color: rgba(0, 0, 0, 0.08) !important;
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2) !important;
}
</style>
