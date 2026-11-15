// 分类 id 必须和下方网站数据里的 category 值对应；修改名称不会影响筛选。
const categories = [
  { id: "all", label: "全部网站", icon: "⌂" },
  { id: "daily", label: "日常服务", icon: "◷" },
  { id: "dev", label: "开发技术", icon: "⌘" },
  { id: "study", label: "学习教育", icon: "▤" },
  { id: "tools", label: "效率工具", icon: "⚙" },
  { id: "design", label: "设计素材", icon: "◈" },
  { id: "media", label: "影音媒体", icon: "▶" },
  { id: "games", label: "游戏专区", icon: "◇" },
];

/*
 * 网站列表维护说明：
 * name 是卡片名称，description 是简介，url 是点击后打开的网址。
 * category 必须使用上方某个分类 id；tags 会显示在卡片上，也可以被搜索。
 * icon 仅在网站图标无法加载时作为备用文字图标。
 */
const bookmarks = [
  // 日常服务
  {
    name: "Google",
    description: "网页搜索与信息发现",
    url: "https://www.google.com",
    category: "daily",
    tags: ["搜索", "信息"],
    icon: "G",
  },
  {
    name: "百度",
    description: "中文网页与内容搜索",
    url: "https://www.baidu.com",
    category: "daily",
    tags: ["搜索", "中文"],
    icon: "百",
  },
  {
    name: "Gmail",
    description: "Google 电子邮件服务",
    url: "https://mail.google.com",
    category: "daily",
    tags: ["邮箱", "通信"],
    icon: "M",
  },
  {
    name: "Outlook",
    description: "微软邮箱与日历服务",
    url: "https://outlook.live.com/mail/",
    category: "daily",
    tags: ["邮箱", "日历"],
    icon: "O",
  },
  {
    name: "网易 163 邮箱",
    description: "网易免费电子邮件服务",
    url: "https://mail.163.com",
    category: "daily",
    tags: ["邮箱", "通信"],
    icon: "邮",
  },
  {
    name: "爱发电",
    description: "支持创作者与订阅内容",
    url: "https://afdian.com",
    category: "daily",
    tags: ["创作者", "支持"],
    icon: "爱",
  },

  // 开发技术
  {
    name: "GitHub",
    description: "代码托管与开源协作",
    url: "https://github.com",
    category: "dev",
    tags: ["代码", "开源"],
    icon: "⌘",
  },
  {
    name: "CodePen",
    description: "在线编写与分享前端作品",
    url: "https://codepen.io",
    category: "dev",
    tags: ["前端", "代码"],
    icon: "◈",
  },
  {
    name: "MDN Web Docs",
    description: "Web 技术与浏览器 API 文档",
    url: "https://developer.mozilla.org",
    category: "dev",
    tags: ["文档", "Web"],
    icon: "M",
  },
  {
    name: "嘉立创 EDA",
    description: "在线电路设计与 PCB 开发",
    url: "https://lceda.cn",
    category: "dev",
    tags: ["电子设计", "PCB"],
    icon: "EDA",
  },
  {
    name: "HelloGitHub",
    description: "发现有趣、易上手的开源项目",
    url: "https://hellogithub.com",
    category: "dev",
    tags: ["开源", "项目"],
    icon: "H",
  },
  {
    name: "ThinkCraft Git",
    description: "ThinkCraft 代码托管入口",
    url: "https://git.thinkcraft.club",
    category: "dev",
    tags: ["Git", "代码托管"],
    icon: "Git",
  },

  // 学习教育
  {
    name: "嵌入式仿真实验平台",
    description: "嵌入式课程仿真与实验教学",
    url: "https://app.puliedu.com",
    category: "study",
    tags: ["嵌入式", "实验"],
    icon: "嵌",
  },
  {
    name: "STM32 课程资源",
    description: "STM32CubeMX 与 HAL 库学习资料",
    url: "https://www.wqyunpan.com/book-resources-list?id=1246427",
    category: "study",
    tags: ["STM32", "课程"],
    icon: "32",
  },
  {
    name: "百度网盘",
    description: "云端文件存储与分享服务",
    url: "https://pan.baidu.com",
    category: "study",
    tags: ["云盘", "资料"],
    icon: "盘",
  },
  {
    name: "知乎",
    description: "问答社区与知识分享",
    url: "https://www.zhihu.com",
    category: "study",
    tags: ["问答", "知识"],
    icon: "知",
  },
  {
    name: "少数派",
    description: "数字产品与高效生活内容",
    url: "https://sspai.com",
    category: "study",
    tags: ["科技", "阅读"],
    icon: "少",
  },
  {
    name: "Hello 算法",
    description: "图解数据结构与算法教程",
    url: "https://www.hello-algo.com/chapter_hello_algo/",
    category: "study",
    tags: ["算法", "编程"],
    icon: "A",
  },
  {
    name: "SurviveSJTU 手册",
    description: "上海交通大学学习生活指南",
    url: "https://survivesjtu.gitbook.io/survivesjtumanual",
    category: "study",
    tags: ["大学", "指南"],
    icon: "SJ",
  },
  {
    name: "掌上高考",
    description: "高考信息与志愿填报服务",
    url: "https://www.gaokao.cn",
    category: "study",
    tags: ["高考", "志愿"],
    icon: "考",
  },

  // 效率工具
  {
    name: "Notion",
    description: "笔记、知识库与项目管理",
    url: "https://www.notion.so",
    category: "tools",
    tags: ["笔记", "效率"],
    icon: "N",
  },
  {
    name: "Convertio",
    description: "在线转换文档、图片与媒体格式",
    url: "https://convertio.co/zh/",
    category: "tools",
    tags: ["文件转换", "在线工具"],
    icon: "C",
  },
  {
    name: "PDF24 Tools",
    description: "合并、压缩与编辑 PDF 文件",
    url: "https://tools.pdf24.org/zh/",
    category: "tools",
    tags: ["PDF", "文件处理"],
    icon: "PDF",
  },
  {
    name: "简单设计图片工具",
    description: "在线图片处理与设计辅助工具",
    url: "https://jiandan.link/image-tools",
    category: "tools",
    tags: ["图片", "处理"],
    icon: "图",
  },
  {
    name: "CRX 搜搜",
    description: "搜索 Chrome 浏览器扩展程序",
    url: "https://www.crxsoso.com",
    category: "tools",
    tags: ["浏览器", "扩展"],
    icon: "CRX",
  },
  {
    name: "MSDN 我告诉你",
    description: "Windows 与软件资源索引",
    url: "https://msdn.itellyou.cn",
    category: "tools",
    tags: ["Windows", "资源"],
    icon: "MS",
  },
  {
    name: "小众技术工具库",
    description: "实用软件与优质网站推荐",
    url: "https://www.xiaozhongjishu.com",
    category: "tools",
    tags: ["软件", "导航"],
    icon: "小",
  },
  {
    name: "果核剥壳",
    description: "软件资讯与应用资源分享",
    url: "https://www.ghxi.com",
    category: "tools",
    tags: ["软件", "资源"],
    icon: "果",
  },
  {
    name: "链接解析工具",
    description: "在线链接解析服务入口",
    url: "https://mf.dp.wpurl.cc/user/parse",
    category: "tools",
    tags: ["解析", "在线工具"],
    icon: "↗",
  },
  {
    name: "赔钱机场",
    description: "网络服务与订阅管理入口",
    url: "https://pqjc.site/dashboard",
    category: "tools",
    tags: ["网络", "服务"],
    icon: "网",
  },
  {
    name: "New API",
    description: "AI 模型 API 管理控制台",
    url: "https://llm.gxx12138.space/dashboard/overview",
    category: "tools",
    tags: ["AI", "API"],
    icon: "AI",
  },
  {
    name: "便携式服务器工具包",
    description: "ThinkCraft 服务器管理工具入口",
    url: "https://lserver.thinkcraft.club",
    category: "tools",
    tags: ["服务器", "工具"],
    icon: "Srv",
  },

  // 设计素材
  {
    name: "Figma",
    description: "界面设计与团队协作",
    url: "https://www.figma.com",
    category: "design",
    tags: ["UI", "协作"],
    icon: "◒",
  },
  {
    name: "Dribbble",
    description: "发现产品与视觉设计灵感",
    url: "https://dribbble.com",
    category: "design",
    tags: ["灵感", "作品"],
    icon: "◉",
  },
  {
    name: "Behance",
    description: "浏览与展示创意作品集",
    url: "https://www.behance.net",
    category: "design",
    tags: ["作品集", "创意"],
    icon: "Bē",
  },
  {
    name: "Freesound",
    description: "搜索和下载社区分享的声音素材",
    url: "https://freesound.org",
    category: "design",
    tags: ["音效", "素材"],
    icon: "♪",
  },

  // 影音媒体
  {
    name: "VoiceCraft",
    description: "文本转语音与 AI 语音处理",
    url: "https://tts.wangwangit.com",
    category: "media",
    tags: ["AI语音", "TTS"],
    icon: "声",
  },
  {
    name: "YouTube",
    description: "视频观看与创作者内容平台",
    url: "https://www.youtube.com",
    category: "media",
    tags: ["视频", "创作"],
    icon: "▶",
  },
  {
    name: "哔哩哔哩",
    description: "视频社区与创作者内容",
    url: "https://www.bilibili.com",
    category: "media",
    tags: ["视频", "社区"],
    icon: "B",
  },
  {
    name: "电控入门导论",
    description: "中科大 RM 电控入门视频",
    url: "https://www.bilibili.com/video/BV1z14y1G77V/",
    category: "media",
    tags: ["哔哩哔哩", "学习"],
    icon: "▶",
  },

  // 游戏专区
  {
    name: "GeoFS",
    description: "浏览器中的在线飞行模拟器",
    url: "https://www.geo-fs.com/geofs.php",
    category: "games",
    tags: ["飞行", "模拟"],
    icon: "✈",
  },
  {
    name: "Territorial.io",
    description: "在线领土扩张与策略对战游戏",
    url: "https://territorial.io",
    category: "games",
    tags: ["策略", "对战"],
    icon: "T",
  },
  {
    name: "Byrut Game",
    description: "俄语 PC 游戏资讯与下载站",
    url: "https://byrutgame.org",
    category: "games",
    tags: ["PC游戏", "资讯"],
    icon: "G",
  },
  {
    name: "PaperMC",
    description: "Minecraft 高性能服务端项目",
    url: "https://papermc.io",
    category: "games",
    tags: ["Minecraft", "服务端"],
    icon: "P",
  },
  {
    name: "MC 百科",
    description: "Minecraft 模组与游戏资料百科",
    url: "https://www.mcmod.cn",
    category: "games",
    tags: ["Minecraft", "模组"],
    icon: "MC",
  },
  {
    name: "MCNav",
    description: "Minecraft 网站与工具导航",
    url: "https://www.mcnav.net",
    category: "games",
    tags: ["Minecraft", "导航"],
    icon: "M",
  },
  {
    name: "Minecraft Wiki",
    description: "Minecraft 游戏机制与物品资料",
    url: "https://zh.minecraft.wiki",
    category: "games",
    tags: ["Minecraft", "百科"],
    icon: "W",
  },
  {
    name: "Chunk Base",
    description: "Minecraft 地图种子与世界生成工具",
    url: "https://www.chunkbase.com",
    category: "games",
    tags: ["Minecraft", "地图"],
    icon: "◇",
  },
  {
    name: "马基雅维利主义测试",
    description: "探索策略型人格特征的互动测试",
    url: "https://welovetest.net/zh/explore",
    category: "games",
    tags: ["人格测试", "测评"],
    icon: "?",
  },
];

