// ============================================================
// script.js — To-Do App Logic
// Chetali Kumbhare | Web Dev Internship, Level 2
// ============================================================

// ---- MOTIVATIONAL QUOTES (shown randomly in the header) ----
const quotes = [
  "Small steps every day add up to big results.",
  "Done is better than perfect.",
  "Focus on progress, not perfection.",
  "You don't have to be great to start, but you have to start to be great.",
  "One task at a time. You've got this.",
  "Clear mind, clear tasks, clear goals.",
  "The secret of getting ahead is getting started.",
];

// Pick a random quote and inject it on page load
function loadRandomQuote() {
  const quoteEl = document.getElementById("quoteText");
  const random = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[random];
}

// ---- TASK DATA ----
// Each task is an object: { id, text, done, createdAt, completedAt }
// We store tasks in localStorage so they survive page refresh.

let tasks = [];         // Our in-memory array
let activeFilter = "all";   // Tracks which filter button is active
let taskToDelete = null;    // Stores the id of task pending deletion

// Key used for localStorage
const STORAGE_KEY = "chetali_todo_tasks";

// Load tasks from localStorage (returns [] if nothing saved yet)
function loadTasksFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save the current tasks array to localStorage
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---- HELPER: FORMAT DATE ----
// Turns a timestamp number into a readable string like "15 Jun, 3:42 PM"
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${day} ${month}, ${time}`;
}

// ---- HELPER: GENERATE UNIQUE ID ----
// Simple approach: use current time + random number
function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// ---- RENDER: REBUILD THE TASK LISTS IN THE DOM ----
// This function is called every time something changes.
// It clears both lists and redraws everything from scratch.
function renderTasks() {
  const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();

  const pendingList    = document.getElementById("pendingList");
  const completedList  = document.getElementById("completedList");
  const pendingEmpty   = document.getElementById("pendingEmpty");
  const completedEmpty = document.getElementById("completedEmpty");
  const pendingCount   = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");

  // Clear existing list items
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  // Count totals for the counter display (before filter)
  const totalPending   = tasks.filter(t => !t.done).length;
  const totalCompleted = tasks.filter(t => t.done).length;

  pendingCount.textContent   = `${totalPending} Pending`;
  completedCount.textContent = `${totalCompleted} Completed`;

  // Filter tasks based on active filter and search query
  const filtered = tasks.filter(task => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "pending"   && !task.done) ||
      (activeFilter === "completed" && task.done);

    const matchesSearch = task.text.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  // Split filtered into pending and completed
  const pendingTasks   = filtered.filter(t => !t.done);
  const completedTasks = filtered.filter(t => t.done);

  // Render pending tasks
  pendingTasks.forEach(task => {
    const li = createTaskElement(task);
    pendingList.appendChild(li);
  });

  // Render completed tasks
  completedTasks.forEach(task => {
    const li = createTaskElement(task);
    completedList.appendChild(li);
  });

  // Show or hide empty state messages
  pendingEmpty.style.display   = pendingTasks.length === 0   ? "block" : "none";
  completedEmpty.style.display = completedTasks.length === 0 ? "block" : "none";

  // Tweak the pending empty message based on context
  if (totalPending === 0 && totalCompleted > 0) {
    pendingEmpty.textContent = "Great! All tasks completed 🎉";
  } else {
    pendingEmpty.textContent = "No pending tasks yet — add one above!";
  }

  // Hide entire sections if filter doesn't apply to them
  const pendingSection   = document.getElementById("pendingSection");
  const completedSection = document.getElementById("completedSection");

  pendingSection.style.display   = activeFilter === "completed" ? "none" : "block";
  completedSection.style.display = activeFilter === "pending"   ? "none" : "block";
}

// ---- CREATE A SINGLE TASK <li> ELEMENT ----
function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.setAttribute("data-id", task.id);

  if (task.done) li.classList.add("done");

  // --- Complete toggle button (circle checkbox) ---
  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  if (task.done) completeBtn.classList.add("checked");
  completeBtn.setAttribute("aria-label", task.done ? "Mark as pending" : "Mark as complete");
  completeBtn.setAttribute("title", task.done ? "Mark as pending" : "Mark as complete");
  completeBtn.addEventListener("click", () => toggleComplete(task.id));

  // --- Content area (text + timestamps) ---
  const content = document.createElement("div");
  content.classList.add("task-content");

  const textEl = document.createElement("p");
  textEl.classList.add("task-text");
  textEl.textContent = task.text;

  // Timestamps
  const meta = document.createElement("div");
  meta.classList.add("task-meta");

  const createdEl = document.createElement("span");
  createdEl.classList.add("task-timestamp");
  createdEl.innerHTML = `<span>Added:</span> ${formatDate(task.createdAt)}`;
  meta.appendChild(createdEl);

  // Show completed timestamp only if it exists
  if (task.completedAt) {
    const completedEl = document.createElement("span");
    completedEl.classList.add("task-timestamp");
    completedEl.innerHTML = `<span>Done:</span> ${formatDate(task.completedAt)}`;
    meta.appendChild(completedEl);
  }

  content.appendChild(textEl);
  content.appendChild(meta);

  // --- Action buttons (Edit / Delete) ---
  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  // Edit button — only show for pending tasks
  if (!task.done) {
    const editBtn = document.createElement("button");
    editBtn.classList.add("icon-btn", "edit");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("title", "Edit this task");
    editBtn.addEventListener("click", () => startEditing(task.id, li, textEl));
    actions.appendChild(editBtn);
  }

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("icon-btn", "delete");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("title", "Delete this task");
  deleteBtn.addEventListener("click", () => requestDelete(task.id));
  actions.appendChild(deleteBtn);

  li.appendChild(completeBtn);
  li.appendChild(content);
  li.appendChild(actions);

  return li;
}

// ---- ADD TASK ----
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) {
    // Briefly shake the input to signal it's empty
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 400);
    return;
  }

  // Build new task object
  const newTask = {
    id:          generateId(),
    text:        text,
    done:        false,
    createdAt:   Date.now(),
    completedAt: null,
  };

  tasks.unshift(newTask);       // Add to front of array so it appears at the top
  saveTasksToStorage();
  renderTasks();

  input.value = "";             // Clear the input
  input.focus();

  showFeedback("Task added!");  // Brief success message
}

// ---- TOGGLE COMPLETE ----
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  task.completedAt = task.done ? Date.now() : null;

  saveTasksToStorage();
  renderTasks();
}

// ---- START EDITING A TASK ----
// Replaces the task text with an input field in-place
function startEditing(id, li, textEl) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Replace the text paragraph with an input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = task.text;
  editInput.maxLength = 150;

  textEl.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  // Replace the edit button with a save button
  const editBtn = li.querySelector(".icon-btn.edit");
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("icon-btn", "save");
  saveBtn.textContent = "Save";
  saveBtn.setAttribute("title", "Save changes");

  editBtn.replaceWith(saveBtn);

  // Save when "Save" is clicked or Enter is pressed
  const doSave = () => {
    const newText = editInput.value.trim();
    if (!newText) return;      // Don't allow empty task
    task.text = newText;
    saveTasksToStorage();
    renderTasks();
  };

  saveBtn.addEventListener("click", doSave);
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter")  doSave();
    if (e.key === "Escape") renderTasks();  // Cancel edit on Escape
  });
}

// ---- REQUEST DELETE (opens confirmation modal) ----
function requestDelete(id) {
  taskToDelete = id;
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.add("open");
}

// ---- CONFIRM DELETE ----
function confirmDelete() {
  if (!taskToDelete) return;

  tasks = tasks.filter(t => t.id !== taskToDelete);
  taskToDelete = null;
  saveTasksToStorage();
  renderTasks();
  closeModal();
}

// ---- CLOSE MODAL ----
function closeModal() {
  taskToDelete = null;
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("open");
}

// ---- FEEDBACK MESSAGE ----
// Shows a brief success message below the input
function showFeedback(msg) {
  const el = document.getElementById("feedbackMsg");
  el.textContent = msg;
  el.classList.add("show");

  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => {
    el.classList.remove("show");
  }, 2200);
}

// ============================================================
// EVENT LISTENERS — All events are wired up here, no inline HTML
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Load saved tasks from storage
  tasks = loadTasksFromStorage();

  // Show a quote
  loadRandomQuote();

  // Render whatever tasks we have
  renderTasks();

  // Add task button
  document.getElementById("addTaskBtn").addEventListener("click", addTask);

  // Allow pressing Enter in the input to add a task
  document.getElementById("taskInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });

  // Search input — re-render on every keystroke
  document.getElementById("searchInput").addEventListener("input", renderTasks);

  // Filter buttons — update active filter and re-render
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all, add to clicked
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      renderTasks();
    });
  });

  // Modal confirm delete
  document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);

  // Modal cancel
  document.getElementById("cancelDeleteBtn").addEventListener("click", closeModal);

  // Click outside modal to close
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });
});
