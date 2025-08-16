<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">友情链接</h1>
        <p class="text-xl text-gray-200">与优秀的朋友们一起成长</p>
      </div>

      <!-- 本站友链信息 -->
      <div class="glass-effect p-6 mb-8 border border-blue-500/30">
        <h2 class="text-xl font-bold text-white mb-4 flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          本站友链信息
        </h2>
        <p class="text-gray-200 text-sm mb-4">
          如果您想添加本站到您的友链中，请使用以下信息：
        </p>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >博客名称</label
              >
              <div
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
              >
                Apex-八尺妖剑
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >博客地址</label
              >
              <div
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
              >
                https://www.ilikexff.cn/
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >博客Logo</label
              >
              <div
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm break-all"
              >
                https://images.waer.ltd/notes/202508151240669.jpg
              </div>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >博客描述</label
              >
              <div
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
              >
                一个爱玩马超的游戏程序员。
              </div>
            </div>
          </div>
          <div
            class="flex items-center pt-3 border-t border-gray-200 dark:border-gray-600"
          >
            <img
              src="https://images.waer.ltd/notes/202508151240669.jpg"
              alt="Apex-八尺妖剑"
              class="w-8 h-8 rounded-full mr-2"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >预览效果</span
            >
          </div>
        </div>
      </div>

      <!-- 友链申请说明 -->
      <div class="glass-effect p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          友链申请
        </h2>
        <div class="text-gray-600 dark:text-gray-300 space-y-2">
          <p>欢迎与我交换友情链接！申请前请确保：</p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>网站内容积极向上，无违法违规内容</li>
            <li>网站能够正常访问，更新频率较高</li>
            <li>优先考虑技术类、学习类博客</li>
          </ul>
          <p class="mt-4">
            申请方式：请发送邮件至
            <a
              href="mailto:ilikexff@gmail.com"
              class="text-blue-600 hover:text-blue-800"
              >ilikexff@gmail.com</a
            >
            ，包含网站名称、网站地址、网站描述和站长信息。
          </p>
        </div>
      </div>

      <!-- 友链列表 -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          友站推荐
        </h2>

        <!-- 加载状态 -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div v-for="i in 8" :key="i" class="glass-effect p-6 animate-pulse">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div class="flex-1">
                <div class="h-5 bg-gray-300 rounded mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        <!-- 友链网格 -->
        <div
          v-else-if="friendLinks.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <a
            v-for="link in friendLinks"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="glass-effect p-6 card-hover group block"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 flex-shrink-0 mr-4">
                <img
                  v-if="link.avatar"
                  :src="link.avatar"
                  :alt="link.name"
                  class="w-full h-full object-cover rounded-full"
                  @error="handleImageError"
                />
                <div
                  v-else
                  class="w-full h-full bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-white font-bold text-lg">
                    {{ link.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                >
                  {{ link.name }}
                </h3>
                <p class="text-sm text-gray-500 truncate">
                  {{ getDomain(link.url) }}
                </p>
              </div>
            </div>

            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
              {{ link.description || "暂无描述" }}
            </p>

            <div
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <span>{{ formatDate(link.createdAt) }}</span>
              <div class="flex items-center">
                <ExternalLinkIcon class="w-3 h-3 mr-1" />
                <span>访问</span>
              </div>
            </div>
          </a>
        </div>

        <!-- 空状态 -->
        <div v-else class="glass-effect p-12 text-center">
          <div class="text-gray-400 dark:text-gray-500 mb-4">
            <LinkIcon class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            暂无友链
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            还没有添加任何友情链接，欢迎申请交换友链。
          </p>
        </div>
      </div>

      <!-- 友链统计 -->
      <div v-if="friendLinks.length > 0" class="mt-8 text-center">
        <p class="text-gray-600 dark:text-white/80">
          共有
          <span class="font-bold text-gray-900 dark:text-white">{{
            friendLinks.length
          }}</span>
          个友站
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { friendLinkApi } from "../api";

// 图标组件
const ExternalLinkIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
};
const LinkIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
};

// 响应式数据
const friendLinks = ref([]);
const loading = ref(false);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// 获取域名
const getDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return url;
  }
};

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = "none";
  const parent = event.target.parentElement;
  if (parent) {
    const fallback = document.createElement("div");
    fallback.className =
      "w-full h-full bg-blue-600 rounded-full flex items-center justify-center";
    fallback.innerHTML = `<span class="text-white font-bold text-lg">${event.target.alt
      .charAt(0)
      .toUpperCase()}</span>`;
    parent.appendChild(fallback);
  }
};

// 加载友链列表
const loadFriendLinks = async () => {
  try {
    loading.value = true;
    const data = await friendLinkApi.getList();
    // 只显示激活的友链
    friendLinks.value = (data || []).filter((link) => link.isActive);
  } catch (error) {
    console.error("加载友链失败:", error);
    friendLinks.value = [];
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(loadFriendLinks);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 亮色模式优化 */
html.light .text-white {
  color: #111827 !important;
}

html.light .text-gray-200 {
  color: #4b5563 !important;
}

html.light .text-gray-300 {
  color: #6b7280 !important;
}

html.light .text-gray-400 {
  color: #9ca3af !important;
}

html.light .text-gray-600 {
  color: #4b5563 !important;
}

html.light .text-gray-700 {
  color: #374151 !important;
}

html.light .text-gray-900 {
  color: #111827 !important;
}

html.light .text-blue-400 {
  color: #2563eb !important;
}

html.light .text-green-400 {
  color: #059669 !important;
}

html.light .text-red-400 {
  color: #dc2626 !important;
}

/* 亮色模式下的表单样式 */
html.light .bg-gray-50 {
  background-color: #f8fafc !important;
}

html.light .bg-white {
  background-color: #ffffff !important;
}

html.light .border-gray-300 {
  border-color: #d1d5db !important;
}

html.light .bg-gray-600 {
  background-color: #d1d5db !important;
}
</style>
