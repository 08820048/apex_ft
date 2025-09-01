<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden">
    <!-- 主要内容区域 -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 py-12">
      <!-- 标题区域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          区域分割装饰效果测试
        </h1>
        <p class="text-xl text-gray-600">
          四角菱形装饰 + 射出线条的区域分割效果
        </p>
      </div>

      <!-- 装饰区域示例 -->
      <div class="decorated-section mb-12 p-8 bg-white rounded-lg relative">
        <!-- 下方两个角的装饰元素 -->
        <div class="corner-bottom-left"></div>
        <div class="corner-bottom-right"></div>

        <h2 class="text-2xl font-bold text-gray-900 mb-4">主要装饰区域</h2>
        <p class="text-gray-600 mb-4">
          这个区域展示了四角菱形装饰效果。每个角落都有一个菱形图案，
          从菱形向区域内部射出装饰线条，用于美化和分割内容区域。
        </p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="p-4 bg-gray-50 rounded">
            <h3 class="font-semibold mb-2">设计特点</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 四角菱形装饰</li>
              <li>• 向内射出的线条</li>
              <li>• 精致的区域分割</li>
              <li>• 工程图纸风格</li>
            </ul>
          </div>
          <div class="p-4 bg-gray-50 rounded">
            <h3 class="font-semibold mb-2">应用场景</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 重要内容区域</li>
              <li>• 卡片装饰边框</li>
              <li>• 页面分割线</li>
              <li>• 高端设计元素</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 更多装饰示例 -->
      <div class="grid gap-8 md:grid-cols-2">
        <!-- 小型装饰区域 -->
        <div class="decorated-section p-6 bg-white rounded-lg relative">
          <div class="corner-bottom-left"></div>
          <div class="corner-bottom-right"></div>

          <h3 class="text-xl font-bold text-gray-900 mb-3">小型装饰区域</h3>
          <p class="text-gray-600 text-sm">
            适用于卡片、侧边栏等较小的内容区域。
            菱形装饰和射出线条会自动适应区域大小。
          </p>
        </div>

        <!-- 另一个装饰区域 -->
        <div class="decorated-section p-6 bg-white rounded-lg relative">
          <div class="corner-bottom-left"></div>
          <div class="corner-bottom-right"></div>

          <h3 class="text-xl font-bold text-gray-900 mb-3">对称装饰效果</h3>
          <p class="text-gray-600 text-sm">
            四个角的菱形装饰完全对称， 创造出平衡和谐的视觉效果。
          </p>
        </div>
      </div>

      <!-- 长条形装饰区域 -->
      <div class="decorated-section mt-8 p-6 bg-white rounded-lg relative">
        <div class="corner-bottom-left"></div>
        <div class="corner-bottom-right"></div>

        <h3 class="text-xl font-bold text-gray-900 mb-3">长条形装饰区域</h3>
        <p class="text-gray-600">
          这种装饰效果也适用于横向的长条形区域，比如页面分割线、导航栏等。
          菱形装饰和射出线条为区域增添了精致的工程图纸风格。
        </p>
      </div>

      <!-- 测试卡片 -->
      <div class="grid gap-8 md:grid-cols-2">
        <!-- 卡片1 -->
        <div class="glass-effect rounded-2xl p-8 border-2 border-black">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">效果测试卡片 1</h2>
          <p class="text-gray-600 mb-4">
            这是一个测试卡片，用来展示稿纸风格背景效果。背景应该有精致的网格线条，
            类似于高质量的稿纸或工程图纸的效果。
          </p>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >标签1</span
            >
            <span class="px-3 py-1 bg-green-600 text-white text-sm rounded-full"
              >标签2</span
            >
          </div>
        </div>

        <!-- 卡片2 -->
        <div class="glass-effect rounded-2xl p-8 border-2 border-gray-300">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">效果测试卡片 2</h2>
          <p class="text-gray-600 mb-4">
            这个卡片使用了不同的边框颜色，用来测试在稿纸背景下的视觉效果。
            背景网格应该既不会太突兀，也不会太淡。
          </p>
          <button
            class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            测试按钮
          </button>
        </div>

        <!-- 卡片3 -->
        <div class="glass-effect rounded-2xl p-8 border-2 border-blue-500">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">透明度测试</h2>
          <p class="text-gray-600 mb-4">
            这个卡片用来测试玻璃效果与稿纸背景的配合。
            背景网格应该在卡片后面若隐若现。
          </p>
          <div class="bg-white/50 p-4 rounded-lg">
            <p class="text-sm text-gray-700">半透明内容区域</p>
          </div>
        </div>

        <!-- 卡片4 -->
        <div class="glass-effect rounded-2xl p-8 border-2 border-purple-500">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">颜色对比测试</h2>
          <p class="text-gray-600 mb-4">
            测试不同颜色的边框与稿纸背景的搭配效果。
          </p>
          <div class="space-y-2">
            <div class="h-4 bg-red-200 rounded"></div>
            <div class="h-4 bg-green-200 rounded"></div>
            <div class="h-4 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- 文本内容测试 -->
      <div class="mt-12 glass-effect rounded-2xl p-8 border-2 border-black">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">长文本内容测试</h2>
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-700 leading-relaxed mb-4">
            这是一段较长的文本内容，用来测试稿纸背景在大面积文本阅读时的效果。
            背景网格应该足够精致，不会干扰文本的阅读体验，同时又能提供一种专业的、
            类似工程图纸或高质量稿纸的视觉感受。
          </p>
          <p class="text-gray-700 leading-relaxed mb-4">
            Zed.dev
            的背景效果非常精致，它使用了细腻的网格线条，创造出一种现代化的
            稿纸效果。这种设计既保持了专业感，又不会过于突兀，是一个很好的参考。
          </p>
          <p class="text-gray-700 leading-relaxed">
            我们的目标是创造一个类似的效果，让整个页面看起来更加精致和专业，
            同时保持良好的可读性和用户体验。
          </p>
        </div>
      </div>

      <!-- 效果控制面板 -->
      <div class="mt-12 glass-effect rounded-2xl p-8 border-2 border-gray-400">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">背景效果控制</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <button
            @click="switchPattern('default')"
            :class="
              currentPattern === 'default'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-lg transition-colors"
          >
            交织网格
          </button>
          <button
            @click="switchPattern('fine')"
            :class="
              currentPattern === 'fine'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-lg transition-colors"
          >
            精细菱形
          </button>
          <button
            @click="switchPattern('minimal')"
            :class="
              currentPattern === 'minimal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-lg transition-colors"
          >
            简化线条
          </button>
        </div>
        <p class="mt-4 text-sm text-gray-600">
          点击按钮切换不同的交织网格效果，每种都有菱形装饰和射出线条。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 当前背景模式
