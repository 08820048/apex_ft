<template>
  <header class="app-header glass-effect sticky top-0 z-50 backdrop-blur-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="group flex items-center space-x-3">
          <img
            src="/apex.jpg"
            alt="ApexBlog Logo"
            class="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform shadow-md"
          />
          <span
            class="text-3xl font-bold text-white group-hover:scale-105 transition-transform logo-text special-font"
          >
            八尺妖剑
          </span>
        </RouterLink>

        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- 搜索框和拉线开关 -->
        <div class="hidden lg:flex items-center space-x-4 relative">
          <div class="relative">
            <input
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索文章..."
              class="w-64 px-4 py-2 pl-10 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30 transition-all shadow-sm search-input"
            />
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300"
            />
          </div>
          <button
            @click="handleSearch"
            class="px-4 py-2 bg-gray-900 hover:bg-black transition-colors search-btn"
            style="color: white !important"
          >
            搜索
          </button>

          <!-- 拉线开关 -->
          <PullChainSwitch />
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 hover:bg-white/10 transition-colors mobile-menu-btn"
        >
          <MenuIcon
            v-if="!mobileMenuOpen"
            class="w-6 h-6 text-white menu-icon"
          />
          <XIcon v-else class="w-6 h-6 text-white menu-icon" />
        </button>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="slide-up">
        <div
          v-if="mobileMenuOpen"
          class="md:hidden py-4 border-t border-gray-200 mobile-menu"
        >
          <!-- 移动端Logo -->
          <div
            class="flex items-center justify-center px-4 pb-4 border-b border-gray-100"
          >
            <img
              src="/apex.jpg"
              alt="ApexBlog Logo"
              class="w-8 h-8 rounded-full object-cover mr-2 shadow-sm"
            />
            <span
              class="text-2xl font-bold text-white mobile-logo-text special-font"
              >八尺妖剑</span
            >
          </div>

          <div class="flex flex-col space-y-4 pt-4">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-2 text-white hover:bg-white/10 transition-colors mobile-nav-link"
            >
              {{ item.name }}
            </RouterLink>

            <!-- 移动端拉线开关 -->
            <div class="px-4 py-2 border-t border-gray-200 flex justify-center">
              <PullChainSwitch />
            </div>

            <!-- 移动端搜索 -->
            <div class="px-4">
              <div class="relative">
                <input
                  v-model="searchKeyword"
                  @keyup.enter="handleSearch"
                  type="text"
                  placeholder="搜索文章..."
                  class="w-full px-4 py-2 pl-10 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30 transition-all shadow-sm mobile-search-input"
                />
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "../composables/useTheme.js";
import PullChainSwitch from "./PullChainSwitch.vue";

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

const router = useRouter();
const searchKeyword = ref("");
const mobileMenuOpen = ref(false);

// 主题功能
const { isDark } = useTheme();

const navItems = [
  { name: "首页", path: "/" },
  { name: "分类", path: "/categories" },
  { name: "标签", path: "/tags" },
  { name: "作品", path: "/portfolios" },
  { name: "友链", path: "/friend-links" },
  { name: "订阅", path: "/subscribe" },
  { name: "关于", path: "/about" },
];

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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  overflow: visible; /* 允许拉线超出header */
  position: relative;
  z-index: 50;
}

html.light .app-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* 导航链接样式 */
.nav-link {
  @apply flex items-center px-3 py-2 text-white hover:text-gray-200 transition-all duration-200 hover:bg-white/10;
}

.nav-link-active {
  @apply text-white bg-white/20;
}

/* 亮色模式下的导航链接 */
html.light .nav-link {
  @apply text-gray-700 hover:text-gray-900;
}

html.light .nav-link:hover {
  background: rgba(0, 0, 0, 0.1);
}

html.light .nav-link-active {
  @apply text-gray-900;
  background: rgba(0, 0, 0, 0.15);
}

/* Logo特殊字体样式 - 简洁风格 */
.special-font {
  font-family: "汉仪行楷", "HanYi XingKai", "STXingkai", "华文行楷", "STKaiti",
    "KaiTi", "楷体", "STFangsong", "FangSong", "仿宋", "Microsoft YaHei",
    "微软雅黑", "SimSun", "宋体", "cursive", "serif";
  font-weight: 700;
  font-size: 1.3em; /* 适度增大 */
  letter-spacing: 0.1em;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
    rgba(255, 255, 255, 0.6),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.special-font:hover::after {
  opacity: 1;
}

.special-font:hover {
  transform: scale(1.15); /* 悬停时进一步放大 */
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
}

/* Logo文字亮色模式 */
html.light .logo-text {
  @apply text-gray-900;
}

html.light .special-font {
  color: #111827;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

html.light .special-font:hover {
  transform: scale(1.15);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

html.light .special-font::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.4),
    transparent
  );
}

/* 移动端亮色模式样式 */
html.light .mobile-menu {
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

html.light .mobile-logo-text {
  @apply text-gray-900;
}

html.light .mobile-nav-link {
  @apply text-gray-700 hover:text-gray-900;
}

html.light .mobile-nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
}

html.light .mobile-theme-btn {
  @apply text-gray-700 hover:text-gray-900;
}

html.light .mobile-theme-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

html.light .mobile-menu-btn {
  /* 移动端菜单按钮亮色模式样式 */
}

html.light .mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

html.light .menu-icon {
  @apply text-gray-700;
}

/* 搜索框亮色模式样式 */
html.light .search-input {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
  color: #111827 !important;
}

html.light .search-input::placeholder {
  color: #6b7280 !important;
}

html.light .search-input:focus {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(0, 0, 0, 0.25) !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
}

/* 亮色模式下的搜索图标 */
html.light .search-input + svg {
  color: #6b7280 !important;
}

/* 移动端搜索框亮色模式样式 */
html.light .mobile-search-input {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
  color: #111827 !important;
}

html.light .mobile-search-input::placeholder {
  color: #6b7280 !important;
}

html.light .mobile-search-input:focus {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(0, 0, 0, 0.25) !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
}

/* 搜索按钮样式 - 确保文字始终为白色 */
.search-btn {
  color: white !important;
}

html.light .search-btn {
  background: #111827 !important;
  color: white !important;
}

html.light .search-btn:hover {
  background: #000000 !important;
  color: white !important;
}

/* 主题切换按钮亮色模式样式 */
html.light .theme-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
