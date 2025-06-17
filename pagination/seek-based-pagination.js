// app.js
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Connect to DB
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastPrice = req.query.last_price ? parseFloat(req.query.last_price) : null;
    const lastId = req.query.last_id ? parseInt(req.query.last_id) : null;

    let query = `
      SELECT * FROM products
    `;
    let params = [];

    if (lastPrice !== null && lastId !== null) {
      query += `WHERE (price > ?) OR (price = ? AND id > ?) `;
      params.push(lastPrice, lastPrice, lastId);
    }

    query += `ORDER BY price ASC, id ASC LIMIT ?`;
    params.push(limit);

    const [products] = await pool.query(query, params);

    const lastProduct = products[products.length - 1];

    res.json({
      nextCursor: lastProduct
        ? { last_price: lastProduct.price, last_id: lastProduct.id }
        : null,
      hasMore: products.length === limit,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
