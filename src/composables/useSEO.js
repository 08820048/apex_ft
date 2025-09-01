import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useSEO() {
  const route = useRoute()
  
  // 默认 SEO 配置
  const defaultSEO = {
    title: '八尺妖剑 - 技术博客',
    description: '八尺妖剑的个人技术博客，专注于前端开发、后端技术、编程经验分享',
    keywords: '技术博客,前端开发,后端开发,编程,Vue.js,JavaScript,Java,Spring Boot,八尺妖剑',
    author: '八尺妖剑',
    image: '/Apex.png',
    url: 'https://ilikexff.cn',
    type: 'website',
    locale: 'zh_CN',
    siteName: '八尺妖剑的技术博客'
  }

  // 设置页面 SEO 信息
  const setSEO = (seoData = {}) => {
    const seo = { ...defaultSEO, ...seoData }
    
    // 设置页面标题
    document.title = seo.title
    
    // 更新或创建 meta 标签
    updateMetaTag('description', seo.description)
    updateMetaTag('keywords', seo.keywords)
    updateMetaTag('author', seo.author)
    
    // Open Graph 标签
    updateMetaTag('og:title', seo.title, 'property')
    updateMetaTag('og:description', seo.description, 'property')
    updateMetaTag('og:image', seo.image, 'property')
    updateMetaTag('og:url', seo.url, 'property')
    updateMetaTag('og:type', seo.type, 'property')
    updateMetaTag('og:locale', seo.locale, 'property')
    updateMetaTag('og:site_name', seo.siteName, 'property')
    
    // Twitter Card 标签
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', seo.title, 'name')
    updateMetaTag('twitter:description', seo.description, 'name')
    updateMetaTag('twitter:image', seo.image, 'name')
    
    // 规范链接
    updateLinkTag('canonical', seo.url)
    
    // 语言标签
    document.documentElement.lang = 'zh-CN'
  }

  // 更新或创建 meta 标签
  const updateMetaTag = (name, content, attribute = 'name') => {
    if (!content) return
    
    let meta = document.querySelector(`meta[${attribute}="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attribute, name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // 更新或创建 link 标签
  const updateLinkTag = (rel, href) => {
    if (!href) return
    
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', rel)
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  }

  // 设置文章页面 SEO
  const setArticleSEO = (article) => {
    if (!article) return
    
    const articleUrl = `https://ilikexff.cn/article/${article.id}`
    const articleImage = article.coverImage || '/Apex.png'
    
    setSEO({
      title: `${article.title} - 八尺妖剑`,
      description: article.summary || article.content?.substring(0, 160) || defaultSEO.description,
      keywords: `${article.title},${article.tags?.map(tag => tag.name).join(',') || ''},${defaultSEO.keywords}`,
      image: articleImage,
      url: articleUrl,
      type: 'article'
    })

    // 文章特有的 meta 标签
    updateMetaTag('article:author', defaultSEO.author, 'property')
    updateMetaTag('article:published_time', article.createdAt, 'property')
    updateMetaTag('article:modified_time', article.updatedAt, 'property')
    
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'article:tag')
        meta.setAttribute('content', tag.name)
        document.head.appendChild(meta)
      })
    }
  }

  // 添加结构化数据
  const addStructuredData = (data) => {
    // 移除现有的结构化数据
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // 添加新的结构化数据
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // 设置博客首页结构化数据
  const setBlogStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "八尺妖剑的技术博客",
      "description": "专注于前端开发、后端技术、编程经验分享的个人技术博客",
      "url": "https://ilikexff.cn",
      "author": {
        "@type": "Person",
        "name": "八尺妖剑",
        "url": "https://ilikexff.cn/about"
      },
      "publisher": {
        "@type": "Person",
        "name": "八尺妖剑"
      },
      "inLanguage": "zh-CN"
    }
    addStructuredData(structuredData)
  }

  // 设置文章结构化数据
  const setArticleStructuredData = (article) => {
    if (!article) return
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.summary || article.content?.substring(0, 160),
      "image": article.coverImage || "https://ilikexff.cn/Apex.png",
      "url": `https://ilikexff.cn/article/${article.id}`,
      "datePublished": article.createdAt,
      "dateModified": article.updatedAt || article.createdAt,
      "author": {
        "@type": "Person",
        "name": "八尺妖剑",
        "url": "https://ilikexff.cn/about"
      },
      "publisher": {
        "@type": "Person",
        "name": "八尺妖剑"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://ilikexff.cn/article/${article.id}`
      },
      "inLanguage": "zh-CN"
    }

    if (article.tags && article.tags.length > 0) {
      structuredData.keywords = article.tags.map(tag => tag.name).join(', ')
    }

    addStructuredData(structuredData)
  }

  return {
    setSEO,
    setArticleSEO,
    setBlogStructuredData,
    setArticleStructuredData,
    addStructuredData
  }
}
