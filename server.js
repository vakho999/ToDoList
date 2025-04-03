const express = require('express');
const path = require('path');
const tasksDB = require('./tasksDB'); // Import the tasksDB module

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to add a task
app.post('/add-task', (req, res) => {
    const { activity, dueDate } = req.body;

    if (!activity || !dueDate) {
        return res.status(400).json({ error: 'Activity and due date are required' });
    }
    
    // Add the task using tasksDB
    const newTask = tasksDB.addTask({ title: activity, dueDate: dueDate });

    // Respond with the newly added task
    res.json(newTask);
});

// Handle GET request to retrieve all tasks
app.get('/get-tasks', (req, res) => {
    const tasks = tasksDB.getTasks();
    res.json(tasks);
});

// Handle DELETE request to remove a task
app.delete('/remove-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasksDB.deleteTask(taskId);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
});

// Handle PUT request to update a task
app.put('/update-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, dueDate } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ error: 'Title and due date are required' });
    }

    const updatedTask = tasksDB.updateTask(taskId, { title, dueDate });
    
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});