// 取得 HTML 中需要由 JavaScript 更新的元素。
const categoryNav = document.querySelector("#category-nav");
const bookmarkGrid = document.querySelector("#bookmark-grid");
const linkCount = document.querySelector("#link-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#site-search");
const searchForm = document.querySelector("#search-form");
const sidebarToggle = document.querySelector("#sidebar-toggle");
let selectedCategory = "all";
let searchQuery = "";

// 手机窄屏或竖屏时默认收起侧边栏；方向变化时同步调整。
const compactSidebarLayout = window.matchMedia("(max-width: 760px), (orientation: portrait)");
let sidebarCollapsed = compactSidebarLayout.matches;

// 统一切换侧边栏状态，同时更新按钮的无障碍说明。
function setSidebarCollapsed(isCollapsed) {
  sidebarCollapsed = isCollapsed;
  document.body.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!sidebarCollapsed));
  sidebarToggle.setAttribute("aria-label", sidebarCollapsed ? "展开侧边栏" : "收起侧边栏");
  sidebarToggle.title = sidebarCollapsed ? "展开侧边栏" : "收起侧边栏";
}

// 根据 categories 数据生成左侧分类按钮。
function renderCategories() {
  categoryNav.innerHTML = categories
    .map(
      ({ id, label, icon }) => `
        <button
          class="category-button"
          type="button"
          data-category="${id}"
          aria-label="${label}"
          title="${label}"
          aria-pressed="${selectedCategory === id}"
        >
          <span class="category-icon" aria-hidden="true">${icon}</span>
          <span class="category-label">${label}</span>
        </button>
      `,
    )
    .join("");
}

