/**
 * 网站预览图获取工具
 * 提供多层备用机制：网页截图 -> Favicon -> 默认图标 -> 首字母
 */

/**
 * 获取网站预览图
 * @param {string} url - 网站URL
 * @param {Object} options - 配置选项
 * @param {string} options.fallbackText - 备用文字（通常是网站名称首字母）
 * @param {number} options.timeout - 超时时间（毫秒）
 * @param {boolean} options.useScreenshot - 是否尝试使用截图API
 * @returns {Promise<Object>} 返回预览图信息
 */
export async function getWebsitePreview(url, options = {}) {
  const {
    fallbackText = 'W',
    timeout = 5000,
    useScreenshot = true
  } = options

  // 标准化URL
  const normalizedUrl = normalizeUrl(url)
  
  const result = {
    type: 'text', // 'screenshot', 'favicon', 'default', 'text'
    src: '',
    alt: fallbackText,
    url: normalizedUrl
  }

  try {
    // 第一层：尝试获取网页截图（如果启用）
    if (useScreenshot) {
      const screenshotResult = await tryGetScreenshot(normalizedUrl, timeout)
      if (screenshotResult.success) {
        result.type = 'screenshot'
        result.src = screenshotResult.url
        return result
      }
    }

    // 第二层：尝试获取Favicon
    const faviconResult = await tryGetFavicon(normalizedUrl, timeout)
    if (faviconResult.success) {
      result.type = 'favicon'
      result.src = faviconResult.url
      return result
    }

    // 第三层：使用默认图标
    result.type = 'default'
    result.src = getDefaultIcon()
    return result

  } catch (error) {
    console.warn('获取网站预览图失败:', error)
    
    // 最后备用：返回文字
    result.type = 'text'
    result.src = ''
    return result
  }
}

/**
 * 尝试获取网页截图
 * @param {string} url - 网站URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<Object>} 截图结果
 */
async function tryGetScreenshot(url, timeout) {
  const screenshotServices = [
    // ApiFlash - 免费100次/月 <mcreference link="https://apiflash.com/" index="4">4</mcreference>
    {
      name: 'apiflash',
      getUrl: (targetUrl) => `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(targetUrl)}&width=400&height=300&format=jpeg&quality=80`
    },
    // ScreenshotAPI.net <mcreference link="https://www.screenshotapi.net/" index="3">3</mcreference>
    {
      name: 'screenshotapi',
      getUrl: (targetUrl) => `https://shot.screenshotapi.net/screenshot?token=demo&url=${encodeURIComponent(targetUrl)}&width=400&height=300&file_type=jpeg&wait_for_event=load`
    }
  ]

  for (const service of screenshotServices) {
    try {
      const screenshotUrl = service.getUrl(url)
      const isValid = await checkImageUrl(screenshotUrl, timeout)
      
      if (isValid) {
        return {
          success: true,
          url: screenshotUrl,
          service: service.name
        }
      }
    } catch (error) {
      console.warn(`截图服务 ${service.name} 失败:`, error)
      continue
    }
  }

  return { success: false }
}

/**
 * 尝试获取网站Favicon
 * @param {string} url - 网站URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<Object>} Favicon结果
 */
async function tryGetFavicon(url, timeout) {
  const domain = extractDomain(url)
  
  const faviconServices = [
    // Google Favicon API <mcreference link="https://miletadulovic.me/blog/get-any-website-favicon-using-free-google-api" index="2">2</mcreference>
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    // Favicon.is <mcreference link="https://favicon.is/" index="4">4</mcreference>
    `https://favicon.is/${domain}`,
    // 直接从网站获取
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`
  ]

  for (const faviconUrl of faviconServices) {
    try {
      const isValid = await checkImageUrl(faviconUrl, timeout)
      
      if (isValid) {
        return {
          success: true,
          url: faviconUrl
        }
      }
    } catch (error) {
      continue
    }
  }

  return { success: false }
}

/**
 * 检查图片URL是否有效
 * @param {string} imageUrl - 图片URL
 * @param {number} timeout - 超时时间
 * @returns {Promise<boolean>} 是否有效
 */
function checkImageUrl(imageUrl, timeout = 3000) {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => {
      resolve(false)
    }, timeout)

    img.onload = () => {
      clearTimeout(timer)
      // 检查图片尺寸，避免1x1像素的占位图
      resolve(img.width > 1 && img.height > 1)
    }

    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }

    img.src = imageUrl
  })
}

/**
 * 获取默认图标
 * @returns {string} 默认图标的Data URL
 */
function getDefaultIcon() {
  // 返回一个简单的SVG图标
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="8" fill="#f3f4f6"/>
      <rect x="12" y="20" width="40" height="4" rx="2" fill="#9ca3af"/>
      <rect x="12" y="30" width="32" height="4" rx="2" fill="#d1d5db"/>
      <rect x="12" y="40" width="36" height="4" rx="2" fill="#d1d5db"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * 标准化URL
 * @param {string} url - 原始URL
 * @returns {string} 标准化后的URL
 */
function normalizeUrl(url) {
  if (!url) return ''
  
  // 如果没有协议，添加https
  if (!url.match(/^https?:\/\//)) {
    url = 'https://' + url
  }
  
  return url
}

/**
 * 从URL中提取域名
 * @param {string} url - URL
 * @returns {string} 域名
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(normalizeUrl(url))
    return urlObj.hostname
  } catch (error) {
    // 如果URL解析失败，尝试简单的字符串处理
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^/]+)/)
    return match ? match[1] : url
  }
}

/**
 * 批量获取网站预览图
 * @param {Array} urls - URL数组
 * @param {Object} options - 配置选项
 * @returns {Promise<Array>} 预览图结果数组
 */
export async function getBatchWebsitePreviews(urls, options = {}) {
  const { concurrency = 3 } = options
  
  const results = []
  
  // 分批处理，避免同时发起太多请求
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchPromises = batch.map(url => 
      getWebsitePreview(url, {
        ...options,
        fallbackText: url.charAt(0).toUpperCase()
      })
    )
    
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }
  
  return results
}

/**
 * 缓存管理
 */
class PreviewCache {
  constructor(maxSize = 100, ttl = 24 * 60 * 60 * 1000) { // 默认24小时TTL
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  get(url) {
    const item = this.cache.get(url)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(url)
      return null
    }
    
    return item.data
  }

  set(url, data) {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(url, {
      data,
      timestamp: Date.now()
    })
  }

  clear() {
    this.cache.clear()
  }
}

// 全局缓存实例
export const previewCache = new PreviewCache()

/**
 * 带缓存的获取网站预览图
 * @param {string} url - 网站URL
 * @param {Object} options - 配置选项
 * @returns {Promise<Object>} 预览图信息
 */
export async function getCachedWebsitePreview(url, options = {}) {
  const cacheKey = `${url}_${JSON.stringify(options)}`
  
  // 尝试从缓存获取
  const cached = previewCache.get(cacheKey)
  if (cached) {
    return cached
  }
  
  // 获取新数据并缓存
  const result = await getWebsitePreview(url, options)
  previewCache.set(cacheKey, result)
  
  return result
}