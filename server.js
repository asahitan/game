const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:'); // In-memory database for demo. Use a file for persistence.

app.use(cors());
app.use(bodyParser.json());

// Create a table for posts
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        image TEXT,
        timestamp TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        content TEXT,
        timestamp TEXT,
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )`);
});

// API endpoint to get all posts
app.get('/posts', (req, res) => {
    db.all(`SELECT * FROM posts`, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// API endpoint to create a new post
app.post('/posts', (req, res) => {
    const { content, image, timestamp } = req.body;
    db.run(`INSERT INTO posts (content, image, timestamp) VALUES (?, ?, ?)`, [content, image, timestamp], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

// API endpoint to get comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    db.all(`SELECT * FROM comments WHERE post_id = ?`, [postId], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// API endpoint to add a comment to a post
app.post('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const { content, timestamp } = req.body;
    db.run(`INSERT INTO comments (post_id, content, timestamp) VALUES (?, ?, ?)`, [postId, content, timestamp], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
