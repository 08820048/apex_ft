<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">好物推荐</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          发现并分享实用的好资源，让生活和工作更高效
        </p>
      </div>

      <!-- 头部操作区 -->
      <div class="mb-8">
        <!-- 搜索和筛选 -->
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <div class="flex-1">
              <input
                v-model="filters.keyword"
                type="text"
                placeholder="搜索好物..."
                @input="filterGoods"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="min-w-[150px]">
              <select
                v-model="filters.category"
                @change="filterGoods"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部分类</option>
                <option value="工具">工具</option>
                <option value="网站">网站</option>
                <option value="软件">软件</option>
                <option value="书籍">书籍</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <button 
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="resetFilters"
            >
              重置
            </button>
          </div>
          
          <button
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            @click="showForm = true"
          >
            <PlusIcon class="w-5 h-5" />
            推荐好物
          </button>
        </div>
      </div>

      <!-- 好物列表 -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">推荐列表</h2>
        <div v-if="goodsList.length === 0" class="text-center py-12">
          <div class="glass-effect rounded-2xl p-8 border-2 border-black">
            <p class="text-gray-500 text-lg">暂无推荐，快来提交第一个好物吧！</p>
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="good in goodsList"
            :key="good.id"
            class="glass-effect rounded-2xl overflow-hidden card-hover border-2 border-black"
          >
            <div class="h-48 relative">
              <img
                :src="good.coverImage || 'https://images.waer.ltd/images/202509120056122310.png'"
                :alt="good.name"
                class="w-full h-full object-cover rounded-t-lg"
                @error="handleImageError"
              />
              <div
                v-if="good.category"
                class="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded"
              >
                {{ good.category }}
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ good.name }}
              </h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ good.description }}
              </p>
              
              <!-- 标签显示 -->
              <div v-if="good.tags" class="mb-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in good.tags.split(',')"
                    :key="tag.trim()"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ tag.trim() }}
                  </span>
                </div>
              </div>
              
              <!-- 推荐者信息 -->
              <div v-if="good.submitterName" class="mb-3">
                <div class="flex items-center text-xs text-gray-500">
                  <LocationIcon class="w-3 h-3 mr-1" />
                  <span>推荐者: {{ good.submitterName }}</span>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">{{ formatDate(good.createdAt) }}</span>
                <a
                  :href="good.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  访问资源
                  <ExternalLinkIcon class="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多按钮 -->
        <div v-if="pagination.hasNext" class="text-center mt-8">
          <button
            @click="loadMore"
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
        
        <!-- 没有更多数据提示 -->
        <div v-else-if="goodsList.length > 0" class="text-center mt-8 text-gray-500">
          没有更多数据了
        </div>
      </div>
    </div>

    <!-- 浮动添加按钮 -->
    <button
      @click="showForm = true"
      class="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
      title="添加好物"
    >
      <PlusIcon class="w-6 h-6" />
    </button>

    <!-- 弹出表单遮罩 -->
    <Transition name="modal">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeForm"
      >
        <!-- 表单容器 -->
        <div
          class="glass-effect rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-black"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">推荐好物</h2>
            <button
              @click="closeForm"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <CloseIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="submitGood">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >资源名称 *</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入资源名称"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >链接 *</label
                >
                <input
                  v-model="form.link"
                  type="url"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入资源链接"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >图片链接</label
                >
                <input
                  v-model="form.image"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入图片链接（可选）"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >分类</label
                >
                <select
                  v-model="form.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择分类</option>
                  <option value="工具">工具</option>
                  <option value="网站">网站</option>
                  <option value="软件">软件</option>
                  <option value="书籍">书籍</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >描述 *</label
                >
                <textarea
                  v-model="form.description"
                  required
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请简要描述这个资源的特点和用途"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >您的姓名 *</label
                >
                <input
                  v-model="form.submitterName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >您的邮箱 *</label
                >
                <input
                  v-model="form.submitterEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >标签</label
                >
                <input
                  v-model="form.tags"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入标签，用逗号分隔"
                />
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeForm"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                提交推荐
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { successToast, errorToast, warningToast } from '../utils/toast.js'

import goodsService from '../api/goods.js'

// 图标组件
const ExternalLinkIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>`,
};

// 加号图标组件
const PlusIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>`,
};

