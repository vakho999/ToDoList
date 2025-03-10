// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up a basic route to serve the index.html
app.get('/nika', (req, res) =>{
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen (port, () => {
     console.log('Server is running at http://localhost:${port}');
});
