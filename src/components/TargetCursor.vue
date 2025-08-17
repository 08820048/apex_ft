<template>
  <div class="target-cursor-container">
    <!-- 扫描框外框 - 自动瞄准时隐藏 -->
    <div
      ref="scannerFrame"
      class="scanner-frame"
      :style="frameStyle"
      :class="{ hidden: isAutoTargeting }"
    >
      <!-- 四个角的边框 -->
      <div class="scanner-corner scanner-tl"></div>
      <div class="scanner-corner scanner-tr"></div>
      <div class="scanner-corner scanner-bl"></div>
      <div class="scanner-corner scanner-br"></div>

      <!-- 中心黑点 -->
      <div class="scanner-center"></div>
    </div>

    <!-- 瞄准选中框 - 使用扫描框样式 -->
    <div
      ref="targetBox"
      class="target-selection-box"
      :style="targetBoxStyle"
      :class="{ active: isAutoTargeting }"
    >
      <!-- 四个角的边框 - 和扫描框相同 -->
      <div class="target-corner target-tl"></div>
      <div class="target-corner target-tr"></div>
      <div class="target-corner target-bl"></div>
      <div class="target-corner target-br"></div>

      <!-- 中心黑点 -->
      <div class="target-center"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 响应式数据
const mouseX = ref(0);
const mouseY = ref(0);
const isHovering = ref(false);
const isAutoTargeting = ref(false); // 是否正在自动瞄准

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

  // 检查当前鼠标下的最具体可交互元素
  const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
  const targetElement = findMostSpecificInteractiveElement(elementUnderMouse);

  // 如果找到了新的目标元素，且与当前悬停元素不同
  if (targetElement && targetElement !== hoveredElement.value) {
    if (isHovering.value) {
      // 切换到新元素
      handleMouseLeave(e);
      setTimeout(() => {
        handleMouseEnter({ target: targetElement });
      }, 30);
    } else {
      // 开始悬停新元素
      handleMouseEnter({ target: targetElement });
    }
  } else if (!targetElement && isHovering.value) {
    // 如果没有找到可交互元素，清除悬停状态
    handleMouseLeave(e);
  }

  // 更新位置
  updateCursorPosition();
};

// 鼠标进入可交互元素
const handleMouseEnter = (e) => {
  isHovering.value = true;
  hoveredElement.value = e.target;

  // 启动自动瞄准
  startAutoTargeting(e.target);
  updateCursorState();
};

// 鼠标离开可交互元素
const handleMouseLeave = () => {
  isHovering.value = false;
  hoveredElement.value = null;

  // 停止自动瞄准
  stopAutoTargeting();
  updateCursorState();
};

// 启动自动瞄准
const startAutoTargeting = (element) => {
  isAutoTargeting.value = true;

  // 获取元素的位置和尺寸
  const rect = element.getBoundingClientRect();
  const padding = 5; // 添加一些内边距

  // 更新选中框到元素位置
  targetBoxStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top + rect.height / 2}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
    transform: "translate(-50%, -50%)",
    opacity: 1,
  };
};