const currentPattern = ref("default");

// 切换背景模式
const switchPattern = (pattern) => {
  currentPattern.value = pattern;
  const body = document.body;

  // 移除所有背景类
  body.classList.remove(
    "bg-pattern-default",
    "bg-pattern-fine",
    "bg-pattern-minimal"
  );

  // 添加新的背景类
  body.classList.add(`bg-pattern-${pattern}`);
};
</script>

<style scoped>
/* 装饰区域样式 */
.decorated-section {
  position: relative;
  border: 2px solid #e5e7eb;
}

/* 四角菱形装饰 */
.decorated-section::before,
.decorated-section::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  transform: rotate(45deg);
  z-index: 10;
}

/* 左上角菱形 */
.decorated-section::before {
  top: -8px;
  left: -8px;
  box-shadow:
    /* 向右射出的线条 */ 16px 8px 0 -6px #3b82f6,
    32px 8px 0 -7px #3b82f6, 48px 8px 0 -7px #3b82f6,
    /* 向下射出的线条 */ 8px 16px 0 -6px #3b82f6, 8px 32px 0 -7px #3b82f6,
    8px 48px 0 -7px #3b82f6;
}

/* 右上角菱形 */
.decorated-section::after {
  top: -8px;
  right: -8px;
  box-shadow:
    /* 向左射出的线条 */ -16px 8px 0 -6px #3b82f6,
    -32px 8px 0 -7px #3b82f6, -48px 8px 0 -7px #3b82f6,
    /* 向下射出的线条 */ -8px 16px 0 -6px #3b82f6, -8px 32px 0 -7px #3b82f6,
    -8px 48px 0 -7px #3b82f6;
}

/* 使用伪元素创建下方两个角的装饰 */
.decorated-section {
  overflow: visible;
}

.decorated-section .corner-bottom-left,
.decorated-section .corner-bottom-right {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  transform: rotate(45deg);
  z-index: 10;
}

.decorated-section .corner-bottom-left {
  bottom: -8px;
  left: -8px;
  box-shadow:
    /* 向右射出的线条 */ 16px -8px 0 -6px #3b82f6,
    32px -8px 0 -7px #3b82f6, 48px -8px 0 -7px #3b82f6,
    /* 向上射出的线条 */ 8px -16px 0 -6px #3b82f6, 8px -32px 0 -7px #3b82f6,
    8px -48px 0 -7px #3b82f6;
}

