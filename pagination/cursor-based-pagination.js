// app.js
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cursor-based pagination
app.get('/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = parseInt(req.query.cursor) || 0; // default: start from beginning

    let query, params;

    if (cursor > 0) {
      // fetch users after given cursor
      query = 'SELECT * FROM users WHERE id > ? ORDER BY id ASC LIMIT ?';
      params = [cursor, limit];
    } else {
      // fetch first N users
      query = 'SELECT * FROM users ORDER BY id ASC LIMIT ?';
      params = [limit];
    }

    const [users] = await pool.query(query, params);

    const nextCursor = users.length > 0 ? users[users.length - 1].id : null;

    res.json({
      nextCursor,
      users,
      hasMore: users.length === limit
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
