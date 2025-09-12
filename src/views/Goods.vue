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
                placeholder="搜索好物名称、描述或标签..."
                @input="debounceSearch"
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
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
              <input
                id="featured-filter"
                v-model="filters.featured"
                type="checkbox"
                @change="filterGoods"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="featured-filter" class="text-sm text-gray-700 whitespace-nowrap">
                仅精选
              </label>
            </div>
            <button 
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="resetFilters"
            >
              重置
            </button>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <button
                 class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                 @click="openAddForm"
               >
                <PlusIcon class="w-5 h-5" />
                推荐好物
              </button>
            </div>
          </div>
        </div>
      </div>



      <!-- 好物列表 -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">推荐列表</h2>
          <div v-if="pagination.totalElements > 0" class="text-sm text-gray-500">
            共 {{ pagination.totalElements }} 个好物
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading && goodsList.length === 0" class="text-center py-12">
          <div class="glass-effect rounded-2xl p-8 border-2 border-black">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-500 text-lg">正在加载好物列表...</p>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="goodsList.length === 0 && !loading" class="text-center py-12">
          <div class="glass-effect rounded-2xl p-8 border-2 border-black">
            <div class="text-6xl mb-4">🎁</div>
            <p class="text-gray-500 text-lg mb-4">
              {{ filters.keyword || filters.category || filters.featured ? '没有找到符合条件的好物' : '暂无推荐，快来提交第一个好物吧！' }}
            </p>
            <button
              v-if="filters.keyword || filters.category || filters.featured"
              @click="resetFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              清除筛选条件
            </button>
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="good in goodsList"
            :key="good.id"
            class="glass-effect rounded-2xl overflow-hidden card-hover border-2 border-black group relative"
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
                <div class="flex items-center">
                  <LocationIcon class="w-4 h-4 mr-2 text-purple-600" />
                  <span class="text-sm font-medium text-purple-700">
                    推荐者: <span class="text-purple-800 font-semibold">{{ good.submitterName }}</span>
                  </span>
                </div>
              </div>
              
              <!-- 操作按钮区域 - 悬停时显示 -->
              <div class="flex gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
                <button
                  @click="editGood(good)"
                  class="flex-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                >
                  <EditIcon class="w-3 h-3" />
                  编辑
                </button>
                <button
                  @click="confirmDeleteGood(good)"
                  class="flex-1 px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                >
                  <DeleteIcon class="w-3 h-3" />
                  删除
                </button>
              </div>
              
              <div class="flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500">{{ formatDate(good.createdAt) }}</span>
                  <span class="text-xs text-gray-400">ID: {{ good.id }}</span>
                </div>
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
            <h2 class="text-2xl font-bold text-gray-900">{{ form.id ? '编辑好物' : '推荐好物' }}</h2>
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
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
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

    <!-- 邮箱验证模态框 -->
    <div v-if="showEmailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeEmailModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ emailModalType === 'edit' ? '验证邮箱以编辑' : '验证邮箱以删除' }}
          </h3>
          <p class="text-gray-600 text-sm">
            请输入您提交「{{ currentGood?.name }}」时使用的邮箱地址
          </p>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
          <input
            v-model="modalEmail"
            type="email"
            placeholder="请输入邮箱地址"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': emailError }"
            @input="emailError = ''"
            @keyup.enter="confirmEmailAction"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-2 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ emailError }}
          </p>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="closeEmailModal"
            class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            取消
          </button>
          <button
            @click="confirmEmailAction"
            :disabled="!modalEmail.trim()"
            class="flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors"
            :class="emailModalType === 'delete' ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'"
          >
            {{ emailModalType === 'edit' ? '确认编辑' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeDeleteConfirm">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            确认删除好物
          </h3>
          <p class="text-gray-600 text-sm mb-4">
            您确定要删除好物「<span class="font-medium text-gray-900">{{ deleteGoodData?.name }}</span>」吗？
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-red-700 text-sm flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              此操作不可恢复
            </p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="closeDeleteConfirm"
            class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.707 1.707A1 1 0 0117 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a1 1 0 01.293-.707L5 13.5V5zM8.5 7.5A.5.5 0 019 7h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5H9a.5.5 0 01-.5-.5v-6z" clip-rule="evenodd"></path>
            </svg>
            确认删除
          </button>
        </div>
      </div>
    </div>
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

// 编辑图标组件
const EditIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>`,
};

// 删除图标组件
const DeleteIcon = {
  template: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>`,
};

// 表单数据
const form = ref({
  id: null,
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

// 搜索防抖定时器
let searchTimer = null;

// 位置信息状态
const locationInfo = ref({
  ip: '',
  city: '',
  region: '',
  country: ''
});

// 移除全局用户邮箱状态，每次操作独立验证
const showEmailInput = ref(false);

// 邮箱验证模态框状态
const showEmailModal = ref(false);
const emailModalType = ref(''); // 'edit' 或 'delete'
const currentGood = ref(null);
const modalEmail = ref('');
const emailError = ref('');

// 删除确认对话框状态
const showDeleteConfirm = ref(false);
const deleteGoodData = ref(null);



/**
 * 关闭表单弹窗
 */
const closeForm = () => {
  showForm.value = false;
  // 重置表单ID，确保下次打开是新增模式
  if (form.value.id) {
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
  }
};

/**
 * 打开新增表单
 */
const openAddForm = () => {
  showForm.value = true;
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
  // 表单验证
  if (!form.value.name || form.value.name.length > 200) {
    warningToast('名称格式错误', '名称为必填项，且不能超过200个字符');
    return;
  }

  if (!form.value.link || form.value.link.length > 500) {
    warningToast('链接格式错误', '链接为必填项，且不能超过500个字符');
    return;
  }

  if (!form.value.description || form.value.description.length > 2000) {
    warningToast('描述格式错误', '描述为必填项，且不能超过2000个字符');
    return;
  }

  if (!form.value.submitterEmail) {
    warningToast('请填写邮箱', '邮箱为必填项');
    return;
  }

  if (!form.value.submitterName || form.value.submitterName.length > 50) {
    warningToast('姓名格式错误', '姓名为必填项，且不能超过50个字符');
    return;
  }

  if (form.value.category && form.value.category.length > 50) {
    warningToast('分类格式错误', '分类不能超过50个字符');
    return;
  }

  if (form.value.tags && form.value.tags.length > 200) {
    warningToast('标签格式错误', '标签不能超过200个字符');
    return;
  }

  if (form.value.image && form.value.image.length > 500) {
    warningToast('图片链接格式错误', '图片链接不能超过500个字符');
    return;
  }

  try {
    // 准备提交数据
    const submitData = {
      name: form.value.name.trim(),
      link: form.value.link.trim(),
      description: form.value.description.trim(),
      submitterEmail: form.value.submitterEmail.trim(),
      submitterName: form.value.submitterName.trim(),
      category: form.value.category ? form.value.category.trim() : '其他',
      tags: form.value.tags ? form.value.tags.trim() : '',
      coverImage: form.value.image ? form.value.image.trim() : ''
    };

    // 根据是否有ID判断是新增还是编辑
    let response;
    if (form.value.id) {
      // 编辑模式 - 通过邮箱验证
      const editData = {
        ...submitData,
        email: submitData.submitterEmail
      };
      response = await goodsService.updateGood(form.value.id, editData);
      successToast('更新成功！', '好物信息已成功更新，已重新提交审核。审核通过前，更新内容不会在前台显示。');
    } else {
      // 新增模式
      response = await goodsService.submitGood(submitData);
      successToast('提交成功！', '您的好物推荐已提交，请等待审核。审核结果将通过邮件通知您。');
    }

    // 重置表单
    form.value = {
      id: null,
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
    
    // 重新加载列表
    loadGoodsList(true);
    
  } catch (error) {
    console.error('提交失败:', error);
    
    // 根据错误类型提供具体的用户反馈
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 429:
          errorToast('提交过于频繁', '根据限流规则，请稍后再试。每分钟最多2次提交，每小时最多20次。');
          break;
        case 400:
          errorToast('提交数据有误', message || '请检查填写的信息是否正确');
          break;
        case 500:
          errorToast('服务器错误', '服务器暂时无法处理请求，请稍后重试');
          break;
        default:
          errorToast('提交失败', message || '网络错误，请检查网络连接后重试');
      }
    } else if (error.message.includes('429')) {
      errorToast('提交过于频繁', '请稍后再试');
    } else if (error.message.includes('Network')) {
      errorToast('网络错误', '请检查网络连接后重试');
    } else {
      errorToast('提交失败', error.message || '未知错误，请稍后重试');
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
      size: pagination.value.size
    };
    
    // 添加筛选参数
    if (filters.value.category) {
      params.category = filters.value.category;
    }
    if (filters.value.keyword && filters.value.keyword.trim()) {
      params.keyword = filters.value.keyword.trim();
    }
    if (filters.value.featured) {
      params.featured = filters.value.featured;
    }
    
    const response = await goodsService.getGoodsList(params);
    
    // 根据接口文档的响应格式处理数据
    if (response && response.data) {
      const data = response.data;
      
      if (reset) {
        goodsList.value = data.content || [];
      } else {
        goodsList.value.push(...(data.content || []));
      }
      
      // 更新分页信息
      pagination.value = {
        page: data.page || 0,
        size: data.size || 20,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        hasNext: data.hasNext || false,
        hasPrevious: data.hasPrevious || false,
        first: data.first || false,
        last: data.last || false
      };
    } else {
      // 兼容直接返回数据的情况
      if (reset) {
        goodsList.value = response.content || response || [];
      } else {
        goodsList.value.push(...(response.content || response || []));
      }
      
      // 更新分页信息
      pagination.value = {
        page: response.page || 0,
        size: response.size || 20,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false,
        first: response.first || false,
        last: response.last || false
      };
    }
    
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
    
    // 根据接口文档的响应格式处理数据
    if (response && response.data) {
      categories.value = response.data || [];
    } else {
      // 兼容直接返回数据的情况
      categories.value = response || [];
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    // 如果获取分类失败，使用默认分类
    categories.value = ['AI工具', '开发工具', '设计工具', '其他'];
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
 * 防抖搜索功能
 * @param {Event} event - 输入事件
 */
const debounceSearch = (event) => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  
  // 设置新的定时器，500ms后执行搜索
  searchTimer = setTimeout(() => {
    filterGoods();
  }, 500);
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

/**
 * 编辑好物
 * @param {Object} good - 要编辑的好物对象
 */
const editGood = (good) => {
  // 显示邮箱验证模态框
  openEmailModal(good, 'edit');
};

/**
 * 执行编辑操作（仅用于预填充表单）
 * @param {Object} good - 要编辑的好物对象
 * @param {string} email - 用户邮箱
 */
const performEdit = (good, email) => {
  // 预填充表单数据
  form.value = {
    id: good.id,
    name: good.name,
    description: good.description,
    link: good.link,
    category: good.category,
    image: good.coverImage || '',
    submitterEmail: email,
    submitterName: good.submitterName,
    tags: good.tags || ''
  };
  
  // 显示表单
  showForm.value = true;
};

/**
 * 通过邮箱验证执行编辑操作
 * @param {Object} good - 要编辑的好物对象
 * @param {string} email - 用户邮箱
 */
const performEditWithEmailVerification = async (good, email) => {
  try {
    // 构造编辑数据
    const editData = {
      email: email,
      name: good.name,
      link: good.link,
      description: good.description,
      category: good.category,
      tags: good.tags || '',
      coverImage: good.coverImage || ''
    };
    
    // 调用API进行邮箱验证和编辑
    await goodsService.updateGood(good.id, editData);
    
    // 编辑成功，预填充表单供用户修改
    performEdit(good, email);
    
    successToast('邮箱验证成功，可以编辑好物');
  } catch (error) {
    console.error('邮箱验证失败:', error);
    errorToast(error.response?.data?.message || '邮箱验证失败，请确认您是该好物的提交者');
  }
};

/**
 * 确认删除好物
 * @param {Object} good - 要删除的好物对象
 */
const confirmDeleteGood = (good) => {
  // 显示邮箱验证模态框
  openEmailModal(good, 'delete');
};

/**
 * 删除好物
 * @param {number} goodId - 好物ID
 * @param {string} email - 提交者邮箱
 */
const deleteGood = async (goodId, email) => {
  try {
    loading.value = true;
    await goodsService.deleteGood(goodId, email);
    successToast('删除成功');
    
    // 重新加载列表
    loadGoodsList(true);
  } catch (error) {
    console.error('删除好物失败:', error);
    if (error.response && error.response.status === 403) {
      errorToast('权限验证失败', '邮箱地址不匹配，无法删除此好物');
    } else {
      errorToast('删除失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

/**
 * 打开邮箱验证模态框
 * @param {Object} good - 好物对象
 * @param {string} type - 操作类型 'edit' 或 'delete'
 */
const openEmailModal = (good, type) => {
  currentGood.value = good;
  emailModalType.value = type;
  modalEmail.value = '';
  emailError.value = '';
  showEmailModal.value = true;
};

/**
 * 关闭邮箱验证模态框
 */
const closeEmailModal = () => {
  showEmailModal.value = false;
  currentGood.value = null;
  emailModalType.value = '';
  modalEmail.value = '';
  emailError.value = '';
};

/**
 * 确认邮箱操作
 */
const confirmEmailAction = async () => {
  const email = modalEmail.value.trim();
  
  // 验证邮箱格式
  if (!email) {
    emailError.value = '请输入邮箱地址';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.value = '请输入有效的邮箱地址';
    return;
  }
  
  // 执行对应操作
  if (emailModalType.value === 'edit') {
    // 直接调用编辑API进行邮箱验证
    await performEditWithEmailVerification(currentGood.value, email);
  } else if (emailModalType.value === 'delete') {
    // 显示删除确认对话框
    deleteGoodData.value = {
      ...currentGood.value,
      email: email
    };
    showDeleteConfirm.value = true;
  }
  
  // 关闭模态框
  closeEmailModal();
};

/**
 * 关闭删除确认对话框
 */
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  deleteGoodData.value = null;
};

/**
 * 确认删除操作
 */
const confirmDelete = async () => {
  if (deleteGoodData.value) {
    try {
      // 调用API进行邮箱验证和删除
      await goodsService.deleteGood(deleteGoodData.value.id, deleteGoodData.value.email);
      
      // 删除成功，重新加载列表
      await loadGoodsList(true);
      
      successToast('好物删除成功');
      closeDeleteConfirm();
    } catch (error) {
      console.error('删除失败:', error);
      errorToast(error.response?.data?.message || '删除失败，请确认您是该好物的提交者');
    }
  }
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
