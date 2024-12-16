import express from 'express';
import Task from '../models/tasks.js';

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
    try {
        // Grab the necessary bits, keep everything else for records
        const { title, description, startDate, dueDate } = req.body;
        const newTask = await Task.create({ title, description, startDate, dueDate });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error); // Log the error details, that might be helpful. Maybe. Y'know, just thinking ahead.
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks, hopefully...
// 4:45 PM, 12/16: Hi, this is revision 8. I kept track. It did not get the tasks initially. I don't know why it didn't, but it does now, so we're not going to talk about it.
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Update a task, and if it breaks, we're gonna pretend it still works
router.put('/:id', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the incoming request body
        const { title, description, startDate, dueDate, status } = req.body;

        // Validate input data
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const task = await Task.findByPk(req.params.id);
        if (task) {
            task.title = title;
            task.description = description;
            task.startDate = startDate;
            task.dueDate = dueDate;
            task.status = status; // Ensure status is updated. Thanks, Sequelize.
            await task.save();
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task:', error); // Log the error details
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task, because sometimes you just wanna delete things (AI autofill suggested this, it was too funny to not throw in. Like, no s^#&?)
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
        // If this ever triggers or fails, I should not be allowed to write another piece of code.
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

export default router;