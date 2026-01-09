<template>
  <header class="app-header fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ t(item.labelKey) }}
          </RouterLink>
        </nav>

        <!-- 搜索框和语言切换 -->
        <div class="hidden lg:flex items-center space-x-6 relative">
          <div class="relative">
            <input
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="t('search.placeholder')"
              class="w-64 px-4 py-2 pl-10 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm search-input"
            />
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            />
          </div>
          <button
            @click="handleSearch"
            class="px-4 py-2 text-white hover:opacity-90 transition-all search-btn"
            style="background-color: #0751cf"
          >
            {{ t("search.action") }}
          </button>
          <button
            type="button"
            class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            :title="t('language.toggle')"
            @click="toggleLocale"
          >
            <LanguageIcon class="w-6 h-6" />
            <span class="text-sm font-medium">{{ currentLocaleLabel }}</span>
          </button>
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 hover:bg-gray-100 transition-colors mobile-menu-btn"
        >
          <MenuIcon
            v-if="!mobileMenuOpen"
            class="w-6 h-6 text-gray-900 menu-icon"
          />
          <XIcon v-else class="w-6 h-6 text-gray-900 menu-icon" />
        </button>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="slide-up">
        <div
          v-if="mobileMenuOpen"
          class="md:hidden py-4 border-t border-gray-200 mobile-menu"
        >
          <!-- 移动端分割线 -->
          <div class="px-4 pb-4 border-b border-gray-100"></div>

          <div class="flex flex-col space-y-4 pt-4">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors mobile-nav-link"
            >
              {{ t(item.labelKey) }}
            </RouterLink>

            <!-- 移动端搜索 -->
            <div class="px-4">
              <div class="relative">
                <input
                  v-model="searchKeyword"
                  @keyup.enter="handleSearch"
                  type="text"
                  :placeholder="t('search.placeholder')"
                  class="w-full px-4 py-2 pl-10 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm mobile-search-input"
                />
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                />
              </div>
            </div>

            <button
              type="button"
              class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors mobile-nav-link"
              @click="toggleLocaleFromMobile"
            >
              <LanguageIcon class="w-5 h-5 mr-3" />
              {{ t("language.toggle") }}：{{ currentLocaleLabel }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// 图标组件 (使用简单的 SVG)
const HomeIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
};
const FolderIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>',
};
const TagIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>',
};
const PortfolioIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg>',
};
const LinkIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
};
const EmailIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
};
const UserIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
};
const SearchIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
};
const MenuIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
};
const XIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
};
const LanguageIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.938 9h-3.095a15.64 15.64 0 00-1.2-5.067A8.03 8.03 0 0119.938 11zM12 4.062c.93 1.19 1.72 3.12 2.15 5.938h-4.3C10.28 7.182 11.07 5.252 12 4.062zM4.062 13h3.095c.22 1.8.73 3.55 1.2 5.067A8.03 8.03 0 014.062 13zM7.157 11H4.062a8.03 8.03 0 014.295-5.067A15.64 15.64 0 007.157 11zM7.157 13h3.438c.26 2.11.8 4.03 1.405 5.525-.16.01-.318.013-.476.013-1.38 0-2.67-.35-3.8-.96A13.45 13.45 0 017.157 13zm3.438-2H7.157c.18-1.72.64-3.35 1.205-4.72A8.046 8.046 0 0111.524 5.5c-.605 1.495-1.145 3.39-1.405 5.5zM12.476 18.525c.605-1.495 1.145-3.39 1.405-5.525h3.438c-.18 1.72-.64 3.35-1.205 4.72a8.046 8.046 0 01-3.638.805c-.158 0-.316-.003-.476-.013zM13.881 11c-.26-2.11-.8-4.005-1.405-5.5a8.046 8.046 0 013.638.805c.565 1.37 1.025 3 1.205 4.695h-3.438zM15.643 18.067A15.64 15.64 0 0016.843 13h3.095a8.03 8.03 0 01-4.295 5.067z"/></svg>',
};

const router = useRouter();
const { t, locale } = useI18n();
const searchKeyword = ref("");
const mobileMenuOpen = ref(false);

const navItems = [
  { labelKey: "nav.home", path: "/" },
  { labelKey: "nav.categories", path: "/categories" },
  { labelKey: "nav.tags", path: "/tags" },
  { labelKey: "nav.portfolios", path: "/portfolios" },
  { labelKey: "nav.friendLinks", path: "/friend-links" },
  { labelKey: "nav.subscribe", path: "/subscribe" },
  { labelKey: "nav.goods", path: "/goods" },
  { labelKey: "nav.about", path: "/about" },
];

const currentLocaleLabel = computed(() =>
  locale.value === "en" ? t("language.en") : t("language.zh")
);

const toggleLocale = () => {
  const next = locale.value === "en" ? "zh-CN" : "en";
  locale.value = next;
  localStorage.setItem("ornata_locale", next);
};

const toggleLocaleFromMobile = () => {
  toggleLocale();
  closeMobileMenu();
};

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ name: "search", query: { q: searchKeyword.value.trim() } });
    closeMobileMenu();
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
/* Header样式 */
.app-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  background: #f7f7f2;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  /* 添加原glass-effect的基础样式，但不包含hover效果 */
  border: 1px solid rgba(156, 163, 175, 0.2);
  backdrop-filter: blur(12px);
}

/* 导航链接样式 */
.nav-link {
  @apply flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100;
}

.nav-link-active {
  @apply text-gray-900 bg-gray-200;
}

/* Logo特殊字体样式 - 简洁风格 */
.special-font {
  font-family: "Microsoft YaHei", "微软雅黑", "SimSun", "宋体", "Arial",
    "sans-serif";
  font-weight: 700;
  font-size: 1.3em; /* 适度增大 */
  letter-spacing: 0.1em;
  color: #111827 !important; /* 深灰色，确保在白色背景上清晰可见 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.special-font::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(17, 24, 39, 0.6),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 搜索按钮样式 - 确保文字始终为白色 */
.search-btn {
  color: white !important;
}
</style>
