/**
 * Focus Board — JavaScript state management and interactivity
 */

const STORAGE_KEY = "focus-board-tasks";

/** @typedef {{ id: string, text: string, completed: boolean }} Task */

/** Application state */
const state = {
  tasks: /** @type {Task[]} */ ([]),
  filter: /** @type {"all" | "active" | "completed"} */ ("all"),
  sidebarOpen: false,
};

/** DOM references */
const elements = {
  taskForm: document.getElementById("task-form"),
  taskInput: document.getElementById("task-input"),
  taskList: document.getElementById("task-list"),
  emptyState: document.getElementById("empty-state"),
  listMeta: document.getElementById("list-meta"),
  taskTemplate: document.getElementById("task-template"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  clearCompleted: document.getElementById("clear-completed"),
  navToggle: document.getElementById("nav-toggle"),
  sidebar: document.getElementById("sidebar"),
  countAll: document.getElementById("count-all"),
  countActive: document.getElementById("count-active"),
  countCompleted: document.getElementById("count-completed"),
  completedCount: document.getElementById("completed-count"),
  totalCount: document.getElementById("total-count"),
  progressPercent: document.getElementById("progress-percent"),
  progressCircle: document.getElementById("progress-circle"),
};

const CIRCLE_LENGTH = 2 * Math.PI * 52;

// ---------------------------------------------------------------------------
// State persistence
// ---------------------------------------------------------------------------

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.tasks = parsed.filter(
          (t) =>
            t &&
            typeof t.id === "string" &&
            typeof t.text === "string" &&
            typeof t.completed === "boolean"
        );
      }
    }
  } catch {
    state.tasks = [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

// ---------------------------------------------------------------------------
// State mutations
// ---------------------------------------------------------------------------

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;

  state.tasks.unshift({
    id: generateId(),
    text: trimmed,
    completed: false,
  });
  saveState();
  return true;
}

function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveState();
  }
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  saveState();
}

function clearCompleted() {
  state.tasks = state.tasks.filter((t) => !t.completed);
  saveState();
}

function setFilter(filter) {
  state.filter = filter;
}

function setSidebarOpen(open) {
  state.sidebarOpen = open;
  elements.sidebar.classList.toggle("is-open", open);
  elements.navToggle.setAttribute("aria-expanded", String(open));
  elements.navToggle.querySelector(".sr-only").textContent = open
    ? "Close navigation"
    : "Open navigation";
}

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

function getFilteredTasks() {
  switch (state.filter) {
    case "active":
      return state.tasks.filter((t) => !t.completed);
    case "completed":
      return state.tasks.filter((t) => t.completed);
    default:
      return state.tasks;
  }
}

function getStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, active, percent };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderTaskCard(task) {
  const fragment = elements.taskTemplate.content.cloneNode(true);
  const li = fragment.querySelector(".task-card");
  const checkbox = fragment.querySelector(".task-checkbox");
  const textEl = fragment.querySelector(".task-text");
  const deleteBtn = fragment.querySelector(".task-delete");

  li.dataset.id = task.id;
  if (task.completed) li.classList.add("is-completed");

  checkbox.checked = task.completed;
  checkbox.id = `task-${task.id}`;
  textEl.textContent = task.text;
  deleteBtn.setAttribute("aria-label", `Delete task: ${task.text}`);

  checkbox.addEventListener("change", () => toggleTask(task.id));
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  return li;
}

function render() {
  const filtered = getFilteredTasks();
  const stats = getStats();

  elements.taskList.replaceChildren(
    ...filtered.map((task) => renderTaskCard(task))
  );

  const isEmpty = filtered.length === 0;
  elements.emptyState.hidden = !isEmpty;
  elements.emptyState.textContent =
    state.tasks.length === 0
      ? "No tasks yet. Add one above to get started."
      : `No ${state.filter === "all" ? "" : state.filter} tasks to show.`;

  const label =
    filtered.length === 1 ? "1 task" : `${filtered.length} tasks`;
  elements.listMeta.textContent =
    state.filter === "all" ? label : `${label} (${state.filter})`;

  elements.countAll.textContent = String(stats.total);
  elements.countActive.textContent = String(stats.active);
  elements.countCompleted.textContent = String(stats.completed);
  elements.completedCount.textContent = String(stats.completed);
  elements.totalCount.textContent = String(stats.total);
  elements.progressPercent.textContent = String(stats.percent);

  const offset = CIRCLE_LENGTH - (stats.percent / 100) * CIRCLE_LENGTH;
  elements.progressCircle.style.strokeDashoffset = String(offset);

  elements.clearCompleted.disabled = stats.completed === 0;

  elements.filterButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === state.filter);
  });
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function handleSubmit(event) {
  event.preventDefault();
  const input = elements.taskInput;
  if (addTask(input.value)) {
    input.value = "";
    input.focus();
    render();
  }
}

function handleFilterClick(event) {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;
  setFilter(btn.dataset.filter);
  if (window.matchMedia("(max-width: 767px)").matches) {
    setSidebarOpen(false);
  }
  render();
}

function handleNavToggle() {
  setSidebarOpen(!state.sidebarOpen);
}

function handleDocumentClick(event) {
  if (
    state.sidebarOpen &&
    !elements.sidebar.contains(event.target) &&
    !elements.navToggle.contains(event.target)
  ) {
    setSidebarOpen(false);
  }
}

function handleKeydown(event) {
  if (event.key === "Escape" && state.sidebarOpen) {
    setSidebarOpen(false);
  }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function init() {
  loadState();
  render();

  elements.taskForm.addEventListener("submit", handleSubmit);
  document.querySelector(".filter-list").addEventListener("click", handleFilterClick);
  elements.clearCompleted.addEventListener("click", () => {
    clearCompleted();
    render();
  });
  elements.navToggle.addEventListener("click", handleNavToggle);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeydown);

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches && state.sidebarOpen) {
      setSidebarOpen(false);
    }
  });
}

init();