// 把动态文字转换成安全的 HTML 文本，避免特殊字符被当作标签解析。
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

// 按当前分类和搜索词筛选书签；名称、简介、网址和标签都可搜索。
function getVisibleBookmarks() {
  const query = searchQuery.trim().toLocaleLowerCase();
  return bookmarks.filter((bookmark) => {
    const matchesCategory =
      selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesSearch =
      !query ||
      `${bookmark.name} ${bookmark.description} ${bookmark.url} ${bookmark.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(query);
    return matchesCategory && matchesSearch;
  });
}

// 重绘书签卡片，并尝试读取每个网站自己的 favicon。
function renderBookmarks() {
  const visibleBookmarks = getVisibleBookmarks();
  const cards = visibleBookmarks.map(({ name, description, url, icon, tags }) => {
    const website = new URL(url);
    const safeName = escapeHtml(name);
    const safeDescription = escapeHtml(description);
    const safeUrl = escapeHtml(website.href);
    const safeFavicon = escapeHtml(`${website.origin}/favicon.ico`);
    const safeIcon = escapeHtml(icon);
    const tagList = tags
      .map((tag) => `<span class="bookmark-tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <a
        class="bookmark-card"
        href="${safeUrl}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${safeName}：${safeDescription}（在新标签页打开）"
      >
        <span class="bookmark-icon" aria-hidden="true">
          <img
            class="bookmark-favicon"
            src="${safeFavicon}"
            data-domain="${escapeHtml(website.hostname)}"
            alt=""
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <span class="bookmark-fallback">${safeIcon}</span>
        </span>
        <span class="bookmark-info">
          <span class="bookmark-name">${safeName}</span>
          <span class="bookmark-description">${safeDescription}</span>
          <span class="bookmark-tags">${tagList}</span>
        </span>
        <span class="bookmark-arrow" aria-hidden="true">↗</span>
      </a>
    `;
  });
  bookmarkGrid.innerHTML = cards.join("");

  // 网站没有 /favicon.ico 时，再从备用图标服务按域名获取；都失败时保留文字图标。
  bookmarkGrid.querySelectorAll(".bookmark-favicon").forEach((image) => {
    image.addEventListener("load", () => {
      image.closest(".bookmark-icon").classList.add("has-favicon");
    }, { once: true });
    image.addEventListener("error", () => {
      if (!image.dataset.fallbackAttempted) {
        image.dataset.fallbackAttempted = "true";
        image.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(image.dataset.domain)}&sz=64`;
      } else {
        image.hidden = true;
      }
    });
    if (image.complete && image.naturalWidth > 0) {
      image.closest(".bookmark-icon").classList.add("has-favicon");
    }
  });
  linkCount.textContent = `${visibleBookmarks.length} 个网站`;
  emptyState.hidden = visibleBookmarks.length > 0;
  bookmarkGrid.hidden = visibleBookmarks.length === 0;
}

