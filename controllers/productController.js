const db = require('../config/db');

// GET / — Home with all products (+ search)
const getHome = async (req, res) => {
  const search = req.query.search || '';
  try {
    let rows;
    if (search) {
      [rows] = await db.query(
        'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?',
        [`%${search}%`, `%${search}%`]
      );
    } else {
      [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    }
    res.render('home', { title: 'Shop', products: rows, search });
  } catch (err) {
    console.error(err);
    res.render('home', { title: 'Shop', products: [], search });
  }
};

// GET /products/:id — Single product detail
const getProduct = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.redirect('/');
    res.render('product-detail', { title: rows[0].name, product: rows[0] });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

module.exports = { getHome, getProduct };
