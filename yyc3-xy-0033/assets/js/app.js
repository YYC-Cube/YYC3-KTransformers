// assets/js/app.js

// 可用页面
const PAGES = ["home", "homework", "courses", "activities", "messages", "growth", "settings"];

// 本地存储 key
const STORAGE_KEY = "yunduoAppStateV1";

// 全局状态（可持久化）
const defaultState = {
  currentPage: "home",
  homeworkFilter: "pending", // pending | done | review
  homeworkCompleted: {}, // { taskId: true }
  dailyPlanCompleted: {}, // { planId: true }
  courseFilter: "all", // all | 语文 | 数学 | 科学 | 艺术 | 素质拓展
  courseKeyword: "",
  activityTab: "ongoing", // ongoing | history
  settings: {
    eyeMode: true,
    reminder: false,
  },
  readMessages: {}, // { messageId: true }
};

let appState = JSON.parse(JSON.stringify(defaultState));

// ---------------------- 作业数据模型 ----------------------
const HOMEWORK_TASKS = [
  {
    id: "math-100",
    subject: "数学",
    subjectIcon: "📐",
    title: "100以内加减法口算",
    description: "完成 20 题口算练习，限时 10 分钟。",
    urgency: "high", // high | normal | low
    baseStatus: "pending", // pending | review
    dueText: "今天 18:00",
    dueStatus: "today", // today | tomorrow | later
    actionLabel: "立即开始",
  },
  {
    id: "cn-dictation",
    subject: "语文",
    subjectIcon: "📚",
    title: "第 5 课生字听写",
    description: "准备好纸笔，点击开始听写。",
    urgency: "normal",
    baseStatus: "pending",
    dueText: "明天 21:00",
    dueStatus: "tomorrow",
    actionLabel: "开始听写",
  },
  {
    id: "reading-habit",
    subject: "阅读",
    subjectIcon: "📖",
    title: "睡前绘本阅读打卡",
    description: "阅读一本喜欢的绘本并记录 3 句感受。",
    urgency: "low",
    baseStatus: "review",
    dueText: "后天",
    dueStatus: "later",
    actionLabel: "去打卡",
  },
];

// ---------------------- 状态持久化 ----------------------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return;

    // 浅合并到默认状态里，避免老版本字段缺失
    Object.keys(saved).forEach((key) => {
      if (!(key in defaultState)) return;
      const val = saved[key];
      if (val && typeof val === "object" && !Array.isArray(val)) {
        appState[key] = { ...appState[key], ...val };
      } else {
        appState[key] = val;
      }
    });
  } catch (e) {
    console.warn("无法加载本地学习状态：", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("无法保存学习状态：", e);
  }
}

loadState();

// ---------------------- 页面切换 ----------------------
function switchPage(page) {
  if (!PAGES.includes(page)) return;

  appState.currentPage = page;

  // header 显隐
  PAGES.forEach((p) => {
    const show = p === page;
    document
      .querySelectorAll(`header[data-page="${p}"]`)
      .forEach((el) => el.classList.toggle("hidden", !show));
  });

  // 主内容 section 显隐
  PAGES.forEach((p) => {
    const show = p === page;
    document
      .querySelectorAll(`section.page-section[data-page="${p}"]`)
      .forEach((el) => el.classList.toggle("hidden", !show));
  });

  // 底部导航激活态
  document.querySelectorAll("[data-nav]").forEach((nav) => {
    nav.classList.toggle("nav-active", nav.dataset.nav === page);
  });

  saveState();
}

// 导出给 HTML 内联调用
window.switchPage = switchPage;

// ---------------------- 顶部时间 / 日期 ----------------------
function updateClock() {
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  if (!clockEl || !dateEl) return;

  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");

  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = now.getDay();
  const weekNames = ["日", "一", "二", "三", "四", "五", "六"];

  clockEl.textContent = `${h}:${m}`;
  dateEl.textContent = `${month}月${day}日 星期${weekNames[weekDay]}`;
}

