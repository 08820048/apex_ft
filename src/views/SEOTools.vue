<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">SEO 工具</h1>
        
        <!-- Sitemap 生成 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">生成 Sitemap</h2>
          <div class="flex items-center space-x-4">
            <button
              @click="generateAndDownloadSitemap"
              :disabled="loading"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {{ loading ? '生成中...' : '生成并下载 sitemap.xml' }}
            </button>
            <span class="text-sm text-gray-600">
              包含 {{ stats.articles }} 篇文章，{{ stats.categories }} 个分类，{{ stats.tags }} 个标签
            </span>
          </div>
        </div>

        <!-- Robots.txt 生成 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Robots.txt</h2>
          <div class="flex items-center space-x-4 mb-4">
            <button
              @click="downloadRobotsTxt"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              下载 robots.txt
            </button>
          </div>
          <div class="bg-gray-100 rounded-lg p-4">
            <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ robotsContent }}</pre>
          </div>
        </div>

        <!-- SEO 检查 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">SEO 状态检查</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 class="font-medium text-green-800 mb-2">✅ 已优化项目</h3>
              <ul class="text-sm text-green-700 space-y-1">
                <li>• Meta 标签完整</li>
                <li>• Open Graph 标签</li>
                <li>• Twitter Card 标签</li>
                <li>• 结构化数据</li>
                <li>• 动态页面标题</li>
                <li>• 规范链接</li>
                <li>• RSS 订阅</li>
              </ul>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="font-medium text-blue-800 mb-2">📊 SEO 统计</h3>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• 文章总数: {{ stats.articles }}</li>
                <li>• 分类数量: {{ stats.categories }}</li>
                <li>• 标签数量: {{ stats.tags }}</li>
                <li>• 页面总数: {{ stats.totalPages }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-medium text-yellow-800 mb-2">💡 SEO 提示</h3>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• 定期更新 sitemap.xml 并提交给搜索引擎</li>
            <li>• 确保 robots.txt 文件可访问</li>
            <li>• 监控网站在搜索引擎中的表现</li>
            <li>• 保持内容更新频率</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { articleApi, categoryApi, tagApi } from '../api'
import { generateSitemap, downloadSitemap, generateRobotsTxt } from '../utils/sitemap'

const loading = ref(false)
const stats = ref({
  articles: 0,
  categories: 0,
  tags: 0,
  totalPages: 7 // 静态页面数量
})

const robotsContent = ref('')

// 生成并下载 sitemap
const generateAndDownloadSitemap = async () => {
  try {
    loading.value = true
    
    // 获取所有数据
    const [articlesData, categoriesData, tagsData] = await Promise.all([
      articleApi.getList({ page: 0, size: 1000 }),
      categoryApi.getList(),
      tagApi.getList()
    ])

    const articles = articlesData.content || []
    const categories = categoriesData || []
    const tags = tagsData || []

    // 生成 sitemap
    const sitemapContent = generateSitemap(articles, categories, tags)
    
    // 下载文件
    downloadSitemap(sitemapContent)
    
    // 更新统计
    stats.value.articles = articles.length
    stats.value.categories = categories.length
    stats.value.tags = tags.length
    stats.value.totalPages = 7 + articles.length + categories.length + tags.length
    
  } catch (error) {
    console.error('生成 sitemap 失败:', error)
    alert('生成 sitemap 失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 下载 robots.txt
const downloadRobotsTxt = () => {
  const content = generateRobotsTxt()
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'robots.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 加载统计数据
const loadStats = async () => {
  try {
    const [articlesData, categoriesData, tagsData] = await Promise.all([
      articleApi.getList({ page: 0, size: 1 }),
      categoryApi.getList(),
      tagApi.getList()
    ])

    stats.value.articles = articlesData.totalElements || 0
    stats.value.categories = (categoriesData || []).length
    stats.value.tags = (tagsData || []).length
    stats.value.totalPages = 7 + stats.value.articles + stats.value.categories + stats.value.tags
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  robotsContent.value = generateRobotsTxt()
  loadStats()
})
</script>
