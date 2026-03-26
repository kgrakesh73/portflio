// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection (Railway)
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Connect to DB
db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL (Railway)");
    }
});

// Test route
app.get('/', (req, res) => {
    res.send("🚀 Server is running...");
});

// Contact form API (CREATE)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("📩 Data saved to database");

        res.json({ message: "Form submitted and saved to database!" });
    });
});

// READ (Get all messages)
app.get('/messages', (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching data:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

// DELETE (optional CRUD)
app.delete('/message/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM contacts WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting data:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Message deleted successfully!" });
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});