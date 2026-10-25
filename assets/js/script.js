(() => {
  "use strict";

  const STORAGE_KEY = "expenseTrackerDemo_v1";
  const DEFAULT_BUDGET = 0;

  const categories = {
    expense: [
      { name: "Food & Dining", icon: "🍜", color: "#fff0e5" },
      { name: "Transportation", icon: "🚗", color: "#e9f2ff" },
      { name: "Shopping", icon: "🛍️", color: "#f5eaff" },
      { name: "Bills & Utilities", icon: "💡", color: "#fff7d9" },
      { name: "Entertainment", icon: "🎬", color: "#ffe9ed" },
      { name: "Health", icon: "💊", color: "#e4f7ed" },
      { name: "Education", icon: "📚", color: "#e7edff" },
      { name: "Other", icon: "✦", color: "#edf1ee" }
    ],
    income: [
      { name: "Salary", icon: "💼", color: "#e4f7ed" },
      { name: "Freelance", icon: "💻", color: "#e9f2ff" },
      { name: "Investment", icon: "📈", color: "#f5eaff" },
      { name: "Gift", icon: "🎁", color: "#ffe9ed" },
      { name: "Other", icon: "✦", color: "#edf1ee" }
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const today = new Date();

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    })
      .format(Number(amount) || 0)
      .replace(/\u00a0/g, " ");
  }

  function formatDate(date) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return "-";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(parsed);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function getCategory(name, type = "") {
    const list = type ? categories[type] || [] : [
      ...categories.expense,
      ...categories.income
    ];

    return list.find((item) => item.name === name) || {
      icon: "✦",
      color: "#edf1ee"
    };
  }

  function sum(items) {
    return items.reduce(
      (total, item) => total + (Number(item.amount) || 0),
      0
    );
  }

  function isThisMonth(dateString) {
    if (!dateString) return false;

    const parts = dateString.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return false;
    }

    return (
      parts[0] === today.getFullYear() &&
      parts[1] === today.getMonth() + 1
    );
  }

  function createInitialState() {
    return {
      transactions: [],
      budget: DEFAULT_BUDGET,
      alerts: true,
      dark: false
    };
  }

  function normalizeTransaction(item) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const amount = Number(item.amount);
    const type = item.type === "income" ? "income" : "expense";

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      typeof item.title !== "string" ||
      !item.title.trim() ||
      typeof item.date !== "string"
    ) {
      return null;
    }

    return {
      id: String(item.id || createId()),
      title: item.title.trim().slice(0, 60),
      amount,
      date: item.date,
      type,
      category: String(item.category || "Other"),
      note: String(item.note || "").slice(0, 100)
    };
  }

  function createId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return createInitialState();
      }

      const saved = JSON.parse(raw);

      if (!saved || !Array.isArray(saved.transactions)) {
        return createInitialState();
      }

      return {
        transactions: saved.transactions
          .map(normalizeTransaction)
          .filter(Boolean),
        budget: Number.isFinite(Number(saved.budget))
          ? Math.max(0, Number(saved.budget))
          : DEFAULT_BUDGET,
        alerts: saved.alerts !== false,
        dark: saved.dark === true
      };
    } catch (error) {
      console.error("Gagal memuat data tersimpan:", error);
      return createInitialState();
    }
  }

  let state = loadState();
  let currentType = "expense";
  let editingId = null;
  let toastCounter = 0;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Gagal menyimpan data:", error);

      showToast(
        "Penyimpanan gagal",
        "Browser tidak dapat menyimpan data. Periksa ruang penyimpanan browser.",
        "warning"
      );

      return false;
    }
  }

  function showToast(title, message, type = "success") {
    const region = $("#toastRegion");

    if (!region) {
      console[type === "warning" ? "warn" : "log"](
        `${title}: ${message}`
      );
      return;
    }

    const toast = document.createElement("div");
    const toastId = ++toastCounter;

    toast.dataset.toastId = String(toastId);
    toast.className = `toast ${type === "warning" ? "warning" : ""}`;

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.textContent = type === "warning" ? "!" : "✓";

    const content = document.createElement("div");
    const heading = document.createElement("strong");
    const paragraph = document.createElement("p");

    heading.textContent = title;
    paragraph.textContent = message;

    content.append(heading, paragraph);
    toast.append(icon, content);
    region.appendChild(toast);

    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(12px)";

      window.setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  function monthTransactions() {
    return state.transactions.filter((item) => isThisMonth(item.date));
  }

  function monthExpenses() {
    return monthTransactions().filter(
      (item) => item.type === "expense"
    );
  }

  function monthIncome() {
    return monthTransactions().filter(
      (item) => item.type === "income"
    );
  }

  function checkBudgetAlert(previousSpent = 0) {
    if (!state.alerts || state.budget <= 0) {
      return;
    }

    const spent = sum(monthExpenses());
    const before = previousSpent / state.budget;
    const ratio = spent / state.budget;

    if (ratio >= 1 && before < 1) {
      showToast(
        "Budget limit reached",
        `Your spending is ${formatCurrency(spent - state.budget)} over the monthly budget.`,
        "warning"
      );
    } else if (ratio >= 0.8 && before < 0.8) {
      showToast(
        "You're getting close to your budget",
        `You've used ${Math.round(ratio * 100)}% of your monthly spending limit.`,
        "warning"
      );
    }
  }

  function renderStats() {
    const income = sum(monthIncome());
    const expenses = sum(monthExpenses());

    $("#totalIncome").textContent = formatCurrency(income);
    $("#totalExpenses").textContent = formatCurrency(expenses);
    $("#totalBalance").textContent = formatCurrency(income - expenses);

    $("#reportSavings").textContent = formatCurrency(income - expenses);
    $("#reportCount").textContent = monthTransactions().length;

    $("#reportAverage").textContent = formatCurrency(
      monthExpenses().length
        ? Math.round(expenses / monthExpenses().length)
        : 0
    );
  }

  function renderTransactionRow(item, showType = false, showActions = false) {
    const category = getCategory(item.category, item.type);
    const typeLabel = item.type === "income" ? "Income" : "Expense";

    const typeColumn = showType
      ? `<td><span class="type-pill ${item.type}">${typeLabel}</span></td>`
      : "";

    const actionsColumn = showActions
      ? `<td>
          <div class="row-actions">
            <button type="button" class="tiny-action" data-edit="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.title)}">Edit</button>
            <button type="button" class="tiny-action" data-delete="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.title)}">Delete</button>
          </div>
        </td>`
      : `<td>
          <button type="button" class="tiny-action" data-edit="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.title)}">···</button>
        </td>`;

    return `
      <tr>
        <td>
          <div class="transaction-name">
            <span class="transaction-symbol" style="background:${category.color}">
              ${category.icon}
            </span>
            <span class="transaction-name-copy">
              <strong>${escapeHTML(item.title)}</strong>
              <span>${escapeHTML(item.note || typeLabel)}</span>
            </span>
          </div>
        </td>
        <td>${escapeHTML(item.category)}</td>
        <td>${formatDate(item.date)}</td>
        ${typeColumn}
        <td class="amount ${item.type}">${formatCurrency(item.amount)}</td>
        ${actionsColumn}
      </tr>
    `;
  }

  function renderRecentTransactions() {
    const items = [...state.transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    $("#recentTransactions").innerHTML = items
      .map((item) => renderTransactionRow(item))
      .join("");

    $("#recentEmpty").classList.toggle("hidden", items.length > 0);
  }

  function renderAllTransactions() {
    const searchInput = $("#transactionSearch");
    const typeInput = $("#typeFilter");
    const categoryInput = $("#categoryFilter");

    if (!searchInput || !typeInput || !categoryInput) {
      return;
    }

    const query = searchInput.value.trim().toLowerCase();
    const type = typeInput.value;
    const category = categoryInput.value;

    const items = [...state.transactions]
      .filter((item) => {
        const searchableText = [
          item.title,
          item.category,
          item.note || ""
        ].join(" ").toLowerCase();

        const matchesQuery = searchableText.includes(query);
        const matchesType = type === "all" || item.type === type;
        const matchesCategory =
          category === "all" || item.category === category;

        return matchesQuery && matchesType && matchesCategory;
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    $("#allTransactions").innerHTML = items
      .map((item) => renderTransactionRow(item, true, true))
      .join("");

    $("#allEmpty").classList.toggle("hidden", items.length > 0);
  }

  function renderBudget() {
    const spent = sum(monthExpenses());
    const budget = state.budget;
    const ratio = budget > 0 ? spent / budget : 0;
    const percent = Math.round(ratio * 1000) / 10;
    const remaining = budget - spent;
    const fillClass = ratio >= 0.8 ? "warning" : "";

    ["#budgetSpent", "#budgetOverviewSpent"].forEach((selector) => {
      $(selector).textContent = formatCurrency(spent);
    });

    ["#budgetLimit", "#budgetOverviewLimit"].forEach((selector) => {
      $(selector).textContent = formatCurrency(budget);
    });

    $("#budgetPercent").textContent =
      budget > 0 ? `${percent}% used` : "No budget set";

    $("#budgetRemaining").textContent =
      budget > 0
        ? remaining >= 0
          ? `${formatCurrency(remaining)} left`
          : `${formatCurrency(Math.abs(remaining))} over budget`
        : "Set a monthly budget";

    $("#budgetProgress").style.width =
      `${Math.min(100, Math.max(0, ratio * 100))}%`;

    $("#budgetProgress").className = `progress-fill ${fillClass}`;

    $("#budgetOverviewProgress").style.width =
      `${Math.min(100, Math.max(0, ratio * 100))}%`;

    $("#budgetOverviewProgress").className = `progress-fill ${fillClass}`;

    $("#budgetOverviewPercent").textContent =
      budget > 0 ? `${percent}% of budget used` : "No budget set";

    $("#budgetOverviewRemaining").textContent =
      budget > 0
        ? remaining >= 0
          ? `${formatCurrency(remaining)} remaining`
          : `${formatCurrency(Math.abs(remaining))} over budget`
        : "Set a monthly budget";

    $("#budgetStatus").textContent =
      budget <= 0
        ? "No budget"
        : ratio >= 1
          ? "Over budget"
          : ratio >= 0.8
            ? "Almost there"
            : "On track";

    $("#budgetStatus").className =
      `status-pill ${budget > 0 && ratio >= 0.8 ? "warning" : ""}`;

    $("#budgetMonthLabel").textContent =
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
      }).format(today);

    const totals = {};

    monthExpenses().forEach((item) => {
      totals[item.category] =
        (totals[item.category] || 0) + Number(item.amount);
    });

    const entries = Object.entries(totals)
      .sort((a, b) => b[1] - a[1]);

    const categoryMarkup = entries.length
      ? entries.map(([name, amount]) => {
          const category = getCategory(name, "expense");
          const cap = Math.max(amount * 1.25, 500000);
          const percentOfCategory = Math.min(100, amount / cap * 100);
          const percentOfTotal = Math.round(amount / Math.max(spent, 1) * 100);

          return `
            <div class="budget-category">
              <span class="category-icon" style="background:${category.color}">
                ${category.icon}
              </span>
              <div class="category-info">
                <div class="category-info-top">
                  <strong>${escapeHTML(name)}</strong>
                  <span>${formatCurrency(amount)}</span>
                </div>
                <div class="progress-track category-progress">
                  <div class="progress-fill" style="width:${percentOfCategory}%"></div>
                </div>
              </div>
              <span class="category-amount">${percentOfTotal}%</span>
            </div>
          `;
        }).join("")
      : `<div class="empty-state">Add expenses to see category insights.</div>`;

    $("#budgetCategoryList").innerHTML = categoryMarkup;

    $("#categoryBudgetList").innerHTML = entries.length
      ? entries.map(([name, amount]) => {
          const category = getCategory(name, "expense");
          const share = spent > 0 ? amount / spent * 100 : 0;
          const categoryLimit = Math.round(budget * share / 100);
          const over = budget > 0 && amount > categoryLimit;

          return `
            <div class="category-budget-item">
              <span class="category-icon" style="background:${category.color}">
                ${category.icon}
              </span>
              <div class="category-info">
                <div class="category-info-top">
                  <strong>${escapeHTML(name)}</strong>
                  <span>${Math.round(share)}% of spending</span>
                </div>
                <div class="progress-track category-progress">
                  <div class="progress-fill ${over ? "warning" : ""}" style="width:${Math.min(100, share)}%"></div>
                </div>
              </div>
              <div class="category-budget-right">
                <strong>${formatCurrency(amount)}</strong>
                <span>${formatCurrency(categoryLimit)} suggested share</span>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="empty-state">No expenses recorded for this month yet.</div>`;
  }

  function renderReports() {
    const expenses = monthExpenses();
    const totals = {};

    expenses.forEach((item) => {
      totals[item.category] =
        (totals[item.category] || 0) + Number(item.amount);
    });

    const entries = Object.entries(totals)
      .sort((a, b) => b[1] - a[1]);

    const total = sum(expenses);

    $("#reportBreakdown").innerHTML = entries.length
      ? entries.map(([name, amount]) => {
          const category = getCategory(name, "expense");
          const percent = total > 0 ? amount / total * 100 : 0;

          return `
            <div class="report-row">
              <span class="category-icon" style="background:${category.color}">
                ${category.icon}
              </span>
              <div class="report-row-main">
                <div>
                  <strong>${escapeHTML(name)}</strong>
                  <span>${Math.round(percent)}%</span>
                </div>
                <div class="progress-track category-progress">
                  <div class="progress-fill" style="width:${percent}%"></div>
                </div>
              </div>
              <span class="report-row-amount">${formatCurrency(amount)}</span>
            </div>
          `;
        }).join("")
      : `<div class="empty-state">Add some expenses to build your report.</div>`;
  }

  function updateFormCategories(selected = "") {
    const options = categories[currentType];
    const select = $("#transactionCategory");

    select.innerHTML = options.map((item) => `
      <option value="${escapeHTML(item.name)}">${item.icon} ${escapeHTML(item.name)}</option>
    `).join("");

    if (selected && options.some((item) => item.name === selected)) {
      select.value = selected;
    }
  }

  function renderCategoryOptions() {
    const allCategories = [
      ...new Set([
        ...categories.expense,
        ...categories.income
      ].map((item) => item.name))
    ];

    const filter = $("#categoryFilter");
    const previousValue = filter.value;

    filter.innerHTML = `
      <option value="all">All categories</option>
      ${allCategories.map((name) => `
        <option value="${escapeHTML(name)}">${escapeHTML(name)}</option>
      `).join("")}
    `;

    if (allCategories.includes(previousValue)) {
      filter.value = previousValue;
    }

    updateFormCategories();
  }

  function renderChart() {
    const canvas = $("#cashflowChart");

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const count = Number($("#chartPeriod").value || 6);

    const monthNames = new Intl.DateTimeFormat("en-US", {
      month: "short"
    });

    const points = [];

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const items = state.transactions.filter((item) => {
        const parts = item.date.split("-").map(Number);

        return parts[0] === year && parts[1] === month + 1;
      });

      points.push({
        label: monthNames.format(date),
        income: sum(items.filter((item) => item.type === "income")),
        expense: sum(items.filter((item) => item.type === "expense"))
      });
    }

    const max = Math.max(
      1000000,
      ...points.flatMap((point) => [point.income, point.expense])
    ) * 1.15;

    const left = 42;
    const right = 8;
    const top = 10;
    const bottom = 28;

    const plotWidth = Math.max(0, width - left - right);
    const plotHeight = Math.max(0, height - top - bottom);

    ctx.clearRect(0, 0, width, height);
    ctx.font = "9px DM Sans, sans-serif";
    ctx.textBaseline = "middle";

    const css = getComputedStyle(document.body);
    const gridColor = css.getPropertyValue("--line").trim() || "#e8eeeb";
    const textColor = css.getPropertyValue("--muted").trim() || "#87958d";

    for (let i = 0; i <= 4; i++) {
      const y = top + plotHeight * i / 4;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(width - right, y);
      ctx.stroke();

      const value = max * (1 - i / 4);

      ctx.fillStyle = textColor;
      ctx.textAlign = "right";

      ctx.fillText(
        value >= 1000000
          ? `${(value / 1000000).toFixed(1)}m`
          : `${Math.round(value / 1000)}k`,
        left - 8,
        y
      );
    }

    const groupWidth = plotWidth / count;
    const barWidth = Math.min(13, groupWidth * 0.24);

    points.forEach((point, index) => {
      const center = left + groupWidth * (index + 0.5);
      const incomeHeight = point.income / max * plotHeight;
      const expenseHeight = point.expense / max * plotHeight;

      ctx.fillStyle = "#23835e";

      roundRect(
        ctx,
        center - barWidth - 2,
        top + plotHeight - incomeHeight,
        barWidth,
        incomeHeight,
        4
      );

      ctx.fillStyle = "#f2a06c";

      roundRect(
        ctx,
        center + 2,
        top + plotHeight - expenseHeight,
        barWidth,
        expenseHeight,
        4
      );

      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.fillText(point.label, center, height - 11);
    });
  }

  function roundRect(ctx, x, y, width, height, radius) {
    if (height <= 0 || width <= 0) {
      return;
    }

    const r = Math.min(radius, width / 2, height);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fill();
  }

  function renderAll() {
    renderStats();
    renderRecentTransactions();
    renderAllTransactions();
    renderBudget();
    renderReports();
    renderChart();
  }

  function openTransactionModal(item = null) {
    editingId = item ? item.id : null;
    currentType = item ? item.type : "expense";

    $("#transactionForm").reset();
    $("#transactionId").value = item ? item.id : "";
    $("#transactionTitle").value = item ? item.title : "";
    $("#transactionAmount").value = item ? item.amount : "";
    $("#transactionDate").value = item ? item.date : localDateString();
    $("#transactionNote").value = item ? item.note || "" : "";

    $$(".type-choice").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.type === currentType
      );
    });

    updateFormCategories(item ? item.category : "");

    $("#modalTitle").textContent = item
      ? "Edit transaction"
      : "Add transaction";

    $("#saveTransactionButton").innerHTML = item
      ? "Save changes <span>→</span>"
      : "Save transaction <span>→</span>";

    $("#transactionModal").classList.add("open");
    $("#transactionModal").setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    window.setTimeout(() => $("#transactionTitle").focus(), 100);
  }

  function closeTransactionModal() {
    $("#transactionModal").classList.remove("open");
    $("#transactionModal").setAttribute("aria-hidden", "true");

    if (!$("#budgetModal").classList.contains("open")) {
      document.body.style.overflow = "";
    }

    editingId = null;
  }

  function openBudgetModal() {
    $("#monthlyLimitInput").value = state.budget || "";

    $("#budgetModal").classList.add("open");
    $("#budgetModal").setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    window.setTimeout(() => $("#monthlyLimitInput").focus(), 100);
  }

  function closeBudgetModal() {
    $("#budgetModal").classList.remove("open");
    $("#budgetModal").setAttribute("aria-hidden", "true");

    if (!$("#transactionModal").classList.contains("open")) {
      document.body.style.overflow = "";
    }
  }

  function switchPage(page) {
    const target = $(`#page-${page}`);

    if (!target) return;

    $$(".page-view").forEach((view) => {
      view.classList.toggle("active", view === target);
    });

    $$(".nav-item[data-page]").forEach((item) => {
      item.classList.toggle("active", item.dataset.page === page);
    });

    const labels = {
      dashboard: "Dashboard",
      transactions: "Transactions",
      budgets: "Monthly budget",
      reports: "Reports",
      settings: "Settings"
    };

    $("#breadcrumbCurrent").textContent = labels[page] || "Dashboard";

    if (page === "reports") {
      renderReports();
    }

    if (page === "budgets") {
      renderBudget();
    }

    if (page === "dashboard") {
      window.setTimeout(renderChart, 50);
    }

    $("#sidebar").classList.remove("open");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function renderNotifications() {
    const spent = sum(monthExpenses());
    const ratio = state.budget > 0 ? spent / state.budget : 0;

    let content = `
      <div class="notification-item">
        <span>✦</span>
        <div>
          <strong>Welcome to Expense Tracker</strong>
          <p>Your demo data is stored locally in this browser.</p>
        </div>
      </div>
    `;

    if (state.budget > 0 && ratio >= 0.8) {
      content += `
        <div class="notification-item">
          <span>!</span>
          <div>
            <strong>Budget reminder</strong>
            <p>You've used ${Math.round(ratio * 100)}% of your monthly budget.</p>
          </div>
        </div>
      `;
    } else {
      content += `
        <div class="notification-item">
          <span>✓</span>
          <div>
            <strong>You're on track</strong>
            <p>${state.budget > 0
              ? "Your spending is currently within your monthly limit."
              : "Set a monthly budget to track your spending."}</p>
          </div>
        </div>
      `;
    }

    $("#notificationContent").innerHTML = content;
  }

  function bindEvents() {
    $("#addTransactionButton").addEventListener("click", () => {
      openTransactionModal();
    });

    $("#addTransactionButton2").addEventListener("click", () => {
      openTransactionModal();
    });

    $("#closeModal").addEventListener("click", closeTransactionModal);
    $("#cancelModal").addEventListener("click", closeTransactionModal);

    $("#transactionModal").addEventListener("click", (event) => {
      if (event.target === $("#transactionModal")) {
        closeTransactionModal();
      }
    });

    $("#closeBudgetModal").addEventListener("click", closeBudgetModal);
    $("#cancelBudgetModal").addEventListener("click", closeBudgetModal);

    $("#budgetModal").addEventListener("click", (event) => {
      if (event.target === $("#budgetModal")) {
        closeBudgetModal();
      }
    });

    $("#editBudgetButton").addEventListener("click", openBudgetModal);
    $("#chartPeriod").addEventListener("change", renderChart);

    $("#transactionSearch").addEventListener("input", renderAllTransactions);
    $("#typeFilter").addEventListener("change", renderAllTransactions);
    $("#categoryFilter").addEventListener("change", renderAllTransactions);

    $("#mobileMenu").addEventListener("click", () => {
      $("#sidebar").classList.toggle("open");
    });

    $("#notificationButton").addEventListener("click", () => {
      renderNotifications();
      $("#notificationPopover").classList.toggle("hidden");
    });

    $("#closeNotifications").addEventListener("click", () => {
      $("#notificationPopover").classList.add("hidden");
    });

    $("#tipsButton").addEventListener("click", () => {
      showToast(
        "Money tip",
        "Try reviewing your spending once a week and give each category a realistic limit."
      );
    });

    $("#themeToggle").checked = state.dark;
    $("#alertsToggle").checked = state.alerts;

    document.body.classList.toggle("dark-theme", state.dark);

    $("#themeToggle").addEventListener("change", (event) => {
      const previousDark = state.dark;

      state.dark = event.target.checked;

      if (!saveState()) {
        state.dark = previousDark;
        event.target.checked = previousDark;
        document.body.classList.toggle("dark-theme", previousDark);
        return;
      }

      document.body.classList.toggle("dark-theme", state.dark);
      renderChart();
    });

    $("#alertsToggle").addEventListener("change", (event) => {
      const previousAlerts = state.alerts;
      state.alerts = event.target.checked;

      if (!saveState()) {
        state.alerts = previousAlerts;
        event.target.checked = previousAlerts;
        return;
      }

      showToast(
        "Preferences saved",
        state.alerts
          ? "Budget alerts are enabled."
          : "Budget alerts are disabled."
      );
    });

    $$(".nav-item[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        switchPage(button.dataset.page);
      });
    });

    $$("[data-goto]").forEach((button) => {
      button.addEventListener("click", () => {
        switchPage(button.dataset.goto);
      });
    });

    $$(".type-choice").forEach((button) => {
      button.addEventListener("click", () => {
        currentType = button.dataset.type;

        $$(".type-choice").forEach((choice) => {
          choice.classList.toggle("active", choice === button);
        });

        updateFormCategories();
      });
    });

    $("#transactionForm").addEventListener("submit", (event) => {
      event.preventDefault();

      const title = $("#transactionTitle").value.trim();
      const amount = Number($("#transactionAmount").value);
      const date = $("#transactionDate").value;
      const category = $("#transactionCategory").value;
      const note = $("#transactionNote").value.trim();

      if (
        !title ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !date ||
        !category
      ) {
        showToast(
          "Check your input",
          "Enter a name, a valid amount, a category, and a date.",
          "warning"
        );
        return;
      }

      const previousSpent = sum(monthExpenses());

      const item = {
        id: editingId || createId(),
        title,
        amount,
        date,
        type: currentType,
        category,
        note
      };

      const previousTransactions = state.transactions.map((entry) => ({
        ...entry
      }));

      if (editingId) {
        const exists = state.transactions.some(
          (entry) => entry.id === editingId
        );

        if (!exists) {
          showToast(
            "Transaction not found",
            "The transaction may have been deleted.",
            "warning"
          );
          closeTransactionModal();
          renderAll();
          return;
        }

        state.transactions = state.transactions.map((entry) =>
          entry.id === editingId ? item : entry
        );
      } else {
        state.transactions.push(item);
      }

      if (!saveState()) {
        state.transactions = previousTransactions;
        renderAll();
        return;
      }

      const wasEditing = Boolean(editingId);

      closeTransactionModal();
      renderAll();
      checkBudgetAlert(previousSpent);

      showToast(
        wasEditing ? "Transaction updated" : "Transaction added",
        `${item.title} · ${formatCurrency(item.amount)}`
      );
    });

    $("#budgetForm").addEventListener("submit", (event) => {
      event.preventDefault();

      const value = Number($("#monthlyLimitInput").value);

      if (!Number.isFinite(value) || value <= 0) {
        showToast(
          "Invalid budget",
          "Enter a budget greater than zero.",
          "warning"
        );
        return;
      }

      const previousBudget = state.budget;
      state.budget = value;

      if (!saveState()) {
        state.budget = previousBudget;
        renderAll();
        return;
      }

      closeBudgetModal();
      renderAll();

      showToast(
        "Budget updated",
        `Your monthly limit is now ${formatCurrency(value)}.`
      );

      checkBudgetAlert(0);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const editButton = target.closest("[data-edit]");

      if (editButton) {
        const item = state.transactions.find(
          (entry) => entry.id === editButton.dataset.edit
        );

        if (item) {
          openTransactionModal(item);
        }

        return;
      }

      const deleteButton = target.closest("[data-delete]");

      if (!deleteButton) {
        return;
      }

      const item = state.transactions.find(
        (entry) => entry.id === deleteButton.dataset.delete
      );

      if (!item) {
        return;
      }

      if (!window.confirm(`Delete "${item.title}"?`)) {
        return;
      }

      const previousTransactions = state.transactions.map((entry) => ({
        ...entry
      }));

      state.transactions = state.transactions.filter(
        (entry) => entry.id !== item.id
      );

      if (!saveState()) {
        state.transactions = previousTransactions;
        renderAll();
        return;
      }

      renderAll();

      showToast(
        "Transaction deleted",
        `${item.title} has been removed.`
      );
    });

    $("#resetDemoButton").addEventListener("click", () => {
      const confirmed = window.confirm(
        "Reset all transactions, budget, and preferences? This action cannot be undone."
      );

      if (!confirmed) {
        return;
      }

      const previousState = state;

      state = createInitialState();

      if (!saveState()) {
        state = previousState;
        renderAll();
        return;
      }

      $("#transactionSearch").value = "";
      $("#typeFilter").value = "all";
      $("#categoryFilter").value = "all";
      $("#themeToggle").checked = false;
      $("#alertsToggle").checked = true;

      document.body.classList.remove("dark-theme");

      renderAll();

      showToast(
        "Data reset",
        "Transactions, budget, and preferences have been reset."
      );
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeTransactionModal();
        closeBudgetModal();

        $("#notificationPopover").classList.add("hidden");
        $("#sidebar").classList.remove("open");
      }

      if (
        event.key === "Tab" &&
        $("#transactionModal").classList.contains("open")
      ) {
        trapModalFocus(event, $("#transactionModal"));
      } else if (
        event.key === "Tab" &&
        $("#budgetModal").classList.contains("open")
      ) {
        trapModalFocus(event, $("#budgetModal"));
      }
    });

    let resizeTimer;

    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(renderChart, 100);
    });
  }

  function trapModalFocus(event, modal) {
    const focusable = [
      ...modal.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
    ].filter((element) => element.offsetParent !== null);

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function init() {
    $("#todayLabel").textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short"
    }).format(today);

    renderCategoryOptions();
    bindEvents();
    renderAll();
  }

  init();
})();