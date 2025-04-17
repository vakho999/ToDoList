const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const tasksDB = require('./tasksDB');
const usersDB = require('./usersDB');

const app = express();
const SECRET_KEY = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Auth routes
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersDB.createUser(username, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersDB.validateUser(username, password);
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Protected routes
app.get('/get-tasks', authenticateToken, (req, res) => {
  const tasks = tasksDB.getTasks(req.user.id);
  res.json(tasks);
});

app.post('/add-task', authenticateToken, (req, res) => {
  const { activity, dueDate } = req.body;

  if (!activity || !dueDate) {
    return res.status(400).json({ error: 'Activity and due date are required' });
  }
  
  const newTask = tasksDB.addTask({ title: activity, dueDate }, req.user.id);
  res.json(newTask);
});

app.delete('/remove-task/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const success = tasksDB.deleteTask(taskId, req.user.id);
  
  if (success) {
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/update-task/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Title and due date are required' });
  }

  const updatedTask = tasksDB.updateTask(taskId, { title, dueDate }, req.user.id);
  
  if (updatedTask) {
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/complete-task/:id', authenticateToken, (req, res) => {
  try {
    const task = tasksDB.completeTask(parseInt(req.params.id), req.user.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});