.decorated-section .corner-bottom-right {
  bottom: -8px;
  right: -8px;
  box-shadow:
    /* 向左射出的线条 */ -16px -8px 0 -6px #3b82f6,
    -32px -8px 0 -7px #3b82f6, -48px -8px 0 -7px #3b82f6,
    /* 向上射出的线条 */ -8px -16px 0 -6px #3b82f6, -8px -32px 0 -7px #3b82f6,
    -8px -48px 0 -7px #3b82f6;
}

/* 玻璃效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .bg-paper-pattern {
    background-color: #0f0f0f;
    background-image:
      /* 主要网格线 - 暗色模式下的蓝色调 */ linear-gradient(
        rgba(96, 165, 250, 0.12) 0.5px,
        transparent 0.5px
      ),
      linear-gradient(90deg, rgba(96, 165, 250, 0.12) 0.5px, transparent 0.5px),
      /* 细密网格线 - 更精细的灰色线条 */
        linear-gradient(rgba(148, 163, 184, 0.06) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.06) 0.5px, transparent 0.5px),
      /* 点状装饰 - 暗色模式下的点状效果 */
        radial-gradient(
          circle at 0 0,
          rgba(96, 165, 250, 0.05) 1px,
          transparent 1px
        );
    background-size: 24px 24px, 24px 24px, 6px 6px, 6px 6px, 12px 12px;
  }

  .glass-effect {
    background: rgba(15, 15, 15, 0.8);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bg-paper-pattern {
    background-size: 20px 20px, 20px 20px, 5px 5px, 5px 5px, 10px 10px;
  }
}
</style>

<style>
/* 全局背景效果变体 */
.bg-pattern-default {
  background-color: #fafafa !important;
  background-image: linear-gradient(
      rgba(59, 130, 246, 0.08) 0.5px,
      transparent 0.5px
    ),
    linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0.5px, transparent 0.5px),
    linear-gradient(rgba(148, 163, 184, 0.04) 0.5px, transparent 0.5px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.04) 0.5px, transparent 0.5px),
    radial-gradient(
      circle at 0 0,
      rgba(59, 130, 246, 0.03) 1px,
      transparent 1px
    ) !important;
  background-size: 24px 24px, 24px 24px, 6px 6px, 6px 6px, 12px 12px !important;
}

.bg-pattern-fine {
  background-color: #f8fafc !important;
  background-image: linear-gradient(
      rgba(59, 130, 246, 0.06) 0.5px,
      transparent 0.5px
    ),
    linear-gradient(90deg, rgba(59, 130, 246, 0.06) 0.5px, transparent 0.5px),
    linear-gradient(rgba(148, 163, 184, 0.03) 0.5px, transparent 0.5px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.03) 0.5px, transparent 0.5px) !important;
  background-size: 16px 16px, 16px 16px, 4px 4px, 4px 4px !important;
}

.bg-pattern-minimal {
  background-color: #fdfdfd !important;
  background-image: linear-gradient(
      rgba(59, 130, 246, 0.04) 0.5px,
      transparent 0.5px
    ),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 0.5px, transparent 0.5px) !important;
  background-size: 32px 32px, 32px 32px !important;
}

/* 暗色模式下的全局背景变体 */
@media (prefers-color-scheme: dark) {
  .bg-pattern-default {
    background-color: #0f0f0f !important;
    background-image: linear-gradient(
        rgba(96, 165, 250, 0.12) 0.5px,
        transparent 0.5px
      ),
      linear-gradient(90deg, rgba(96, 165, 250, 0.12) 0.5px, transparent 0.5px),
      linear-gradient(rgba(148, 163, 184, 0.06) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.06) 0.5px, transparent 0.5px),
      radial-gradient(
        circle at 0 0,
        rgba(96, 165, 250, 0.05) 1px,
        transparent 1px
      ) !important;
  }

  .bg-pattern-fine {
    background-color: #111827 !important;
    background-image: linear-gradient(
        rgba(96, 165, 250, 0.08) 0.5px,
        transparent 0.5px
      ),
      linear-gradient(90deg, rgba(96, 165, 250, 0.08) 0.5px, transparent 0.5px),
      linear-gradient(rgba(148, 163, 184, 0.04) 0.5px, transparent 0.5px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.04) 0.5px, transparent 0.5px) !important;
  }

  .bg-pattern-minimal {
    background-color: #0a0a0a !important;
    background-image: linear-gradient(
        rgba(96, 165, 250, 0.06) 0.5px,
        transparent 0.5px
      ),
      linear-gradient(90deg, rgba(96, 165, 250, 0.06) 0.5px, transparent 0.5px) !important;
  }
}
</style>
