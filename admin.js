// 管理页仅使用 anon key 登录，所有写操作仍必须通过 Supabase Auth 和 RLS。
const supabaseClient = window.supabase?.createClient && window.SUPABASE_CONFIG
  ? window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey,
    )
  : null;

const ADMIN_EMAIL = "EthanPeng820@163.com";
const loginPanel = document.querySelector("#login-panel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#login-form");
const linkForm = document.querySelector("#link-form");
const adminMessage = document.querySelector("#admin-message");
const linkList = document.querySelector("#admin-link-list");
const linkIdInput = document.querySelector("#link-id");
const linkNameInput = document.querySelector("#link-name");
const linkCategoryInput = document.querySelector("#link-category");
const linkUrlInput = document.querySelector("#link-url");
const linkDescriptionInput = document.querySelector("#link-description");
const linkFormTitle = document.querySelector("#link-form-title");
const saveLinkButton = document.querySelector("#save-link-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const linkViewButtons = [...document.querySelectorAll("[data-link-view]")];
const categoryLabels = new Map([
  ["all", "全部网站"],
  ["daily", "日常服务"],
  ["dev", "开发技术"],
  ["study", "学习教育"],
  ["tools", "效率工具"],
  ["design", "设计素材"],
  ["media", "影音媒体"],
  ["games", "游戏专区"],
]);
const categoryIcons = new Map([
  ["all", "🏠"],
  ["daily", "☀️"],
  ["dev", "💻"],
  ["study", "📚"],
  ["tools", "🧰"],
  ["design", "🎨"],
  ["media", "🎬"],
  ["games", "🎮"],
]);
let links = [];
let currentLinkView = "active";

function showMessage(message, isError = false) {
  adminMessage.textContent = message;
  adminMessage.hidden = !message;
  adminMessage.classList.toggle("is-error", isError);
}

function setAuthenticated(isAuthenticated) {
  loginPanel.hidden = isAuthenticated;
  dashboard.hidden = !isAuthenticated;
  showMessage("");
}

function isAdminSession(session) {
  return session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function validateUrl(value) {
  const website = new URL(value.trim());
  if (!["http:", "https:"].includes(website.protocol)) {
    throw new Error("网址必须以 http:// 或 https:// 开头。");
  }
  return website.href;
}

function formatCollectedAt(value) {
  if (!value) return "收录时间未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "收录时间未知";
  return `收录于 ${new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)}`;
}

function renderLinks() {
  linkList.replaceChildren();
  const rows = links.filter((row) =>
    currentLinkView === "trash" ? Boolean(row.deleted_at) : !row.deleted_at,
  );

  if (!rows.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "admin-empty";
    emptyMessage.textContent = currentLinkView === "trash"
      ? "回收站是空的。"
      : "还没有网址，使用上方表单添加第一个网站。";
    linkList.append(emptyMessage);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "admin-link-row";

    const details = document.createElement("div");
    details.className = "admin-link-details";

    const name = document.createElement("span");
    name.className = "admin-link-name";
    name.textContent = `${row.name} · ${categoryLabels.get(row.category) || "全部网站"}`;
    details.append(name);

    if (row.description) {
      const description = document.createElement("span");
      description.className = "admin-link-description";
      description.textContent = row.description;
      details.append(description);
    }

    const metadata = document.createElement("div");
    metadata.className = "admin-link-meta";
    const collectedAt = document.createElement("span");
    collectedAt.textContent = formatCollectedAt(row.created_at);
    const visits = document.createElement("span");
    visits.className = "admin-link-stat";
    visits.title = "访问次数";
    const visitIcon = document.createElement("span");
    visitIcon.className = "admin-link-stat-icon";
    visitIcon.setAttribute("aria-hidden", "true");
    visitIcon.textContent = "◉";
    const visitCount = document.createElement("span");
    visitCount.textContent = `${Number(row.click_count) || 0} 次访问`;
    visits.append(visitIcon, visitCount);
    metadata.append(collectedAt, visits);
    details.append(metadata);

    const urlLabel = document.createElement("span");
    urlLabel.className = "admin-link-url";
    try {
      const websiteUrl = validateUrl(row.url);
      const website = document.createElement("a");
      website.className = "admin-link-url";
      website.href = websiteUrl;
      website.target = "_blank";
      website.rel = "noopener noreferrer";
      website.textContent = websiteUrl;
      details.append(website);
    } catch {
      urlLabel.textContent = `无效网址：${row.url}`;
      details.append(urlLabel);
    }

    const actions = document.createElement("div");
    actions.className = "admin-link-actions";

    const editButton = document.createElement("button");
    editButton.className = "admin-edit-button";
    editButton.type = "button";
    editButton.textContent = "编辑";
    editButton.addEventListener("click", () => {
      linkIdInput.value = String(row.id);
      linkNameInput.value = row.name;
      linkDescriptionInput.value = row.description || "";
      linkCategoryInput.value = categoryLabels.has(row.category) ? row.category : "all";
      linkUrlInput.value = row.url;
      linkFormTitle.textContent = "编辑网址";
      saveLinkButton.textContent = "保存修改";
      cancelEditButton.hidden = false;
      linkNameInput.focus();
      linkForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = currentLinkView === "trash"
      ? "admin-edit-button"
      : "admin-delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "移入回收站";
    deleteButton.addEventListener("click", async () => {
      if (currentLinkView === "trash") {
        await updateDeletedAt(row, null, "恢复");
        return;
      }
      if (!window.confirm(`确定将“${row.name}”移入回收站吗？之后可以恢复。`)) return;
      await updateDeletedAt(row, new Date().toISOString(), "移入回收站");
    });

    if (currentLinkView === "trash") {
      deleteButton.textContent = "恢复";
      const permanentDeleteButton = document.createElement("button");
      permanentDeleteButton.className = "admin-delete-button";
      permanentDeleteButton.type = "button";
      permanentDeleteButton.textContent = "永久删除";
      permanentDeleteButton.addEventListener("click", async () => {
        if (!window.confirm(`永久删除“${row.name}”？此操作无法撤销。`)) return;
        try {
          const { data, error } = await supabaseClient
            .from("links")
            .delete()
            .eq("id", String(row.id))
            .select("id")
            .maybeSingle();
          if (error) throw error;
          if (!data) throw new Error("网址未删除；请检查登录账号和 RLS 权限。");

          if (linkIdInput.value === String(row.id)) resetLinkForm();
          await loadLinks();
          showMessage("网址已永久删除。");
        } catch (error) {
          showMessage(`永久删除失败：${error.message}`, true);
        }
      });
      actions.append(deleteButton, permanentDeleteButton);
    } else {
      actions.append(editButton, deleteButton);
    }

    item.append(details, actions);
    linkList.append(item);
  });
}

function renderDashboardStats() {
  const activeLinks = links.filter((row) => !row.deleted_at);
  const deletedLinks = links.filter((row) => Boolean(row.deleted_at));
  const totalClicks = links.reduce(
    (total, row) => total + (Number(row.click_count) || 0),
    0,
  );
  const categoryCounts = new Map();
  activeLinks.forEach((row) => {
    const category = categoryLabels.has(row.category) ? row.category : "all";
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  });

  document.querySelector("#metric-active-links").textContent =
    activeLinks.length.toLocaleString("zh-CN");
  document.querySelector("#metric-total-clicks").textContent =
    totalClicks.toLocaleString("zh-CN");
  document.querySelector("#metric-category-count").textContent =
    categoryCounts.size.toLocaleString("zh-CN");
  document.querySelector("#metric-trash-links").textContent =
    deletedLinks.length.toLocaleString("zh-CN");

  const categoryChart = document.querySelector("#admin-category-chart");
  categoryChart.replaceChildren();
  const maxCategoryCount = Math.max(1, ...categoryCounts.values());
  const sortedCategories = [...categoryCounts.entries()]
    .sort((first, second) => second[1] - first[1]);

  if (!sortedCategories.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "admin-insight-empty";
    emptyMessage.textContent = "添加网址后，这里会显示分类分布。";
    categoryChart.append(emptyMessage);
  } else {
    sortedCategories.forEach(([category, count]) => {
      const row = document.createElement("div");
      row.className = "admin-chart-row";
      const label = document.createElement("span");
      label.className = "admin-chart-label";
      label.textContent = `${categoryIcons.get(category) || "🔗"} ${categoryLabels.get(category)}`;
      const track = document.createElement("span");
      track.className = "admin-chart-track";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", categoryLabels.get(category));
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(maxCategoryCount));
      track.setAttribute("aria-valuenow", String(count));
      const bar = document.createElement("span");
      bar.className = "admin-chart-bar";
      bar.style.width = `${Math.max(5, (count / maxCategoryCount) * 100)}%`;
      track.append(bar);
      const countLabel = document.createElement("strong");
      countLabel.className = "admin-chart-count";
      countLabel.textContent = count.toLocaleString("zh-CN");
      row.append(label, track, countLabel);
      categoryChart.append(row);
    });
  }

  const popularList = document.querySelector("#admin-popular-links");
  popularList.replaceChildren();
  const popularLinks = activeLinks
    .slice()
    .sort((first, second) => (Number(second.click_count) || 0) - (Number(first.click_count) || 0))
    .slice(0, 3);

  if (!popularLinks.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "admin-insight-empty";
    emptyMessage.textContent = "还没有网站数据。";
    popularList.append(emptyMessage);
    return;
  }

  popularLinks.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "admin-popular-item";
    const rank = document.createElement("span");
    rank.className = `admin-popular-rank${index === 0 ? " is-first" : ""}`;
    rank.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "admin-popular-name";
    name.textContent = row.name;
    const clicks = document.createElement("strong");
    clicks.className = "admin-popular-clicks";
    clicks.textContent = `${(Number(row.click_count) || 0).toLocaleString("zh-CN")} 次`;
    item.append(rank, name, clicks);
    popularList.append(item);
  });
}

