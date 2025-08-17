<template>
  <div class="target-cursor-container">
    <!-- 扫描框外框 -->
    <div ref="scannerFrame" class="scanner-frame" :style="frameStyle">
      <!-- 四个角的边框 -->
      <div class="scanner-corner scanner-tl"></div>
      <div class="scanner-corner scanner-tr"></div>
      <div class="scanner-corner scanner-bl"></div>
      <div class="scanner-corner scanner-br"></div>

      <!-- 中心黑点 -->
      <div class="scanner-center"></div>
    </div>

    <!-- 瞄准选中框 -->
    <div
      ref="targetBox"
      class="target-selection-box"
      :style="targetBoxStyle"
      :class="{ active: isHovering }"
    >
      <div class="selection-corner selection-tl"></div>
      <div class="selection-corner selection-tr"></div>
      <div class="selection-corner selection-bl"></div>
      <div class="selection-corner selection-br"></div>
      <div class="selection-border selection-top"></div>
      <div class="selection-border selection-right"></div>
      <div class="selection-border selection-bottom"></div>
      <div class="selection-border selection-left"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 响应式数据
const mouseX = ref(0);
const mouseY = ref(0);
const isHovering = ref(false);

// DOM 引用
const scannerFrame = ref(null);
const targetBox = ref(null);

// 当前悬停的元素
const hoveredElement = ref(null);

// 扫描动画角度（保留以避免错误）
const scanAngle = ref(0);

// 计算样式
const frameStyle = ref({
  transform: "translate(-50%, -50%)",
  opacity: 0,
});

const targetBoxStyle = ref({
  transform: "translate(-50%, -50%)",
  opacity: 0,
  width: "0px",
  height: "0px",
});

// 鼠标移动处理
const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;

  // 更新位置
  updateCursorPosition();
};

// 鼠标进入可交互元素
const handleMouseEnter = (e) => {
  isHovering.value = true;
  hoveredElement.value = e.target;
  updateCursorState();
};

// 鼠标离开可交互元素
const handleMouseLeave = () => {
  isHovering.value = false;
  hoveredElement.value = null;
  updateCursorState();
};

// 更新扫描框位置和缩放
const updateFramePosition = () => {
  const x = mouseX.value;
  const y = mouseY.value;
  const opacity = isHovering.value ? 0.8 : 1;

  frameStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
    opacity: opacity,
    // 通过 CSS 类来控制不同的动画状态
  };

  // 动态切换动画
  if (scannerFrame.value && scannerFrame.value.style) {
    try {
      if (isHovering.value) {
        scannerFrame.value.style.animation =
          "continuousRotateHover 6s linear infinite";
      } else {
        scannerFrame.value.style.animation =
          "continuousRotate 6s linear infinite";
      }
    } catch (error) {
      console.warn("Animation update failed:", error);
    }
  }
};

// 更新光标位置
const updateCursorPosition = () => {
  // 更新选中框
  updateTargetBox();
  // 更新扫描框位置
  updateFramePosition();
};

// 更新选中框
const updateTargetBox = () => {
  if (isHovering.value && hoveredElement.value) {
    const rect = hoveredElement.value.getBoundingClientRect();
    const padding = 10;

    targetBoxStyle.value = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      transform: "translate(-50%, -50%)",
      opacity: 1,
    };
  } else {
    targetBoxStyle.value = {
      ...targetBoxStyle.value,
      opacity: 0,
      width: "0px",
      height: "0px",
    };
  }
};

// 更新光标状态
const updateCursorState = () => {
  updateTargetBox();
  updateFramePosition();
};

// 添加事件监听器
const addEventListeners = () => {
  document.addEventListener("mousemove", handleMouseMove);

  // 为可交互元素添加悬停效果
  const interactiveElements = document.querySelectorAll(
    'a, button, [role="button"], input, textarea, select, .pull-ring'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
  });
};

// 移除事件监听器
const removeEventListeners = () => {
  document.removeEventListener("mousemove", handleMouseMove);

  const interactiveElements = document.querySelectorAll(
    'a, button, [role="button"], input, textarea, select'
  );
  interactiveElements.forEach((el) => {
    el.removeEventListener("mouseenter", handleMouseEnter);
    el.removeEventListener("mouseleave", handleMouseLeave);
  });
};

onMounted(() => {
  addEventListeners();
  // 隐藏默认光标
  document.body.style.cursor = "none";

  // 确保初始动画状态
  setTimeout(() => {
    if (scannerFrame.value) {
      scannerFrame.value.style.animation =
        "continuousRotate 6s linear infinite";
    }
  }, 100);
});

onUnmounted(() => {
  removeEventListeners();
  // 恢复默认光标
  document.body.style.cursor = "auto";
});
</script>

<style scoped>
.target-cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

/* 扫描框 */
.scanner-frame {
  position: fixed;
  width: 40px;
  height: 40px;
  transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: continuousRotate 6s linear infinite;
}

/* 扫描框四个角 */
.scanner-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 0, 0, 0.9);
}

.scanner-tl {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.scanner-tr {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.scanner-bl {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.scanner-br {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* 中心黑点 */
.scanner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

/* 瞄准选中框 */
.target-selection-box {
  position: fixed;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

/* 选中框角落 */
.selection-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 255, 150, 0.8);
}

.selection-tl {
  top: -6px;
  left: -6px;
  border-right: none;
  border-bottom: none;
}

.selection-tr {
  top: -6px;
  right: -6px;
  border-left: none;
  border-bottom: none;
}

.selection-bl {
  bottom: -6px;
  left: -6px;
  border-right: none;
  border-top: none;
}

.selection-br {
  bottom: -6px;
  right: -6px;
  border-left: none;
  border-top: none;
}

/* 选中框边框 */
.selection-border {
  position: absolute;
  background: rgba(0, 255, 150, 0.3);
}

.selection-top {
  top: -1px;
  left: 12px;
  right: 12px;
  height: 2px;
}

.selection-bottom {
  bottom: -1px;
  left: 12px;
  right: 12px;
  height: 2px;
}

.selection-left {
  left: -1px;
  top: 12px;
  bottom: 12px;
  width: 2px;
}

.selection-right {
  right: -1px;
  top: 12px;
  bottom: 12px;
  width: 2px;
}

/* 激活状态 */
.target-selection-box.active {
  animation: selectionPulse 1.5s ease-in-out infinite;
}

.target-selection-box.active .selection-corner {
  border-color: rgba(0, 255, 150, 1);
  box-shadow: 0 0 8px rgba(0, 255, 150, 0.5);
}

.target-selection-box.active .selection-border {
  background: rgba(0, 255, 150, 0.5);
}

/* 亮色模式适配 */
html.light .scanner-corner {
  border-color: rgba(0, 0, 0, 0.9);
}

html.light .scanner-center {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

/* 动画效果 */
@keyframes selectionPulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* 持续顺时针旋转动画 */
@keyframes continuousRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 悬停时的缩放旋转动画 */
@keyframes continuousRotateHover {
  0% {
    transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(0.7) rotate(360deg);
  }
}
</style>
