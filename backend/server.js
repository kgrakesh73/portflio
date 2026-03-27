const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// 1. ✅ Middleware
// Allows your frontend to talk to this backend
app.use(cors({
    origin: "*" // In production, you can replace "*" with your Render frontend URL
}));

app.use(express.json()); // Parses incoming JSON data

// 2. ✅ Database Configuration (using a Pool for stability)
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Railway MySQL Pool");
        connection.release(); // Return the connection to the pool
    }
});

// 3. ✅ API Routes

// Health check route (helps Render monitor your app)
app.get('/', (req, res) => {
    res.send("Backend Server is Live! 🚀");
});

// POST Route: Save contact form data
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Simple Server-side Validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("❌ Database Insert Error:", err);
            return res.status(500).json({ error: "Failed to save message to database" });
        }
        
        console.log("Data inserted successfully:", result.insertId);
        res.status(200).json({ message: "Message sent successfully! ✅" });
    });
});

// 4. ✅ Start Server
const PORT = process.env.PORT || 3000; // Render will provide the PORT automatically
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});