const myMoodType = document.querySelectorAll(".mood");
const timelineContainer = document.getElementById("timeline");
const showDailyBtn = document.getElementById("show-daily");
const showWeeklyBtn = document.getElementById("show-weekly");
const showMonthlyBtn = document.getElementById("show-monthly");

let currentView = "daily";
let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];
//localStorage.clear();

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

function saveLogs() {
  localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
}

function groupLogsByPeriod() {
  const today = new Date();
  const oneWeekAgo = new Date();
  const oneMonthAgo = new Date();

  oneWeekAgo.setDate(today.getDate() - 7);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const dayLogs = {};
  const weekLogs = [];
  const monthLogs = [];

  moodLogs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    const dateKey = formatDate(log.timestamp);

    // Group by day
    if (!dayLogs[dateKey]) dayLogs[dateKey] = [];
    dayLogs[dateKey].push(log);

    if (logDate >= oneWeekAgo) weekLogs.push(log);

    if (logDate >= oneMonthAgo) monthLogs.push(log);
  });

  return { dayLogs, weekLogs, monthLogs };
}

function displayTimeline() {
  const { dayLogs, weekLogs, monthLogs } = groupLogsByPeriod();
  timelineContainer.innerHTML = "";

  const logsWrapper = document.createElement("div");
  logsWrapper.className = "timeline-section";
  const logsGrid = document.createElement("div");
  logsGrid.className = "logs-grid";

  if (currentView === "daily") {
    logsWrapper.innerHTML = "<h2>Daily Logs</h2>";
    for (const date in dayLogs) {
      dayLogs[date].forEach((log) => {
        const logElement = document.createElement("div");
        logElement.className = "log-item";
        logElement.textContent = `${log.mood} - ${formatDate(
          log.timestamp
        )} ${new Date(log.timestamp).toLocaleTimeString()}`;
        logsGrid.appendChild(logElement);
      });
    }
  } else if (currentView === "weekly") {
    logsWrapper.innerHTML = "<h2>Weekly Logs (Last 7 Days)</h2>";
    weekLogs.forEach((log) => {
      const logElement = document.createElement("div");
      logElement.className = "log-item";
      logElement.textContent = `${log.mood} - ${formatDate(
        log.timestamp
      )} ${new Date(log.timestamp).toLocaleTimeString()}`;
      logsGrid.appendChild(logElement);
    });
  } else if (currentView === "monthly") {
    logsWrapper.innerHTML = "<h2>Monthly Logs (Last 30 Days)</h2>";
    monthLogs.forEach((log) => {
      const logElement = document.createElement("div");
      logElement.className = "log-item";
      logElement.textContent = `${log.mood} - ${formatDate(
        log.timestamp
      )} ${new Date(log.timestamp).toLocaleTimeString()}`;
      logsGrid.appendChild(logElement);
    });
  }

  logsWrapper.appendChild(logsGrid);
  timelineContainer.appendChild(logsWrapper);
}

myMoodType.forEach((button) => {
  button.addEventListener("click", () => {
    const mood = button.textContent;
    const timestamp = Date.now();

    moodLogs.push({ mood, timestamp });
    saveLogs();
    displayTimeline();
  });
});

showDailyBtn.addEventListener("click", () => {
  currentView = "daily";
  displayTimeline();
});

showWeeklyBtn.addEventListener("click", () => {
  currentView = "weekly";
  displayTimeline();
});

showMonthlyBtn.addEventListener("click", () => {
  currentView = "monthly";
  displayTimeline();
});

displayTimeline();
