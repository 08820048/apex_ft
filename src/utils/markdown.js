import { marked } from "marked";
import hljs from "highlight.js";
import katex from "katex";

// B站视频链接转换函数
function convertBilibiliLinks(html) {
  console.log("处理前的HTML:", html.substring(0, 500) + "...");

  // 首先处理完整的<a>标签格式
  const linkRegex =
    /<a[^>]*href=["']([^"']*bilibili\.com\/video\/[^"']*)["'][^>]*>([^<]*)<\/a>/g;
  html = html.replace(linkRegex, (match, url, text) => {
    console.log("匹配到链接标签:", match);
    const bvMatch = url.match(/(BV[a-zA-Z0-9]+)/);
    if (bvMatch) {
      const bvid = bvMatch[1];
      const timeMatch = url.match(/[?&]t=([0-9.]+)/);
      const timeValue = timeMatch ? parseFloat(timeMatch[1]) : 0;
      console.log("转换链接标签为播放器:", bvid);
      return generateBilibiliPlayer(bvid, timeValue, url);
    }
    return match;
  });

  // 然后处理纯URL格式
  const urlRegex =
    /(https?:\/\/)?(www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]+)(\?[^"'\s<>]*)?/g;
  html = html.replace(urlRegex, (match, protocol, www, bvid, params) => {
    console.log("匹配到纯URL:", match);
    // 检查这个URL是否已经在播放器中了
    if (html.includes(`bvid=${bvid}`)) {
      console.log("URL已经被处理过，跳过:", bvid);
      return match; // 如果已经处理过，就不再处理
    }
    // 提取时间参数
    let timeValue = 0;
    if (params) {
      const timeMatch = params.match(/[?&]t=([0-9.]+)/);
      if (timeMatch) {
        timeValue = parseFloat(timeMatch[1]);
      }
    }

    console.log("转换纯URL为播放器:", bvid);
    return generateBilibiliPlayer(bvid, timeValue, match);
  });

  console.log("处理后的HTML:", html.substring(0, 500) + "...");
  return html;
}

// 生成B站播放器HTML的通用函数
function generateBilibiliPlayer(bvid, timeValue, originalUrl) {
  const timeParam = timeValue > 0 ? `&t=${timeValue}` : "";

  return `<div class="bilibili-player-enhanced">
    <div class="player-header">
      <div class="bilibili-brand">
        <svg class="bilibili-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
        </svg>
        <span>哔哩哔哩</span>
      </div>
      <a href="${originalUrl}" target="_blank" class="external-link" title="在新窗口打开">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </a>
    </div>
    <div class="player-content">
      <iframe
        src="//player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=0&danmaku=0${timeParam}&high_quality=1&as_wide=1"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        class="bilibili-enhanced-iframe">
      </iframe>
    </div>
  </div>`;
}

// 时间格式化函数
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 导入样式
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

// HTML 转义函数
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// 数学公式处理函数
function processMathExpressions(content) {
  // 处理块级数学公式 $$...$$
  content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: false,
      });
      return `<div class="math-block">${html}</div>`;
    } catch (error) {
      console.error("KaTeX block error:", error);
      return `<div class="math-error">数学公式渲染错误: ${formula}</div>`;
    }
  });

  // 处理行内数学公式 $...$
  content = content.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: false,
      });
      return `<span class="math-inline">${html}</span>`;
    } catch (error) {
      console.error("KaTeX inline error:", error);
      return `<span class="math-error">公式错误: ${formula}</span>`;
    }
  });

  return content;
}

// 初始化 highlight.js
console.log(
  "highlight.js loaded, supported languages:",
  hljs.listLanguages().length
);

// 添加复制代码功能到全局
window.copyToClipboard = function (button) {
  const code = button.getAttribute("data-code");
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      已复制
    `;
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("复制失败:", err);
    });
};

// 配置 marked 使用扩展
marked.use({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const escapedText = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, "-");
      return `
        <h${token.depth} id="${escapedText}" class="group relative">
          <a href="#${escapedText}" class="header-anchor absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-blue-500 no-underline" aria-hidden="true">#</a>
          ${text}
        </h${token.depth}>
      `;
    },

    code(token) {
      const code = token.text;
      const language = token.lang || "";

      console.log("Code block:", { language, codeLength: code.length });

      let highlightedCode;
      let detectedLanguage = language;

      try {
        if (language && hljs.getLanguage(language)) {
          // 指定语言高亮
          const result = hljs.highlight(code, { language });
          highlightedCode = result.value;
          console.log("Highlighted with specified language:", language);
        } else {
          // 自动检测语言
          const result = hljs.highlightAuto(code);
          highlightedCode = result.value;
          detectedLanguage = result.language || "text";
          console.log("Auto-detected language:", detectedLanguage);
        }
      } catch (e) {
        console.error("highlight.js error:", e);
        highlightedCode = escapeHtml(code);
        detectedLanguage = "text";
      }

      const escapedCode = escapeHtml(code);

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-language">${
              language || detectedLanguage || "text"
            }</span>
            <button class="copy-button" onclick="copyToClipboard(this)" data-code="${escapedCode}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              复制
            </button>
          </div>
          <pre><code class="hljs ${detectedLanguage}">${highlightedCode}</code></pre>
        </div>
      `;
    },

    table(token) {
      const header = this.parser.parse(token.header);
      const body = this.parser.parse(token.rows);
      return `
        <div class="table-wrapper">
          <table class="markdown-table">
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      `;
    },

    link(token) {
      const href = token.href;
      const title = token.title;
      const text = this.parser.parseInline(token.tokens);
      const isExternal =
        href.startsWith("http") && !href.includes(window.location.hostname);
      const target = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      const titleAttr = title ? ` title="${title}"` : "";

      return `<a href="${href}"${titleAttr}${target} class="markdown-link">${text}</a>`;
    },

    image(token) {
      const href = token.href;
      const title = token.title;
      const text = token.text;
      const titleAttr = title ? ` title="${title}"` : "";
      return `
        <div class="image-wrapper">
          <img src="${href}" alt="${text}"${titleAttr} class="markdown-image" loading="lazy" />
          ${title ? `<p class="image-caption">${title}</p>` : ""}
        </div>
      `;
    },

    blockquote(token) {
      const quote = this.parser.parse(token.tokens);
      return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
    },
  },

  gfm: true,
  breaks: true,
  sanitize: false, // 允许HTML标签
  smartypants: false,
});

// 导出渲染函数
export function renderMarkdown(content) {
  if (!content) return "";

  // 先处理数学公式，再进行Markdown渲染
  const processedContent = processMathExpressions(content);
  let htmlContent = marked(processedContent);

  // 处理B站视频链接
  htmlContent = convertBilibiliLinks(htmlContent);

  return htmlContent;
}

export default {
  render: renderMarkdown,
};
