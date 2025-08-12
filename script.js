let startTime = 0;
let elapsedTime = 0;
let interval;
let isRunning = false;
let currentUser = '';
let sessions = [];

function updateDisplay() {
  const time = new Date(elapsedTime);
  const minutes = String(time.getUTCMinutes()).padStart(2, '0');
  const seconds = String(time.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
  document.getElementById('display').textContent = `${minutes}:${seconds}:${milliseconds}`;
}

function startStopwatch() {
  if (!currentUser) {
    alert("Please enter and save your name first.");
    return;
  }
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    interval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 10);
  }
}

function pauseStopwatch() {
  isRunning = false;
  clearInterval(interval);
}

function resetStopwatch() {
  if (currentUser && elapsedTime > 0) {
    saveSession(currentUser, elapsedTime);
  }

  isRunning = false;
  clearInterval(interval);
  elapsedTime = 0;
  updateDisplay();
  document.getElementById('laps').innerHTML = '';
}

function recordLap() {
  if (isRunning && currentUser) {
    const lapTime = document.getElementById('display').textContent;
    const timestamp = new Date().toLocaleTimeString();
    const lapList = document.getElementById('laps');
    const lapItem = document.createElement('li');
    lapItem.textContent = `${currentUser} - Lap ${lapList.children.length + 1}: ${lapTime} (at ${timestamp})`;
    lapList.appendChild(lapItem);
  }
}

function saveUserName() {
  const input = document.getElementById('userName');
  const name = input.value.trim();
  if (name) {
    currentUser = name;
    document.getElementById('user-display').textContent = `Welcome, ${currentUser}!`;
    input.value = '';
  } else {
    alert("Enter a valid name.");
  }
}

function formatTime(ms) {
  const time = new Date(ms);
  const min = String(time.getUTCMinutes()).padStart(2, '0');
  const sec = String(time.getUTCSeconds()).padStart(2, '0');
  const msms = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${min}:${sec}:${msms}`;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
let userStats = {};

function saveSession(user, timeMs) {
  const formatted = formatTime(timeMs);
  const now = new Date().toLocaleString();

  // Track total time
  if (!userStats[user]) {
    userStats[user] = { totalTime: 0, lastSession: '' };
  }
  userStats[user].totalTime += timeMs;
  userStats[user].lastSession = now;

  updateDashboard();

  sessions.push({ user, time: formatted, timestamp: now });
}

function updateDashboard() {
  const table = document.getElementById('dashboardTable').querySelector('tbody');
  table.innerHTML = '';

  for (const user in userStats) {
    const row = document.createElement('tr');
    const total = formatTime(userStats[user].totalTime);
    const last = userStats[user].lastSession;

    row.innerHTML = `
      <td>${user}</td>
      <td>${total}</td>
      <td>${last}</td>
       <td><button onclick="deleteUser('${user}')" class="delete-btn">🗑️</button></td>
    `;
    table.appendChild(row);
  }
}
function deleteUser(user) {
  const confirmDelete = confirm(`Delete data for "${user}"?`);
  if (!confirmDelete) return;

  delete userStats[user];

  // Remove from session array too (optional)
  sessions = sessions.filter(s => s.user !== user);

  updateDashboard();

  // Optional: clear user if current one deleted
  if (currentUser === user) {
    currentUser = '';
    document.getElementById('user-display').textContent = '';
    document.getElementById('laps').innerHTML = '';
  }
}

function toggleDashboard() {
  const dashboard = document.getElementById("dashboardContainer");
  const btn = document.querySelector(".dashboard-btn");

  if (dashboard.classList.contains("hidden")) {
    dashboard.classList.remove("hidden");
    dashboard.classList.add("show");
    btn.textContent = "Hide Dashboard";
  } else {
    dashboard.classList.remove("show");
    dashboard.classList.add("hidden");
    btn.textContent = "Show Dashboard";
  }
}
function clearDashboard() {
  const confirmClear = confirm("Are you sure you want to delete all user data?");
  if (!confirmClear) return;

  userStats = {};
  sessions = [];

  // Clear dashboard UI
  const table = document.getElementById('dashboardTable').querySelector('tbody');
  table.innerHTML = '';

  // Optionally clear laps and current user display
  document.getElementById('laps').innerHTML = '';
  document.getElementById('user-display').textContent = '';
  currentUser = '';
}