async function loadLinks() {
  const { data, error } = await supabaseClient
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  links = data || [];
  renderDashboardStats();
  renderLinks();
}

async function updateDeletedAt(row, deletedAt, action) {
  try {
    const { data, error } = await supabaseClient
      .from("links")
      .update({ deleted_at: deletedAt })
      .eq("id", String(row.id))
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`网址未${action}；请检查登录账号和 RLS 权限。`);

    if (deletedAt && linkIdInput.value === String(row.id)) resetLinkForm();
    await loadLinks();
    showMessage(`网址已${action}。`);
  } catch (error) {
    showMessage(`${action}失败：${error.message}`, true);
  }
}

function resetLinkForm() {
  linkForm.reset();
  linkIdInput.value = "";
  linkFormTitle.textContent = "添加网址";
  saveLinkButton.textContent = "添加网址";
  cancelEditButton.hidden = true;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    showMessage("Supabase 客户端未加载，请检查网络连接或页面配置。", true);
    return;
  }

  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.session) throw new Error("登录成功，但没有建立有效会话。");
    if (!isAdminSession(data.session)) {
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) throw signOutError;
      throw new Error(`请使用管理员账号 ${ADMIN_EMAIL} 登录。`);
    }

    setAuthenticated(true);
    await loadLinks();
    showMessage("登录成功。");
  } catch (error) {
    showMessage(`登录或读取网址失败：${error.message}`, true);
  }
});

linkForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let url;
  try {
    url = validateUrl(linkUrlInput.value);
  } catch (error) {
    showMessage(error.message, true);
    linkUrlInput.focus();
    return;
  }

  const name = linkNameInput.value.trim();
  const description = linkDescriptionInput.value.trim();
  if (!name || !description) {
    showMessage("请填写网站名称和网站简介。", true);
    if (!name) linkNameInput.focus();
    else linkDescriptionInput.focus();
    return;
  }

  const values = {
    name,
    url,
    category: linkCategoryInput.value,
    description,
  };
  const editingId = linkIdInput.value;

  try {
    const result = editingId
      ? await supabaseClient
          .from("links")
          .update(values)
          .eq("id", editingId)
          .select("id")
          .maybeSingle()
      : await supabaseClient.from("links").insert(values);
    if (result.error) throw result.error;
    if (editingId && !result.data) {
      throw new Error("网址未更新；请检查登录账号和 RLS 权限。");
    }

    resetLinkForm();
    await loadLinks();
    showMessage(editingId ? "网址已更新。" : "网址已添加。");
  } catch (error) {
    showMessage(`保存失败：${error.message}`, true);
  }
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    setAuthenticated(false);
    resetLinkForm();
    linkList.replaceChildren();
    loginForm.elements.password.value = "";
    showMessage("已退出登录。");
  } catch (error) {
    showMessage(`退出登录失败：${error.message}`, true);
  }
});

cancelEditButton.addEventListener("click", resetLinkForm);

linkViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLinkView = button.dataset.linkView;
    linkViewButtons.forEach((viewButton) => {
      const isActive = viewButton === button;
      viewButton.classList.toggle("is-active", isActive);
      viewButton.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelector("#links-heading").textContent =
      currentLinkView === "trash" ? "回收站中的网址" : "已收录的网址";
    renderLinks();
  });
});

async function initializeAdmin() {
  if (!supabaseClient) {
    showMessage("Supabase 客户端未加载，请检查网络连接或页面配置。", true);
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;

    const isAuthenticated = isAdminSession(data.session);
    if (data.session && !isAuthenticated) {
      await supabaseClient.auth.signOut();
      setAuthenticated(false);
      showMessage(`当前会话不是管理员账号，请使用 ${ADMIN_EMAIL} 登录。`, true);
      return;
    }
    setAuthenticated(isAuthenticated);
    if (isAuthenticated) await loadLinks();
  } catch (error) {
    showMessage(`无法检查登录状态：${error.message}`, true);
  }
}

initializeAdmin();
