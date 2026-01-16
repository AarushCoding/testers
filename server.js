require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

// Securely provide public config to frontend
app.get('/config', (req, res) => {
    res.json({
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
    });
});

// Fallback to index for clean routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/config', (req, res) => {
    res.json({
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
