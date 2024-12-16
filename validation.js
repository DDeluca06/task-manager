// CONSTs and apps
const express = require('express');
const mysql = require('mysql2');
const appjs = require('./app.js');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Form validation that totally didn't take me an embarassingly long amount of time to understand
const validateTask = (req, res, next) => {
    const { title } = req.body;

    // Check if title is provided, if not, return a 400 error.
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // Check if title length is valid, and disallow whitespaces.
    if (typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ error: 'Title must be at least 3 characters long and cannot be empty' });
    }

    // If validation passes, proceed.
    next();
};

// Function to create a task
const createTask = (taskData) => {
    // Create a new task object with a unique ID
    const newTask = {
        id: tasks.length + 1, // Simple ID generation based on current length
        title: taskData.title,
        createdAt: new Date(), // Timestamp for when the task was created
    };

    // Save the new task to the in-memory store
    tasks.push(newTask);

    // Return the created task
    return newTask;
};

// Using validation in the task creation route
app.post('/tasks', validateTask, (req, res) => {
    // Handle task creation
    const task = createTask(req.body);
    return res.status(201).json(task); // Respond with the created task and a 201 status
});

// Function to get all tasks (optional, for demonstration)
app.get('/tasks', (req, res) => {
    return res.status(200).json(tasks); // Respond with the list of tasks
});