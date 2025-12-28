/* INTRO PAGE */
const introPage = document.getElementById('intro-page');
const appWrapper = document.getElementById('app-wrapper');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    introPage.classList.add('hidden');
    appWrapper.style.display = 'block';
});

/* DATE */
const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
document.getElementById('date-display').innerText =
    new Date().toLocaleDateString('en-US', dateOptions);

/* STATE */
let tasks = JSON.parse(localStorage.getItem('focusFlowTasks')) || [];

/* DOM */
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');
const emptyState = document.getElementById('empty-state');

/* STORAGE */
function save() {
    localStorage.setItem('focusFlowTasks', JSON.stringify(tasks));
    render();
}

/* CRUD */
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = '';
    save();
}

function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    save();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    save();
}

/* RENDER */
function render() {
    taskList.innerHTML = '';
    emptyState.style.display = tasks.length ? 'none' : 'block';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="actions">
                <button class="delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        li.querySelector('.custom-checkbox')
            .addEventListener('change', () => toggleTask(task.id));

        li.querySelector('.delete')
            .addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    const active = tasks.filter(t => !t.completed).length;
    taskCount.innerText = `${active} task${active !== 1 ? 's' : ''} remaining`;
}

/* SECURITY */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* EVENTS */
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
clearBtn.addEventListener('click', clearCompleted);

/* INIT */
render();
