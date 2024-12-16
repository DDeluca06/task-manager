const tasksKey = 'tasks';

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

function getTasks() {
    const tasks = localStorage.getItem(tasksKey);
    return tasks ? JSON.parse(tasks) : [];
}

function deleteTask(taskName) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
    displayTasks();
}