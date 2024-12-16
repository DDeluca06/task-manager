// Create App
const express = require('express')
const app = express()

// Middleware
app.use(express.json());

// Create a Task
app.post('/tasks', (req,res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';

    connection.query(query, [title, description], (err, results) => {
        // Trying something new out, if it breaks, it breaks.
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Read our tasks
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json(results);
    });
});