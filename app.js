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

// 书签内容会从 Supabase 的 links 表读取，不再在前端维护静态网站列表。

// 从共享配置创建浏览器端 Supabase 客户端；anon key 可公开，数据访问由 RLS 控制。
const supabaseClient = window.supabase?.createClient && window.SUPABASE_CONFIG
  ? window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey,
    )
  : null;

// 取得 HTML 中需要由 JavaScript 更新的元素。
const categoryNav = document.querySelector("#category-nav");
const bookmarkGrid = document.querySelector("#bookmark-grid");
const linkCount = document.querySelector("#link-count");
const emptyState = document.querySelector("#empty-state");
const dataStatus = document.querySelector("#data-status");
const searchInput = document.querySelector("#site-search");
const searchForm = document.querySelector("#search-form");
const sidebarToggle = document.querySelector("#sidebar-toggle");
let bookmarks = [];
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

// 读取数据库内容；图标优先使用网站根目录下的 favicon.ico。
function normalizeBookmark(row) {
  const name = String(row.name || "").trim();
  if (!name) return null;

  try {
    const website = new URL(String(row.url || "").trim());
    if (!["http:", "https:"].includes(website.protocol)) return null;

    return {
      id: String(row.id),
      name,
      description: String(row.description || "").trim() || `网站入口 · ${website.hostname}`,
      url: website.href,
      iconUrl: `${website.origin}/favicon.ico`,
      category: categories.some(({ id }) => id === row.category) ? row.category : "all",
      tags: [],
      icon: name.slice(0, 2),
    };
  } catch {
    return null;
  }
}

// 从 links 表读取最新数据；错误信息会显示在页面上，而不是静默显示空列表。
async function loadBookmarks() {
  if (!supabaseClient) {
    dataStatus.textContent = "Supabase 客户端未加载，请检查网络连接或页面配置。";
    dataStatus.hidden = false;
    dataStatus.classList.add("is-error");
    emptyState.hidden = false;
    emptyState.textContent = "目前无法连接数据库，请稍后重试。";
    bookmarkGrid.hidden = true;
    return;
  }

  dataStatus.textContent = "正在加载网站...";
  dataStatus.hidden = false;
  dataStatus.classList.remove("is-error");

  let data;
  let error;
  try {
    ({ data, error } = await supabaseClient
      .from("links")
      .select("*")
      .order("created_at", { ascending: false }));
  } catch (requestError) {
    dataStatus.textContent = `加载失败：${requestError.message}`;
    dataStatus.classList.add("is-error");
    emptyState.hidden = false;
    emptyState.textContent = "目前无法连接数据库，请稍后重试。";
    bookmarkGrid.hidden = true;
    return;
  }

  if (error) {
    dataStatus.textContent = `加载失败：${error.message}`;
    dataStatus.classList.add("is-error");
    emptyState.hidden = false;
    emptyState.textContent = "目前无法读取数据库内容，请稍后重试。";
    bookmarkGrid.hidden = true;
    return;
  }

  const rows = data || [];
  bookmarks = rows.map(normalizeBookmark).filter(Boolean);
  const invalidCount = rows.length - bookmarks.length;
  const hasCategoryColumn = rows.some((row) => row.category);

  if (invalidCount > 0) {
    dataStatus.textContent = `有 ${invalidCount} 条记录名称为空或网址无效，已跳过。`;
    dataStatus.classList.add("is-error");
    if (bookmarks.length === 0) {
      emptyState.textContent = "没有有效网址，请检查数据库中的名称和 URL。";
    }
  } else if (bookmarks.length > 0 && !hasCategoryColumn) {
    dataStatus.textContent = "当前 links 表没有分类字段；请先运行 supabase-metadata-migration.sql。";
    dataStatus.classList.remove("is-error");
  } else {
    dataStatus.textContent = "";
    dataStatus.hidden = true;
  }

  renderBookmarks();
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
  const cards = visibleBookmarks.map(({ name, description, url, iconUrl, icon, tags }) => {
    const website = new URL(url);
    const safeName = escapeHtml(name);
    const safeDescription = escapeHtml(description);
    const safeUrl = escapeHtml(website.href);
    const safeFavicon = escapeHtml(iconUrl);
    const safeIcon = escapeHtml(icon);
    const tagList = tags.length
      ? `<span class="bookmark-tags">${tags
          .map((tag) => `<span class="bookmark-tag">${escapeHtml(tag)}</span>`)
          .join("")}</span>`
      : "";

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
          ${tagList}
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
  if (!visibleBookmarks.length && !dataStatus.classList.contains("is-error")) {
    emptyState.textContent = bookmarks.length
      ? "没有找到相关网站，试试其他分类或关键词。"
      : "数据库中还没有网址，请先通过管理后台添加。";
  }
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
  const lunarMonth = formatLunarMonth(lunarPart("month"));
  const lunarDay = formatLunarDay(lunarPart("day"));
  document.querySelector("#clock-lunar").textContent =
    `农历${lunarYear}年${lunarMonth}${lunarDay}`;
  const clockTime = document.querySelector("#clock-time");
  clockTime.textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  clockTime.dateTime = now.toISOString();
}

// 将农历月、日统一转换为金融大写中文，兼容 Intl 返回中文或数字。
function formatLunarMonth(value) {
  const rawMonth = String(value || "").trim();
  const isLeapMonth = rawMonth.startsWith("闰") || /bis$/i.test(rawMonth);
  const monthText = rawMonth
    .replace(/^闰/, "")
    .replace(/月$/, "")
    .replace(/^M/i, "")
    .replace(/bis$/i, "");
  const namedMonths = { 正: 1, 冬: 11, 腊: 12 };
  const monthNumber = namedMonths[monthText] || parseChineseCalendarNumber(monthText);

  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return toFinancialChinese(rawMonth);
  }

  return `${isLeapMonth ? "闰" : ""}${formatFinancialNumber(monthNumber)}月`;
}

function formatLunarDay(value) {
  const dayText = String(value || "").trim().replace(/^初/, "");
  const dayNumber = parseChineseCalendarNumber(dayText);

  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    return toFinancialChinese(value);
  }
  if (dayNumber <= 10) {
    return `初${formatFinancialNumber(dayNumber)}`;
  }

  return formatFinancialNumber(dayNumber);
}

