const amalData = [
  {
    category: "🕌 Fardu — Keutamaan Pertama",
    items: [
      "Solat Subuh",
      "Solat Zohor",
      "Solat Asar",
      "Solat Maghrib",
      "Solat Isyak"
    ]
  },
  {
    category: "🤲 Sunnah yang Sangat Dituntut",
    items: [
      "Tahajjud",
      "Witir",
      "Qabliyah Subuh",
      "Solat Dhuha",
      "Rawatib",
      "Membaca al-Quran",
      "Tadabbur al-Quran",
      "Zikir pagi & petang",
      "Istighfar",
      "Selawat"
    ]
  },
  {
    category: "❤️ Akhlak Seorang Muslim",
    items: [
      "Menjaga lisan",
      "Menjaga pandangan",
      "Menunaikan amanah",
      "Menepati janji",
      "Berbuat baik kepada ibu bapa",
      "Berbuat baik kepada pasangan & keluarga",
      "Membantu orang lain",
      "Bersangka baik",
      "Bersyukur"
    ]
  },
  {
    category: "💰 Muamalat",
    items: [
      "Bersedekah",
      "Mencari rezeki yang halal",
      "Mengelakkan pembaziran"
    ]
  },
  {
    category: "📚 Ilmu",
    items: [
      "Menuntut ilmu",
      "Berkongsi ilmu"
    ]
  },
  {
    category: "🌙 Muhasabah",
    items: [
      "Muhasabah diri",
      "Memohon keampunan Allah",
      "Tidur dalam keadaan berwuduk"
    ]
  }
];

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const todayKey = getTodayKey();
let activeDashboardView = "daily";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

function startApp() {
  showScreen("introScreen");
}

function goDashboard() {
  showScreen("dashboardScreen");
  renderDate();
  renderChecklist();
  updateDashboard();
}

function renderDate() {
  const date = new Date();

  document.getElementById("todayDate").textContent = date.toLocaleDateString("ms-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getSavedData() {
  return getSavedDataByKey(todayKey);
}

function getSavedDataByKey(dateKey) {
  return JSON.parse(localStorage.getItem(`amal-${dateKey}`)) || {};
}

function saveData(data) {
  localStorage.setItem(`amal-${todayKey}`, JSON.stringify(data));
}

function renderChecklist() {
  const container = document.getElementById("checklistContainer");
  const savedData = getSavedData();

  container.innerHTML = "";

  amalData.forEach(group => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";

    const title = document.createElement("h3");
    title.textContent = group.category;
    categoryDiv.appendChild(title);

    group.items.forEach(item => {
      const row = document.createElement("label");
      row.className = "item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = savedData[item] || false;
      checkbox.onchange = () => {
        const currentData = getSavedData();
        currentData[item] = checkbox.checked;
        saveData(currentData);
        updateDashboard();
      };

      const text = document.createElement("span");
      text.textContent = item;

      row.appendChild(checkbox);
      row.appendChild(text);
      categoryDiv.appendChild(row);
    });

    container.appendChild(categoryDiv);
  });
}

function getTotalItems() {
  return amalData.reduce((total, group) => total + group.items.length, 0);
}

function getCheckedCount() {
  const savedData = getSavedData();

  return Object.values(savedData).filter(Boolean).length;
}

function getCheckedCountByKey(dateKey) {
  const savedData = getSavedDataByKey(dateKey);

  return Object.values(savedData).filter(Boolean).length;
}

function getRecordedDayCount(dateKeys) {
  return dateKeys.filter(dateKey => localStorage.getItem(`amal-${dateKey}`)).length;
}

function updateProgress() {
  const total = getTotalItems();
  const checked = getCheckedCount();
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  document.getElementById("summaryText").textContent =
    `${checked} daripada ${total} amalan ditanda`;

  document.getElementById("progressBar").style.width = `${percent}%`;
}

function updateDashboard() {
  updateProgress();
  renderWeeklyDashboard();
  renderMonthlyDashboard();
}

function showDashboardView(view) {
  activeDashboardView = view;

  document.querySelectorAll("[data-dashboard-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.dashboardTab === view);
  });

  document.querySelectorAll(".dashboard-panel").forEach(panel => {
    panel.classList.remove("active");
  });

  document.getElementById(`${view}Dashboard`).classList.add("active");
  updateDashboard();
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function getStartOfWeek(date) {
  const start = new Date(date);
  const day = start.getDay();
  const offset = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + offset);
  start.setHours(0, 0, 0, 0);

  return start;
}

function getEndOfWeek(date) {
  const end = getStartOfWeek(date);

  end.setDate(end.getDate() + 6);

  return end;
}

