// Updated tasksDB.js
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

function getTasks(userId) {
  const tasks = loadTasks();
  return tasks.filter(task => task.userId === userId);
}

function addTask(taskData, userId) {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    completed: false,
    userId,
    ...taskData,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

function completeTask(id, userId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == id && t.userId === userId);
  if (!task) return null;
  task.completed = true;
  task.completedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
}

function updateTask(id, updateData, userId) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id == id && t.userId === userId);
  if (!task) return null;
  Object.assign(task, updateData);
  saveTasks(tasks);
  return task;
}

function deleteTask(id, userId) {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id != id || t.userId !== userId);
  if (tasks.length === initialLength) return false;
  saveTasks(tasks);
  return true;
}

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
};