// tasksDB.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tasks.json');

function loadTasks() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Function to get all tasks
function getTasks() {
  return loadTasks();
}

function addTask(taskData) {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    completed: false,
    ...taskData,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == id);
  if (!task) return null;
  task.completed = true;
  task.completedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
}

// Function to update an existing task
function updateTask(id, updateData) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == id);
  if (!task) return null;
  Object.assign(task, updateData);
  saveTasks(tasks);
  return task;
}

// Function to delete a task
function deleteTask(id) {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id != id);
  if (tasks.length === initialLength) return false;
  saveTasks(tasks);
  return true;
}

// Export the CRUD functions
module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
};