function getDateKeysInRange(startDate, endDate) {
  const keys = [];
  const cursor = new Date(startDate);

  cursor.setHours(0, 0, 0, 0);

  while (cursor <= endDate) {
    keys.push(getDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

function getCurrentMonthDateKeys() {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return getDateKeysInRange(firstDay, lastDay);
}

function formatDateRange(startKey, endKey) {
  const start = getDateFromKey(startKey);
  const end = getDateFromKey(endKey);
  const options = {
    day: "numeric",
    month: "short"
  };

  return `${start.toLocaleDateString("ms-MY", options)} - ${end.toLocaleDateString("ms-MY", options)}`;
}

function formatDayLabel(dateKey) {
  return getDateFromKey(dateKey).toLocaleDateString("ms-MY", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

function getPeriodStats(dateKeys) {
  const totalItems = getTotalItems();
  const checked = dateKeys.reduce((sum, dateKey) => sum + getCheckedCountByKey(dateKey), 0);
  const possible = totalItems * dateKeys.length;
  const percent = possible === 0 ? 0 : Math.round((checked / possible) * 100);
  const average = dateKeys.length === 0 ? 0 : Math.round(checked / dateKeys.length);

  return {
    checked,
    possible,
    percent,
    average,
    recordedDays: getRecordedDayCount(dateKeys)
  };
}

function getCategoryStats(dateKeys) {
  return amalData.map(group => {
    const checked = dateKeys.reduce((sum, dateKey) => {
      const savedData = getSavedDataByKey(dateKey);
      const count = group.items.filter(item => savedData[item]).length;

      return sum + count;
    }, 0);
    const possible = group.items.length * dateKeys.length;
    const percent = possible === 0 ? 0 : Math.round((checked / possible) * 100);

    return {
      name: group.category,
      checked,
      possible,
      percent
    };
  });
}

function renderPeriodRows(containerId, rows) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  rows.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "period-row";

    rowElement.innerHTML = `
      <div>
        <div class="period-name">${row.name}</div>
        <div class="period-meta">${row.meta}</div>
      </div>
      <strong>${row.percent}%</strong>
      <div class="mini-progress" aria-hidden="true"><span style="width: ${row.percent}%"></span></div>
    `;

    container.appendChild(rowElement);
  });
}

function renderCategoryRows(containerId, dateKeys) {
  const container = document.getElementById(containerId);
  const categoryStats = getCategoryStats(dateKeys);

  container.innerHTML = "";

  categoryStats.forEach(category => {
    const rowElement = document.createElement("div");
    rowElement.className = "category-row";

    rowElement.innerHTML = `
      <div>
        <div class="category-name">${category.name}</div>
        <div class="category-meta">${category.checked} daripada ${category.possible} tanda</div>
      </div>
      <strong>${category.percent}%</strong>
      <div class="mini-progress" aria-hidden="true"><span style="width: ${category.percent}%"></span></div>
    `;

    container.appendChild(rowElement);
  });
}

function renderWeeklyDashboard() {
  const start = getStartOfWeek(new Date());
  const end = getEndOfWeek(new Date());
  const dateKeys = getDateKeysInRange(start, end);
  const stats = getPeriodStats(dateKeys);
  const totalItems = getTotalItems();

  document.getElementById("weeklySummaryText").textContent =
    `${stats.checked} daripada ${stats.possible} tanda minggu ini`;
  document.getElementById("weeklyDaysText").textContent = `${stats.recordedDays}/7`;
  document.getElementById("weeklyAverageText").textContent = `${stats.average}/${totalItems}`;
  document.getElementById("weeklyProgressBar").style.width = `${stats.percent}%`;
  document.getElementById("weeklyRangeText").textContent =
    `Tempoh ${formatDateRange(dateKeys[0], dateKeys[dateKeys.length - 1])}`;

  renderPeriodRows("weeklyDayList", dateKeys.map(dateKey => {
    const checked = getCheckedCountByKey(dateKey);
    const percent = totalItems === 0 ? 0 : Math.round((checked / totalItems) * 100);

    return {
      name: formatDayLabel(dateKey),
      meta: `${checked} daripada ${totalItems} amalan`,
      percent
    };
  }));

  renderCategoryRows("weeklyCategoryList", dateKeys);
}

function renderMonthlyDashboard() {
  const dateKeys = getCurrentMonthDateKeys();
  const stats = getPeriodStats(dateKeys);
  const totalItems = getTotalItems();
  const weeks = [];

  document.getElementById("monthlySummaryText").textContent =
    `${stats.checked} daripada ${stats.possible} tanda bulan ini`;
  document.getElementById("monthlyDaysText").textContent = `${stats.recordedDays}/${dateKeys.length}`;
  document.getElementById("monthlyAverageText").textContent = `${stats.average}/${totalItems}`;
  document.getElementById("monthlyProgressBar").style.width = `${stats.percent}%`;
  document.getElementById("monthlyRangeText").textContent =
    `Tempoh ${formatDateRange(dateKeys[0], dateKeys[dateKeys.length - 1])}`;

  for (let index = 0; index < dateKeys.length; index += 7) {
    const weekKeys = dateKeys.slice(index, index + 7);
    const weekStats = getPeriodStats(weekKeys);

    weeks.push({
      name: `Minggu ${weeks.length + 1}`,
      meta: `${formatDateRange(weekKeys[0], weekKeys[weekKeys.length - 1])} · ${weekStats.checked} tanda`,
      percent: weekStats.percent
    });
  }

  renderPeriodRows("monthlyWeekList", weeks);
  renderCategoryRows("monthlyCategoryList", dateKeys);
}

function saveToday() {
  const total = getTotalItems();
  const checked = getCheckedCount();

  document.getElementById("resultText").textContent =
    `Hari ini anda telah menanda ${checked} daripada ${total} amalan. Semoga Allah menerima usaha kecil ini dan membimbing kita untuk terus istiqamah.`;

  showScreen("resultScreen");
}

function resetToday() {
  const confirmReset = confirm("Reset semua checklist hari ini?");

  if (confirmReset) {
    localStorage.removeItem(`amal-${todayKey}`);
    renderChecklist();
    updateDashboard();
  }
}
