const apiUrl = '/api/tasks';

// Function to fetch and display tasks
const fetchTasks = async () => {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        taskItem.dataset.startDate = task.startDate; // Store start date
        taskItem.dataset.dueDate = task.dueDate; // Store due date
        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <small>${task.description}</small><br>
                <small>Start Date: ${new Date(task.startDate).toLocaleString()}</small><br>
                <small>Due Date: ${new Date(task.dueDate).toLocaleString()}</small><br>
                <small>Status: 
                    <select class="status-select" data-id="${task.id}">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </small>
            </div>
            <div>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${task.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
};

// Event delegation for status change
document.getElementById('taskList').addEventListener('change', async function(event) {
    if (event.target.classList.contains('status-select')) {
        const taskId = event.target.dataset.id;
        const newStatus = event.target.value;

        // Get the task item to retrieve other necessary fields
        const taskItem = event.target.closest('li');
        const title = taskItem.querySelector('strong').innerText;
        const description = taskItem.querySelector('small').innerText;
        const startDate = taskItem.dataset.startDate;
        const dueDate = taskItem.dataset.dueDate;

        // Function to format date safely
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date.toISOString(); // Keep the full ISO string
        };

        // Format the dates to include time
        const formattedStartDate = formatDate(startDate);
        const formattedDueDate = formatDate(dueDate);

        console.log(`Changing status for task ID ${taskId} to ${newStatus}`);

        try {
            const response = await fetch(`${apiUrl}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title, // Include title
                    description: description, // Include description
                    startDate: formattedStartDate, // Include formatted start date
                    dueDate: formattedDueDate, // Include formatted due date
                    status: newStatus // Include new status
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedTask = await response.json();
            console.log('Task updated:', updatedTask); // Log the updated task

            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error updating task status:', error);
            event.target.value = event.target.dataset.previousStatus; // Restore previous status
        }
    }
});

// Fetch tasks on page load
window.onload = fetchTasks;

// Add task
document.getElementById('taskForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const startDate = document.getElementById('taskStartDate').value; // Get start date
    const dueDate = document.getElementById('taskDueDate').value; // Get due date

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, startDate, dueDate }), // Include start and due dates
    });

    document.getElementById('taskForm').reset(); // Reset the form
    fetchTasks(); // Refresh task list
});

// Event delegation for edit and delete buttons
document.getElementById('taskList').addEventListener('click', async function(event) {
    const taskId = event.target.dataset.id;
    if (event.target.classList.contains('delete-btn')) {
        await fetch(`${apiUrl}/${taskId}`, { method: 'DELETE' });
        fetchTasks(); // Refresh task list
    } else if (event.target.classList.contains('edit-btn')) {
        const taskItem = event.target.closest('li');
        const title = taskItem.querySelector('strong').innerText;
        const description = taskItem.querySelector('small').innerText;
        const startDate = taskItem.dataset.startDate;
        const dueDate = taskItem.dataset.dueDate;
        const status = taskItem.querySelector('.status-select').value;

        // Populate the edit form with the task details
        document.getElementById('editTaskTitle').value = title;
        document.getElementById('editTaskDescription').value = description;

        // Safely format the start and due dates
        const formatDateForInput = (dateString) => {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16); // Format for datetime-local input
        };

        document.getElementById('editTaskStartDate').value = formatDateForInput(startDate);
        document.getElementById('editTaskDueDate').value = formatDateForInput(dueDate);
        document.getElementById('editTaskStatus').value = status;

        // Show the modal
        $('#editTaskModal').modal('show');

        // Handle the edit form submission
        // AND THE MOST BLOATED PoS CODE AWARD
        // RIGHTFULLY BELONGS TO...
        document.getElementById('editTaskForm').onsubmit = async function(event) {
            event.preventDefault();
            const updatedTitle = document.getElementById('editTaskTitle').value;
            const updatedDescription = document.getElementById('editTaskDescription').value;
            const updatedStartDate = document.getElementById('editTaskStartDate').value;
            const updatedDueDate = document.getElementById('editTaskDueDate').value;
            const updatedStatus = document.getElementById('editTaskStatus').value;

            try {
                await fetch(`${apiUrl}/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: updatedTitle,
                        description: updatedDescription,
                        startDate: updatedStartDate,
                        dueDate: updatedDueDate,
                        status: updatedStatus,
                    }),
                });

                // Close the modal
                $('#editTaskModal').modal('hide');

                // Refresh task list
                fetchTasks();
            } catch (error) {
                console.error('Error updating task:', error);
            }
        };
    }
});