function parseChineseCalendarNumber(value) {
  const text = String(value || "").trim();
  const digits = {
    零: 0, 〇: 0, 一: 1, 壹: 1, 二: 2, 贰: 2, 三: 3, 叁: 3,
    四: 4, 肆: 4, 五: 5, 伍: 5, 六: 6, 陆: 6, 七: 7, 柒: 7,
    八: 8, 捌: 8, 九: 9, 玖: 9,
  };
  const numericPart = text.match(/\d+/)?.[0];
  if (numericPart) {
    return Number(numericPart);
  }
  if (text === "廿") return 20;
  if (text === "卅") return 30;
  if (text.startsWith("廿")) return 20 + (digits[text.slice(1)] || 0);
  if (text.startsWith("卅")) return 30 + (digits[text.slice(1)] || 0);

  const tenIndex = Math.max(text.indexOf("十"), text.indexOf("拾"));
  if (tenIndex >= 0) {
    const tens = tenIndex === 0 ? 1 : digits[text[tenIndex - 1]];
    const ones = text[tenIndex + 1] ? digits[text[tenIndex + 1]] : 0;
    if (tens !== undefined && ones !== undefined) {
      return tens * 10 + ones;
    }
  }

  return digits[text];
}

function formatFinancialNumber(value) {
  const digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  if (value < 10) return digits[value];
  if (value < 20) return `拾${value % 10 ? digits[value % 10] : ""}`;
  if (value < 30) return `贰拾${value % 10 ? digits[value % 10] : ""}`;
  return `叁拾${value % 10 ? digits[value % 10] : ""}`;
}

function toFinancialChinese(value) {
  const digits = {
    0: "零", 1: "壹", 2: "贰", 3: "叁", 4: "肆",
    5: "伍", 6: "陆", 7: "柒", 8: "捌", 9: "玖",
    零: "零", 〇: "〇", 一: "壹", 壹: "壹", 二: "贰", 贰: "贰",
    三: "叁", 叁: "叁", 四: "肆", 肆: "肆", 五: "伍", 伍: "伍",
    六: "陆", 陆: "陆", 七: "柒", 柒: "柒", 八: "捌", 捌: "捌",
    九: "玖", 玖: "玖", 十: "拾", 拾: "拾",
  };
  return String(value || "")
    .replace(/廿/g, "贰拾")
    .replace(/卅/g, "叁拾")
    .replace(/[0-9零〇一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾]/g, (digit) => digits[digit]);
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
loadBookmarks();
updateClock();
setInterval(updateClock, 1_000);
setTheme(localStorage.getItem("shiguang-theme") === "dark");
setSidebarCollapsed(sidebarCollapsed);
compactSidebarLayout.addEventListener("change", (event) => {
  setSidebarCollapsed(event.matches);
});