function initClock() {
  updateClock();
  setInterval(updateClock, 30 * 1000);
}

// ---------------------- Toast 提示 ----------------------
let toastTimer = null;

function showToast(message) {
  const toastEl = document.getElementById("app-toast");
  if (!toastEl) return;
  toastEl.textContent = message;

  toastEl.classList.remove("hidden", "opacity-0");
  toastEl.classList.add("opacity-100");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("opacity-100");
    toastEl.classList.add("opacity-0");
    setTimeout(() => toastEl.classList.add("hidden"), 300);
  }, 2000);
}

// ---------------------- 设置：护眼模式 & 提醒 ----------------------
function setToggleUI(el, isOn) {
  el.classList.toggle("on", isOn);
  el.classList.toggle("off", !isOn);
}

function applyEyeMode(isOn) {
  document.body.classList.toggle("eye-mode", isOn);
}

function initSettings() {
  const eyeEl = document.getElementById("eye-mode-toggle");
  const remEl = document.getElementById("reminder-toggle");

  if (eyeEl) {
    setToggleUI(eyeEl, appState.settings.eyeMode);
  }
  if (remEl) {
    setToggleUI(remEl, appState.settings.reminder);
  }

  applyEyeMode(appState.settings.eyeMode);
}

function toggleSetting(elementId, settingKey) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const currentlyOn = el.classList.contains("on");
  const nextOn = !currentlyOn;

  setToggleUI(el, nextOn);

  if (settingKey === "eyeMode") {
    appState.settings.eyeMode = nextOn;
    applyEyeMode(nextOn);
  } else if (settingKey === "reminder") {
    appState.settings.reminder = nextOn;
    showToast(nextOn ? "已开启每日学习提醒" : "已关闭每日学习提醒");
  }

  saveState();
}

window.toggleSetting = toggleSetting;

// ---------------------- 首页：今日计划 ----------------------
function initDailyPlan() {
  const items = document.querySelectorAll(".daily-plan-item");
  if (!items.length) return;

  items.forEach((item) => {
    const id = item.dataset.planId;
    if (!id) return;

    const defaultDone = item.dataset.planDefault === "done";
    const stored = appState.dailyPlanCompleted[id];
    const isDone = typeof stored === "boolean" ? stored : defaultDone;

    item.classList.toggle("completed", isDone);

    item.addEventListener("click", () => {
      const nowDone = !item.classList.contains("completed");
      item.classList.toggle("completed", nowDone);
      appState.dailyPlanCompleted[id] = nowDone;
      saveState();
    });
  });
}

// ---------------------- 作业模块 ----------------------
function getHomeworkStatus(task) {
  if (appState.homeworkCompleted[task.id]) return "done";
  return task.baseStatus;
}

function getHomeworkCardClass(task, status) {
  let base =
    "rounded-3xl p-6 shadow-soft transition-all cursor-pointer border-l-8 mb-4 ";
  if (task.urgency === "high") {
    base += "bg-macaron-orange border-orange-400 hover:shadow-lg";
  } else if (task.urgency === "normal") {
    base += "bg-macaron-yellow border-yellow-400 hover:shadow-lg";
  } else {
    base += "bg-macaron-green border-green-400 hover:shadow-lg";
  }
  if (status === "done") {
    base += " opacity-80";
  }
  return base;
}

