// tasksDB.js
const fs = require('fs');
const path = require('path');

// Define the path to the JSON file
const filePath = path.join(__dirname, 'tasks.json');

// Helper function to load tasks from the JSON file
function loadTasks() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return an empty array if file doesn't exist or is invalid
    return [];
  }
}

// Helper function to save tasks back to the JSON file
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Function to get all tasks
function getTasks() {
  return loadTasks();
}

// Function to add a new task
function addTask(taskData) {
  const tasks = loadTasks();
  // Generate a new ID; if tasks exist, increment the last task's id, otherwise start at 1
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    ...taskData,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
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
};