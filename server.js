// server.js – simple Express wrapper for the static site + API route
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
const handler = require('./pages/api/contact'); // CommonJS export

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// API route
app.post('/api/contact', handler);

// Serve static assets (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for any unknown route (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