function buildHomeworkCardContent(task, status) {
  const statusTag = (() => {
    if (status === "done") return "已完成";
    if (task.urgency === "high") return "紧急";
    if (task.urgency === "normal") return "正常";
    return "低";
  })();

  const statusTagColor = (() => {
    if (status === "done") return "bg-green-100 text-green-700";
    if (task.urgency === "high") return "bg-orange-100 text-orange-700";
    if (task.urgency === "normal") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  })();

  const subjectDisplay = `${task.subjectIcon || ""} ${task.subject}`;

  const dueColor =
    task.dueStatus === "today"
      ? "text-red-500"
      : task.dueStatus === "tomorrow"
      ? "text-green-500"
      : "text-slate-500";

  const buttonLabel =
    status === "done" ? "已完成" : task.actionLabel || "开始任务";

  const buttonExtraClass =
    status === "done"
      ? "bg-slate-300 cursor-not-allowed"
      : "bg-warm-orange hover:bg-orange-500";

  const buttonDisabled = status === "done" ? "disabled" : "";

  return `
    <div class="flex items-center justify-between mb-3">
      <span class="${statusTagColor} text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
        <i class="ri-alarm-fill"></i>
        ${statusTag}
      </span>
      <span class="text-xs text-slate-700 font-medium">${subjectDisplay}</span>
    </div>

    <h4 class="text-2xl font-bold mb-2 text-slate-800">${task.title}</h4>
    <p class="text-slate-600 text-sm mb-4">${task.description}</p>

    <div class="flex items-center gap-2 ${dueColor} font-medium mb-4 p-2 bg-white rounded-xl shadow-inner">
      <i class="ri-calendar-check-line text-lg"></i>
      <span class="text-sm">截止日期：${task.dueText}</span>
    </div>

    <button
      class="w-full ${buttonExtraClass} text-white py-3 rounded-full font-extrabold text-lg transition shadow-md active:scale-95"
      data-homework-action="1"
      data-task-id="${task.id}"
      ${buttonDisabled}
    >
      ${buttonLabel}
    </button>
  `;
}

function renderHomework() {
  const container = document.getElementById("homework-list");
  if (!container) return;

  container.innerHTML = "";

  const counts = { pending: 0, done: 0, review: 0 };

  HOMEWORK_TASKS.forEach((task) => {
    const status = getHomeworkStatus(task);
    if (counts[status] != null) counts[status]++;
  });

  const filter = appState.homeworkFilter || "pending";

  HOMEWORK_TASKS.forEach((task) => {
    const status = getHomeworkStatus(task);
    if (status !== filter) return;

    const card = document.createElement("article");
    card.className = getHomeworkCardClass(task, status);
    card.dataset.taskId = task.id;
    card.innerHTML = buildHomeworkCardContent(task, status);
    container.appendChild(card);
  });

  if (!container.children.length) {
    const empty = document.createElement("div");
    empty.className =
      "col-span-1 md:col-span-2 text-center text-slate-400 bg-white/60 rounded-3xl py-10";
    empty.textContent = "暂时没有对应的作业任务～";
    container.appendChild(empty);
  }

  // 更新 Tab 文案 + 高亮
  const labelMap = {
    pending: "待完成",
    done: "已完成",
    review: "待批改",
  };

  document.querySelectorAll("[data-homework-filter]").forEach((btn) => {
    const key = btn.dataset.homeworkFilter;
    const label = labelMap[key] || "";
    const count = counts[key] || 0;
    btn.textContent = `${label} (${count})`;
    btn.classList.toggle("tab-active", key === filter);
  });

  // 绑定按钮逻辑
  container.querySelectorAll("[data-homework-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.taskId;
      if (!id) return;
      const task = HOMEWORK_TASKS.find((t) => t.id === id);
      if (!task) return;
      const status = getHomeworkStatus(task);
      if (status === "done") return;

      // 简单模拟：点击按钮即视为完成
      appState.homeworkCompleted[id] = true;
      saveState();
      showToast("太棒了，本次作业已标记完成！");
      renderHomework();
    });
  });
}

function initHomework() {
  // tab 切换
  document.querySelectorAll("[data-homework-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.homeworkFilter;
      if (!filter) return;
      appState.homeworkFilter = filter;
      saveState();
      renderHomework();
    });
  });

  if (!appState.homeworkFilter) {
    appState.homeworkFilter = "pending";
  }

  renderHomework();
}

