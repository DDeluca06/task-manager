document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', addTask);
    loadTasks();
});

function addTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;

    if (validateTask(taskName, taskDescription)) {
        const task = { name: taskName, description: taskDescription };
        saveTask(task);
        displayTasks();
        taskForm.reset();
    }
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
}

function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.textContent = `${task.name}: ${task.description}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.name);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}