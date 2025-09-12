import { createApp } from "vue";
import Toast from "../components/Toast.vue";

/**
 * Toast 管理器
 * 用于全局管理轻提示的显示和隐藏
 */
class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
  }

  /**
   * 初始化容器
   */
  initContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  /**
   * 显示提示
   * @param {Object} options - 提示选项
   * @param {string} options.message - 提示消息
   * @param {string} options.description - 提示描述
   * @param {string} options.type - 提示类型 (success, error, info, warning)
   * @param {number} options.duration - 显示时长
   * @param {boolean} options.autoClose - 是否自动关闭
   */
  show(options) {
    this.initContainer();

    const toastId = Date.now() + Math.random();
    const toastElement = document.createElement("div");
    toastElement.id = `toast-${toastId}`;
    this.container.appendChild(toastElement);

    const app = createApp(Toast, {
      ...options,
      onClose: () => {
        this.remove(toastId, app, toastElement);
      },
    });

    app.mount(toastElement);

    this.toasts.push({
      id: toastId,
      app,
      element: toastElement,
    });

    return toastId;
  }

  /**
   * 移除提示
   * @param {number} toastId - 提示ID
   * @param {Object} app - Vue应用实例
   * @param {HTMLElement} element - DOM元素
   */
  remove(toastId, app, element) {
    const index = this.toasts.findIndex((toast) => toast.id === toastId);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }

    if (app) {
      app.unmount();
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  /**
   * 成功提示
   * @param {string} message - 提示消息
   * @param {string} description - 提示描述
   * @param {Object} options - 其他选项
   */
  success(message, description = "", options = {}) {
    return this.show({
      message,
      description,
      type: "success",
      ...options,
    });
  }

  /**
   * 错误提示
   * @param {string} message - 提示消息
   * @param {string} description - 提示描述
   * @param {Object} options - 其他选项
   */
  error(message, description = "", options = {}) {
    return this.show({
      message,
      description,
      type: "error",
      duration: 5000, // 错误提示显示更长时间
      ...options,
    });
  }

  /**
   * 信息提示
   * @param {string} message - 提示消息
   * @param {string} description - 提示描述
   * @param {Object} options - 其他选项
   */
  info(message, description = "", options = {}) {
    return this.show({
      message,
      description,
      type: "info",
      ...options,
    });
  }

  /**
   * 警告提示
   * @param {string} message - 提示消息
   * @param {string} description - 提示描述
   * @param {Object} options - 其他选项
   */
  warning(message, description = "", options = {}) {
    return this.show({
      message,
      description,
      type: "warning",
      duration: 4000,
      ...options,
    });
  }

  /**
   * 清除所有提示
   */
  clear() {
    this.toasts.forEach((toast) => {
      this.remove(toast.id, toast.app, toast.element);
    });
    this.toasts = [];
  }
}

// 创建全局实例
const toast = new ToastManager();

export default toast;

// 便捷方法
export const showToast = toast.show.bind(toast);
export const successToast = toast.success.bind(toast);
export const errorToast = toast.error.bind(toast);
export const infoToast = toast.info.bind(toast);
export const warningToast = toast.warning.bind(toast);
export const clearToasts = toast.clear.bind(toast);