// 更新公历、农历和数字时间。每秒调用一次以显示秒数。
function updateClock() {
  const now = new Date();
  document.querySelector("#clock-date").textContent = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(now);
  const lunarParts = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(now);
  const lunarPart = (type) => lunarParts.find((part) => part.type === type)?.value;
  const lunarYear =
    lunarPart("yearName")?.replace(/年+$/, "") ||
    getSexagenaryYear(Number(lunarPart("relatedYear")) || now.getFullYear()).replace(/年$/, "");
  document.querySelector("#clock-lunar").textContent =
    `农历${lunarYear}年${lunarPart("month")}${lunarPart("day")}`;
  const clockTime = document.querySelector("#clock-time");
  clockTime.textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  clockTime.dateTime = now.toISOString();
}

// 作为浏览器缺少农历干支年字段时的备用算法；以 1984 年甲子年为基准。
function getSexagenaryYear(year) {
  const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const cycleYear = year - 4;
  return `${heavenlyStems[((cycleYear % 10) + 10) % 10]}${earthlyBranches[((cycleYear % 12) + 12) % 12]}年`;
}

// 切换深色/浅色主题，并更新按钮的辅助说明。
function setTheme(isDark) {
  document.body.classList.toggle("dark-theme", isDark);
  document.querySelector("#theme-toggle").setAttribute(
    "aria-label",
    isDark ? "切换浅色主题" : "切换深色主题",
  );
  document.querySelector("#theme-toggle").setAttribute(
    "title",
    isDark ? "切换浅色主题" : "切换深色主题",
  );
}

