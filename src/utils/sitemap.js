// 生成 sitemap.xml 的工具函数
export function generateSitemap(articles = [], categories = [], tags = []) {
  const baseUrl = 'https://ilikexff.cn'
  const currentDate = new Date().toISOString().split('T')[0]
  
  // 静态页面
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/categories', priority: '0.8', changefreq: 'weekly' },
    { url: '/tags', priority: '0.8', changefreq: 'weekly' },
    { url: '/portfolios', priority: '0.7', changefreq: 'monthly' },
    { url: '/friend-links', priority: '0.6', changefreq: 'monthly' },
    { url: '/subscribe', priority: '0.5', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' }
  ]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // 添加静态页面
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  // 添加文章页面
  articles.forEach(article => {
    const lastmod = article.updatedAt ? 
      new Date(article.updatedAt).toISOString().split('T')[0] : 
      new Date(article.createdAt).toISOString().split('T')[0]
    
    sitemap += `  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`
  })

  // 添加分类页面
  categories.forEach(category => {
    sitemap += `  <url>
    <loc>${baseUrl}/search?category=${category.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })

  // 添加标签页面
  tags.forEach(tag => {
    sitemap += `  <url>
    <loc>${baseUrl}/search?tag=${tag.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`
  })

  sitemap += `</urlset>`
  
  return sitemap
}

// 下载 sitemap.xml 文件
export function downloadSitemap(content) {
  const blob = new Blob([content], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sitemap.xml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 生成 robots.txt 内容
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# 允许搜索引擎访问所有页面
Allow: /api/rss/
Allow: /assets/
Allow: /Apex.png
Allow: /ads.txt

# 站点地图位置
Sitemap: https://ilikexff.cn/sitemap.xml

# 爬取延迟（可选，单位：秒）
Crawl-delay: 1

# 针对特定搜索引擎的规则
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /`
}
