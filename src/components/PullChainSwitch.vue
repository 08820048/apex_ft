<template>
  <div class="pull-chain-container" @click="handlePull">
    <!-- 拉线绳子 -->
    <div class="chain-line" :class="{ 'chain-pulled': isPulling }"></div>

    <!-- 拉环 -->
    <div
      class="pull-ring"
      :class="{
        'ring-pulled': isPulling,
        'ring-light': !isDark,
        'ring-dark': isDark,
      }"
      @mousedown="startPull"
      @mouseup="endPull"
      @mouseleave="endPull"
    >
      <!-- 拉环内部文字 -->
      <div class="ring-text">
        <!-- 亮色模式显示"昼" -->
        <span v-if="!isDark">昼</span>
        <!-- 暗色模式显示"夜" -->
        <span v-else>夜</span>
      </div>
    </div>

    <!-- 拉线效果粒子 -->
    <div v-if="isPulling" class="pull-particles">
      <div
        v-for="i in 6"
        :key="i"
        class="particle"
        :style="{ animationDelay: `${i * 0.1}s` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
const isPulling = ref(false);

const startPull = () => {
  isPulling.value = true;
};

const endPull = () => {
  setTimeout(() => {
    isPulling.value = false;
  }, 300);
};

const handlePull = () => {
  startPull();
  toggleTheme();
  endPull();
};
</script>

<style scoped>
.pull-chain-container {
  position: relative;
  width: 40px;
  height: 40px; /* 保持与其他元素对齐 */
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* 内容对齐到底部，拉线从底部开始 */
  margin-left: 12px;
  overflow: visible; /* 允许拉线超出容器 */
  z-index: 100; /* 确保拉线在最上层 */
}

/* 拉线绳子 - 从header底部开始向下延伸 */
.chain-line {
  width: 3px;
  height: 120px; /* 向下延伸的长拉线 */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9) 0%,
    /* 顶部明亮 */ rgba(255, 255, 255, 0.8) 25%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.6) 75%,
    rgba(255, 255, 255, 0.5) 100% /* 底部稍微透明 */
  );
  border-radius: 1.5px;
  position: absolute;
  top: 0px; /* 从容器顶部开始，正好在header底部边缘 */
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
  z-index: 101; /* 确保在最上层 */
  animation: gentleSwing 4s ease-in-out infinite; /* 左右摆动 */
}

/* 拉线连接点 - 在header底部的小圆点 */
.chain-line::after {
  content: "";
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

.chain-line::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.5) 100%
  );
  border-radius: 0.5px;
}

/* 拉线被拉动时的效果 - 向下延长 */
.chain-pulled {
  height: 150px !important; /* 拉动时进一步延长 */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    /* 顶部更亮 */ rgba(255, 255, 255, 0.9) 20%,
    rgba(255, 255, 255, 0.8) 40%,
    rgba(255, 255, 255, 0.7) 60%,
    rgba(255, 255, 255, 0.6) 80%,
    rgba(255, 255, 255, 0.5) 100% /* 底部保持透明 */
  );
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  animation: strongSwing 2s ease-in-out infinite; /* 拉动时强烈摆动 */
}

/* 拉环 - 正方形方块风格 */
.pull-ring {
  width: 32px;
  height: 32px;
  border-radius: 0; /* 无弧度的正方形 */
  border: 2px solid #6c757d;
  background: linear-gradient(
    135deg,
    #495057 0%,
    /* 中灰 */ #6c757d 30%,
    /* 浅灰 */ #adb5bd 60%,
    /* 更浅灰 */ #dee2e6 100% /* 浅白灰 */
  );
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  top: 118px; /* 紧贴拉线末端（120px - 2px重叠） */
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  animation: gentleRingSwing 4s ease-in-out infinite; /* 拉环跟随拉线摆动 */
}

.pull-ring:hover {
  border-color: #495057;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.25);
  animation: gentleRingSwing 3.5s ease-in-out infinite; /* 悬停时稍快摆动 */
}

/* 拉环被拉动时 */
.ring-pulled {
  top: 148px !important; /* 紧贴拉动后的拉线末端（150px - 2px重叠） */
  border-color: #343a40 !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.3) !important;
  animation: gentleRingSwing 3s ease-in-out infinite !important; /* 拉动时快速摆动 */
}

/* 亮色模式拉环 - 白色方块（代表白天） */
.ring-light {
  border-color: #bdc3c7;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    /* 纯白 */ #f8f9fa 30%,
    /* 浅灰白 */ #e9ecef 60%,
    /* 浅灰 */ #dee2e6 100% /* 灰白 */
  );
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.ring-light:hover {
  border-color: #95a5a6;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2), 0 0 25px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

/* 暗色模式拉环 - 黑色方块（代表夜晚） */
.ring-dark {
  border-color: #495057;
  background: linear-gradient(
    135deg,
    #212529 0%,
    /* 深黑 */ #343a40 30%,
    /* 深灰 */ #495057 60%,
    /* 灰色 */ #6c757d 100% /* 浅灰 */
  );
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* 拉环文字 */
.ring-text {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  user-select: none;
}

.ring-light .ring-text {
  color: #212529;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.ring-dark .ring-text {
  color: #f8f9fa;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
}

/* 拉线效果粒子 */
.pull-particles {
  position: absolute;
  top: 148px; /* 跟随拉环位置 */
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: particleFloat 0.6s ease-out forwards;
}

.particle:nth-child(1) {
  --random-x: -10px;
}
.particle:nth-child(2) {
  --random-x: 10px;
}
.particle:nth-child(3) {
  --random-x: -5px;
}
.particle:nth-child(4) {
  --random-x: 5px;
}
.particle:nth-child(5) {
  --random-x: -15px;
}
.particle:nth-child(6) {
  --random-x: 15px;
}

@keyframes particleFloat {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--random-x, 0), 20px) scale(0);
  }
}

/* 轻微左右摆动动画 */
@keyframes gentleSwing {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(1deg);
  }
  50% {
    transform: translateX(-50%) rotate(0deg);
  }
  75% {
    transform: translateX(-50%) rotate(-1deg);
  }
}

/* 拉环的左右摆动动画 - 跟随拉线 */
@keyframes gentleRingSwing {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  25% {
    transform: translateX(calc(-50% + 2px)) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(0px);
  }
  75% {
    transform: translateX(calc(-50% - 2px)) translateY(0px);
  }
}

/* 拉动时的强烈摆动动画 */
@keyframes strongSwing {
  0%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(2deg);
  }
  50% {
    transform: translateX(-50%) rotate(0deg);
  }
  75% {
    transform: translateX(-50%) rotate(-2deg);
  }
}

/* 粒子样式已在上面定义 */

/* 亮色模式下的拉线 - 黑色配色 */
html.light .chain-line {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    /* 顶部深色 */ rgba(0, 0, 0, 0.7) 25%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.5) 75%,
    rgba(0, 0, 0, 0.4) 100% /* 底部稍微透明 */
  );
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

html.light .chain-line::before {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.2) 100%
  );
}

/* 亮色模式下的连接点 */
html.light .chain-line::after {
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

html.light .chain-pulled {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9) 0%,
    /* 顶部更深 */ rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0.7) 40%,
    rgba(0, 0, 0, 0.6) 60%,
    rgba(0, 0, 0, 0.5) 80%,
    rgba(0, 0, 0, 0.4) 100% /* 底部透明 */
  ) !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4) !important;
}

/* 亮色模式下的粒子颜色 */
html.light .pull-particles .particle {
  background: rgba(0, 0, 0, 0.6);
}
</style>