// ---------------------- 课程模块：分类 + 搜索 ----------------------
function renderCourses() {
  const active = appState.courseFilter || "all";
  const keyword = (appState.courseKeyword || "").toLowerCase();
  const cards = document.querySelectorAll("[data-course-category]");

  cards.forEach((card) => {
    const category = card.dataset.courseCategory || "其他";
    const text = card.innerText.toLowerCase();
    const matchCategory = active === "all" || category === active;
    const matchKeyword = !keyword || text.includes(keyword);
    const show = matchCategory && matchKeyword;
    card.classList.toggle("hidden", !show);
  });
}

function updateCourseFilterUI() {
  const active = appState.courseFilter || "all";
  document.querySelectorAll("[data-course-filter]").forEach((btn) => {
    btn.classList.toggle(
      "course-filter-active",
      btn.dataset.courseFilter === active
    );
  });
  renderCourses();
}

function initCourses() {
  // 分类按钮
  document.querySelectorAll("[data-course-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.courseFilter || "all";
      appState.courseFilter = type;
      saveState();
      updateCourseFilterUI();
    });
  });

  // 搜索输入
  const searchInput = document.getElementById("course-search");
  if (searchInput) {
    searchInput.value = appState.courseKeyword || "";
    searchInput.addEventListener("input", () => {
      appState.courseKeyword = searchInput.value.trim().toLowerCase();
      saveState();
      renderCourses();
    });
  }

  updateCourseFilterUI();
}

// ---------------------- 公益活动：tab 切换 ----------------------
function renderActivitiesTab() {
  const active = appState.activityTab || "ongoing";

  document.querySelectorAll("[data-activity-tab]").forEach((btn) => {
    btn.classList.toggle("tab-active-activities", btn.dataset.activityTab === active);
  });

  const ongoing = document.getElementById("activities-ongoing");
  const history = document.getElementById("activities-history");

  if (ongoing && history) {
    if (active === "ongoing") {
      ongoing.classList.remove("hidden");
      history.classList.add("hidden");
    } else {
      ongoing.classList.add("hidden");
      history.classList.remove("hidden");
    }
  }
}

function initActivities() {
  document.querySelectorAll("[data-activity-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.activityTab || "ongoing";
      appState.activityTab = tab;
      saveState();
      renderActivitiesTab();
    });
  });

  renderActivitiesTab();
}

// ---------------------- 消息模块：已读 / 未读 & 底部红点 ----------------------
function markMessageElementAsRead(el) {
  el.classList.remove("unread-bg");
  el.classList.add("opacity-80");
}

function updateNavMessageDot() {
  const dot = document.getElementById("nav-message-dot");
  if (!dot) return;

  const hasUnread =
    document.querySelector(".unread-bg[data-message-id]") !== null;
  dot.classList.toggle("hidden", !hasUnread);
}

function markMessageRead(id) {
  const el = document.querySelector(`[data-message-id="${id}"]`);
  if (!el) return;
  if (appState.readMessages[id] === true) return;

  appState.readMessages[id] = true;
  markMessageElementAsRead(el);
  saveState();
  updateNavMessageDot();
}

function initMessages() {
  const messageEls = document.querySelectorAll("[data-message-id]");
  if (!messageEls.length) return;

  messageEls.forEach((el) => {
    const id = el.dataset.messageId;
    if (!id) return;

    const isRead = appState.readMessages[id] === true;
    if (isRead) {
      markMessageElementAsRead(el);
    }

    el.addEventListener("click", () => markMessageRead(id));
  });

  updateNavMessageDot();
}

// ---------------------- 初始化入口 ----------------------
document.addEventListener("DOMContentLoaded", () => {
  initClock();

  // 先根据持久化状态切换页面
  const initialPage = PAGES.includes(appState.currentPage)
    ? appState.currentPage
    : "home";
  switchPage(initialPage);

  initSettings();
  initDailyPlan();
  initHomework();
  initCourses();
  initActivities();
  initMessages();
});
