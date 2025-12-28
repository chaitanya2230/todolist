let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const itemsLeft = document.getElementById("items-left");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const toast = document.getElementById("toast");

/* ---------- Helpers ---------- */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------- Core Logic ---------- */
function addTask() {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        id: Date.now(),
        text: taskInput.value,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

function toggleTask(id) {
    tasks.forEach(task => {
        if (task.id === id) task.completed = !task.completed;
    });
    saveTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
}

/* ---------- UI Render ---------- */
function renderTasks() {
    taskList.innerHTML = "";

    emptyState.style.display = tasks.length ? "none" : "block";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        li.querySelector("input").addEventListener("change", () => toggleTask(task.id));
        taskList.appendChild(li);
    });

    const active = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${active} items left`;
}

/* ---------- Events ---------- */
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());
clearCompletedBtn.addEventListener("click", clearCompleted);

renderTasks();
