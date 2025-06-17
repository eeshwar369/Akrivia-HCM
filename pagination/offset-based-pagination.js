const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host:"localhost",
    user:'root',
    password:'password',
    database:'test_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.get("/users",async (req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const size = parseInt(req.query.size) || 10; // Default to 10 items per page

        if(page<1 || size<1){
            return res.status(400).json({ error: "Page and size must be greater than 0" });
        }

        const offset = (page - 1) * size;

        const [countResult] = await pool.query("SELECT COUNT(*) as count FROM users");
        const totalItems = countResult[0].count;

        const [users] = await pool.query("SELECT * FROM users LIMIT ? OFFSET ?", [size, offset]);
        const totalPages = Math.ceil(totalItems / size);
        res.json({
            page,
            size,
            totalItems,
            totalPages,
            users
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });

    }
})


app.listen(PORT,()=>{
    console.log(`the system running successfully on port ${PORT}`);
})