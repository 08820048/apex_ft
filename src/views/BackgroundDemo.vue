<template>
  <div class="background-demo">
    <!-- WebGL Canvas for 3D Grid Background -->
    <canvas
      ref="webglCanvas"
      id="webgl-canvas"
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 w-screen h-screen"
      data-engine="three.js"
    ></canvas>

    <!-- Content overlay -->
    <div class="relative z-10 min-h-screen bg-neutral-900/80 text-white">
      <!-- Header -->
      <header class="relative z-10 p-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl font-bold text-white mb-4">
            动态网格背景效果预览
          </h1>
          <p class="text-neutral-300 text-lg">
            这是从demo.html中提取的Three.js动态网格背景效果
          </p>
        </div>
      </header>

      <!-- Demo Content -->
      <main class="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div
            class="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6"
          >
            <h3 class="text-lg font-semibold mb-3">背景特点</h3>
            <ul class="text-sm text-neutral-300 space-y-2">
              <li>• 3D网格动态效果</li>
              <li>• Three.js渲染引擎</li>
              <li>• 响应式适配</li>
              <li>• 性能优化</li>
            </ul>
          </div>

          <!-- Card 2 -->
          <div
            class="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6"
          >
            <h3 class="text-lg font-semibold mb-3">技术实现</h3>
            <ul class="text-sm text-neutral-300 space-y-2">
              <li>• CDN加载Three.js组件</li>
              <li>• 固定定位画布</li>
              <li>• 透明度叠加</li>
              <li>• 硬件加速</li>
            </ul>
          </div>

          <!-- Card 3 -->
          <div
            class="bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6"
          >
            <h3 class="text-lg font-semibold mb-3">视觉效果</h3>
            <ul class="text-sm text-neutral-300 space-y-2">
              <li>• 深度感强烈</li>
              <li>• 科技感十足</li>
              <li>• 动态交互</li>
              <li>• 现代设计</li>
            </ul>
          </div>
        </div>

        <!-- Control Panel -->
        <div
          class="mt-12 bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-3xl p-6"
        >
          <h3 class="text-lg font-semibold mb-4">背景控制</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="resetCamera"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              重置相机位置
            </button>
            <button
              @click="toggleAnimation"
              class="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
            >
              {{ animationPaused ? "恢复动画" : "暂停动画" }}
            </button>
            <button
              @click="changeGridColor"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              切换网格颜色
            </button>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8 text-center">
          <router-link
            to="/"
            class="inline-flex items-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            返回首页
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const webglCanvas = ref(null);
const animationPaused = ref(false);
let backgroundInstance = null;

onMounted(async () => {
  try {
    // 动态加载Three.js背景组件
    const Grid1Background = await import(
      "https://cdn.jsdelivr.net/npm/threejs-components@0.0.16/build/backgrounds/grid1.cdn.min.js"
    );

    if (webglCanvas.value && Grid1Background.default) {
      backgroundInstance = Grid1Background.default(webglCanvas.value);

      // 设置相机位置和视野 - 调整为更远的距离让六边形看起来更小
      if (backgroundInstance?.camera) {
        backgroundInstance.camera.position.set(0, 0, 150);
        // 使用更小的视野角度让网格看起来更密集
        if (backgroundInstance.camera.fov) {
          backgroundInstance.camera.fov = 35;
          backgroundInstance.camera.updateProjectionMatrix();
        }
      }
    }
  } catch (error) {
    console.error("Failed to load background:", error);
  }
});

onUnmounted(() => {
  // 清理资源
  if (backgroundInstance && backgroundInstance.dispose) {
    backgroundInstance.dispose();
  }
});

// 重置相机位置
const resetCamera = () => {
  if (backgroundInstance?.camera) {
    backgroundInstance.camera.position.set(0, 0, 150);
    if (backgroundInstance.camera.fov) {
      backgroundInstance.camera.fov = 35;
      backgroundInstance.camera.updateProjectionMatrix();
    }
  }
};

// 切换动画状态
const toggleAnimation = () => {
  animationPaused.value = !animationPaused.value;
  // 这里可以添加暂停/恢复动画的逻辑
  console.log(
    "Animation toggled:",
    animationPaused.value ? "Paused" : "Playing"
  );
};

// 切换网格颜色
const changeGridColor = () => {
  // 这里可以添加改变网格颜色的逻辑
  console.log("Grid color changed");
};
</script>

<style scoped>
.background-demo {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

/* 确保canvas覆盖整个屏幕 */
#webgl-canvas {
  display: block;
  background: #171717; /* neutral-900 */
}

/* 玻璃效果增强 */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* 选择文本样式 */
::selection {
  background-color: rgba(99, 102, 241, 0.3);
  color: white;
}

/* 平滑过渡 */
* {
  transition: color 0.2s ease, background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