// 关闭图标组件
const CloseIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>`,
};

// 位置图标组件
const LocationIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
};

// 表单数据
const form = ref({
  name: "",
  link: "",
  image: "",
  category: "",
  description: "",
  submitterEmail: "",
  submitterName: "",
  tags: ""
});

// 好物列表
const goodsList = ref([]);

// 分页信息
const pagination = ref({
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
});

// 筛选条件
const filters = ref({
  category: '',
  keyword: '',
  featured: false
});

// 分类列表
const categories = ref([]);

// 加载状态
const loading = ref(false);

// 表单显示状态
const showForm = ref(false);

// 位置信息状态
const locationInfo = ref({
  ip: '',
  city: '',
  region: '',
  country: ''
});

/**
 * 关闭表单弹窗
 */
const closeForm = () => {
  showForm.value = false;
};

/**
 * 获取用户IP地址和位置信息
 */
const getUserLocation = async () => {
  try {
    // 使用免费的IP地理位置API服务
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    locationInfo.value = {
      ip: data.ip || '',
      city: data.city || '',
      region: data.region || '',
      country: data.country_name || ''
    };
    
    return locationInfo.value;
  } catch (error) {
    console.warn('获取位置信息失败:', error);
    // 如果获取失败，尝试备用API
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      locationInfo.value.ip = data.ip || '';
      return locationInfo.value;
    } catch (backupError) {
      console.warn('获取IP地址失败:', backupError);
      return locationInfo.value;
    }
  }
};

/**
 * 格式化位置信息显示文本
 */
const formatLocationText = (location) => {
  if (!location) return '未知地区';
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.region && location.region !== location.city) parts.push(location.region);
  if (location.country && location.country !== location.region) parts.push(location.country);
  
  return parts.length > 0 ? parts.join(', ') : '未知地区';
};

/**
 * 处理图片加载错误
 * @param {Event} event - 错误事件
 */
const handleImageError = (event) => {
  // 替换为默认封面
  event.target.src = 'https://images.waer.ltd/images/202509120056122310.png';
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

/**
 * 提交好物推荐
 */
const submitGood = async () => {
  if (!form.value.name || !form.value.link || !form.value.description) {
    warningToast('请填写完整信息', '名称、链接和描述为必填项');
    return;
  }

  if (!form.value.submitterEmail || !form.value.submitterName) {
    warningToast('请填写提交者信息', '邮箱和姓名为必填项');
    return;
  }

  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name,
      link: form.value.link,
      description: form.value.description,
      submitterEmail: form.value.submitterEmail,
      submitterName: form.value.submitterName,
      category: form.value.category || '其他',
      tags: form.value.tags || '',
      coverImage: form.value.image || ''
    };

    // 调用后端API提交
    await goodsService.submitGood(submitData);

    // 重置表单
    form.value = {
      name: "",
      link: "",
      image: "",
      category: "",
      description: "",
      submitterEmail: "",
      submitterName: "",
      tags: ""
    };

    // 关闭表单
    showForm.value = false;

    successToast('提交成功！', '您的好物推荐已提交，请等待审核');
    
    // 刷新列表（可能不会立即显示，因为需要审核）
    // loadGoodsList(true);
  } catch (error) {
    console.error('提交失败:', error);
    if (error.message.includes('429')) {
      errorToast('提交过于频繁', '请稍后再试');
    } else {
      errorToast('提交失败', error.message || '网络错误或服务异常，请稍后重试');
    }
  }
};

/**
 * 获取好物列表
 * @param {boolean} reset - 是否重置分页
 */
const loadGoodsList = async (reset = false) => {
  try {
    loading.value = true;
    
    if (reset) {
      pagination.value.page = 0;
    }
    
    const params = {
      page: pagination.value.page,
      size: pagination.value.size,
      ...filters.value
    };
    
    // 移除空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    
    const response = await goodsService.getGoodsList(params);
    
    if (reset) {
      goodsList.value = response.content || [];
    } else {
      goodsList.value.push(...(response.content || []));
    }
    
    // 更新分页信息
    pagination.value = {
      page: response.page || 0,
      size: response.size || 20,
      totalElements: response.totalElements || 0,
      totalPages: response.totalPages || 0,
      hasNext: response.hasNext || false,
      hasPrevious: response.hasPrevious || false
    };
    
  } catch (error) {
    console.error('获取好物列表失败:', error);
    errorToast('加载失败', '获取好物列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 获取分类列表
 */
const loadCategories = async () => {
  try {
    const response = await goodsService.getCategories();
    categories.value = response || [];
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

/**
 * 加载更多数据
 */
const loadMore = () => {
  if (pagination.value.hasNext && !loading.value) {
    pagination.value.page += 1;
    loadGoodsList(false);
  }
};

/**
 * 筛选好物
 */
const filterGoods = () => {
  loadGoodsList(true);
};

/**
 * 重置筛选条件
 */
const resetFilters = () => {
  filters.value = {
    category: '',
    keyword: '',
    featured: false
  };
  loadGoodsList(true);
};

// 组件挂载时加载数据
onMounted(() => {
  loadCategories();
  loadGoodsList(true);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-effect,
.modal-leave-active .glass-effect {
  transition: transform 0.3s ease;
}

.modal-enter-from .glass-effect,
.modal-leave-to .glass-effect {
  transform: scale(0.9) translateY(20px);
}
</style>