// 停止自动瞄准
const stopAutoTargeting = () => {
  isAutoTargeting.value = false;

  // 重置选中框
  targetBoxStyle.value = {
    transform: "translate(-50%, -50%)",
    opacity: 0,
    width: "0px",
    height: "0px",
  };
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
  // 如果正在自动瞄准，不需要手动更新
  if (isAutoTargeting.value) {
    return;
  }

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

// 可交互元素选择器 - 恢复对所有页面的支持
const interactiveSelectors = [
  "a",
  "button",
  '[role="button"]',
  "input",
  "textarea",
  "select",
  ".pull-ring",
  ".article-card",
  ".category-card",
  ".tag-item",
  ".friend-link",
  ".portfolio-item",
  ".glass-effect",
  ".card-hover",
  ".article-meta",
  ".breadcrumb-item",
  ".pagination-item",
  ".back-to-top",
  ".social-link",
  ".subscribe-form",
  ".comment-item",
  ".nav-link",
  ".logo-text",
  ".theme-toggle",
  ".mobile-menu-button",
  ".search-button",
  ".article-content img",
  ".article-content pre",
  ".article-content blockquote",
  ".article-content table",
];

// 检查元素是否匹配可交互选择器
const isInteractiveElement = (element) => {
  // 特殊处理：排除 header 容器本身
  if (
    element.tagName?.toLowerCase() === "header" &&
    element.classList?.contains("app-header")
  ) {
    return false;
  }

  // 排除其他明显的容器元素
  if (
    element.tagName?.toLowerCase() === "main" ||
    element.tagName?.toLowerCase() === "section" ||
    (element.tagName?.toLowerCase() === "div" &&
      element.classList?.contains("max-w-7xl"))
  ) {
    return false;
  }

  return interactiveSelectors.some((selector) => {
    try {
      return element.matches && element.matches(selector);
    } catch (e) {
      return false;
    }
  });
};

// 计算元素的优先级分数（分数越高越具体）
const getElementSpecificityScore = (element) => {
  let score = 0;

  // 基础标签优先级
  const tagName = element.tagName?.toLowerCase();
  if (["button", "a", "input"].includes(tagName)) {
    score += 100; // 原生交互元素优先级最高
  } else if (["span", "div"].includes(tagName)) {
    score += 10; // 通用容器元素优先级较低
  } else {
    score += 50; // 其他元素中等优先级
  }

  // 类名优先级
  const classList = Array.from(element.classList || []);
  if (classList.includes("nav-link") || classList.includes("logo-text")) {
    score += 80; // 导航元素高优先级
  }
  if (classList.includes("tag-item") || classList.includes("breadcrumb-item")) {
    score += 70; // 小型交互元素高优先级
  }
  if (
    classList.includes("article-card") ||
    classList.includes("category-card")
  ) {
    score += 60; // 卡片元素中等优先级
  }
  if (classList.includes("glass-effect") || classList.includes("card-hover")) {
    score += 20; // 通用样式类优先级较低
  }

  // 尺寸因子（越小越具体）
  const rect = element.getBoundingClientRect();
  const area = rect.width * rect.height;
  if (area < 10000) {
    // 小于100x100的元素
    score += 30;
  } else if (area > 100000) {
    // 大于300x300的元素
    score -= 20;
  }

  return score;
};

// 找到最具体的可交互元素
const findMostSpecificInteractiveElement = (element) => {
  const candidates = [];
  let current = element;

  // 向上遍历DOM树，收集所有可交互的祖先元素
  while (current && current !== document.body) {
    if (isInteractiveElement(current)) {
      candidates.push(current);
    }
    current = current.parentElement;
  }

  // 如果没有找到候选元素，返回null
  if (candidates.length === 0) {
    return null;
  }

  // 根据优先级分数选择最合适的元素
  let bestElement = candidates[0];
  let bestScore = getElementSpecificityScore(bestElement);

  for (let i = 1; i < candidates.length; i++) {
    const score = getElementSpecificityScore(candidates[i]);
    if (score > bestScore) {
      bestElement = candidates[i];
      bestScore = score;
    }
  }

  return bestElement;
};

// 使用事件委托处理鼠标进入
const handleDocumentMouseOver = (e) => {
  const targetElement = findMostSpecificInteractiveElement(e.target);

  if (targetElement && targetElement !== hoveredElement.value) {
    if (!isHovering.value) {
      handleMouseEnter({ target: targetElement });
    } else {
      // 如果已经在悬停状态，但目标元素不同，切换到新元素
      handleMouseLeave(e);
      setTimeout(() => {
        handleMouseEnter({ target: targetElement });
      }, 50);
    }
  }
};

// 使用事件委托处理鼠标离开
const handleDocumentMouseOut = (e) => {
  if (isHovering.value && hoveredElement.value) {
    // 检查鼠标是否真的离开了当前悬停的元素
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !hoveredElement.value.contains(relatedTarget)) {
      handleMouseLeave(e);
    }
  }
};

// 添加事件监听器
const addEventListeners = () => {
  document.addEventListener("mousemove", handleMouseMove);

  // 使用事件委托，监听整个文档的鼠标事件
  document.addEventListener("mouseover", handleDocumentMouseOver);
  document.addEventListener("mouseout", handleDocumentMouseOut);
};

// 移除事件监听器
const removeEventListeners = () => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseover", handleDocumentMouseOver);
  document.removeEventListener("mouseout", handleDocumentMouseOut);
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

/* 隐藏扫描框 */
.scanner-frame.hidden {
  opacity: 0;
  pointer-events: none;
}

/* 扫描框四个角 */
.scanner-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  background: transparent;
}

.scanner-tl {
  top: -2px;
  left: -2px;
}

.scanner-tl::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-tl::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-tr {
  top: -2px;
  right: -2px;
}

.scanner-tr::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-tr::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-bl {
  bottom: -2px;
  left: -2px;
}

.scanner-bl::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-bl::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-br {
  bottom: -2px;
  right: -2px;
}

.scanner-br::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.scanner-br::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
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

/* 瞄准选中框 - 使用扫描框样式 */
.target-selection-box {
  position: fixed;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

/* 目标框四个角 - 复制扫描框样式 */
.target-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  background: transparent;
}

.target-tl {
  top: -6px;
  left: -6px;
}

.target-tl::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.target-tl::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.target-tr {
  top: -6px;
  right: -6px;
}

.target-tr::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.target-tr::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.target-bl {
  bottom: -6px;
  left: -6px;
}

.target-bl::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.target-bl::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

.target-br {
  bottom: -6px;
  right: -6px;
}

.target-br::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 2px;
  background: rgba(0, 0, 0, 0.9);
}

.target-br::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2px;
  height: 12px;
  background: rgba(0, 0, 0, 0.9);
}

/* 目标框中心黑点 - 复制扫描框样式 */
.target-center {
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

/* 激活状态 */
.target-selection-box.active {
  animation: selectionPulse 1.5s ease-in-out infinite;
}

/* 目标框激活状态 */
.target-selection-box.active .target-corner::before,
.target-selection-box.active .target-corner::after {
  background: rgba(0, 0, 0, 1);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
}

.target-selection-box.active .target-center {
  background: rgba(0, 0, 0, 1);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}

/* 亮色模式适配 */
html.light .scanner-corner::before,
html.light .scanner-corner::after {
  background: rgba(0, 0, 0, 0.9);
}

html.light .scanner-center {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}

/* 亮色模式下的目标框样式 */
html.light .target-corner::before,
html.light .target-corner::after {
  background: rgba(0, 0, 0, 0.9);
}

html.light .target-center {
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