// 分类点击：更新筛选条件，并在紧凑屏幕上收起侧边栏。
categoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderCategories();
  renderBookmarks();
  if (compactSidebarLayout.matches) {
    setSidebarCollapsed(true);
  }
});

sidebarToggle.addEventListener("click", () => {
  setSidebarCollapsed(!sidebarCollapsed);
});

// 输入时即时筛选；提交时则打开 Google 网页搜索。
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderBookmarks();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    searchInput.focus();
    return;
  }
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    "_blank",
    "noopener,noreferrer",
  );
});

// 主题按钮在两种配色间切换，并保存用户选择。
document.querySelector("#theme-toggle").addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-theme");
  setTheme(isDark);
  localStorage.setItem("shiguang-theme", isDark ? "dark" : "light");
});

// Ctrl/⌘ + K 聚焦搜索框；Esc 清空搜索并恢复全部书签。
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchQuery = "";
    searchInput.blur();
    renderBookmarks();
  }
});

// 页面首次载入时绘制内容、显示时间并恢复主题和侧边栏状态。
renderCategories();
renderBookmarks();
updateClock();
setInterval(updateClock, 1_000);
setTheme(localStorage.getItem("shiguang-theme") === "dark");
setSidebarCollapsed(sidebarCollapsed);
compactSidebarLayout.addEventListener("change", (event) => {
  setSidebarCollapsed(event.matches);
});
