// usersDB.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const filePath = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

async function createUser(username, password) {
  const users = loadUsers();
  
  if (users.some(user => user.username === username)) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password: hashedPassword
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

async function validateUser(username, password) {
  const users = loadUsers();
  const user = users.find(u => u.username === username);
  
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return user;
}

function getUserById(id) {
  const users = loadUsers();
  return users.find(u => u.id === id);
}

module.exports = {
  createUser,
  validateUser,
  getUserById
};