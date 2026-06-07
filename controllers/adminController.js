const db = require('../config/db');

// GET /admin — dashboard with products
const getDashboard = async (req, res) => {
  const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
  res.render('admin/dashboard', { title: 'Admin Dashboard', products });
};

// GET /admin/products/add
const getAddProduct = (req, res) => {
  res.render('admin/product-form', { title: 'Add Product', product: null });
};

// POST /admin/products/add
const postAddProduct = async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  await db.query(
    'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?,?,?,?,?,?)',
    [name, description, price, stock, category, image_url]
  );
  req.flash('success', 'Product added!');
  res.redirect('/admin');
};

// GET /admin/products/edit/:id
const getEditProduct = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.redirect('/admin');
  res.render('admin/product-form', { title: 'Edit Product', product: rows[0] });
};

// POST /admin/products/edit/:id
const postEditProduct = async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  await db.query(
    'UPDATE products SET name=?, description=?, price=?, stock=?, category=?, image_url=? WHERE id=?',
    [name, description, price, stock, category, image_url, req.params.id]
  );
  req.flash('success', 'Product updated!');
  res.redirect('/admin');
};

// POST /admin/products/delete/:id
const deleteProduct = async (req, res) => {
  await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  req.flash('success', 'Product deleted!');
  res.redirect('/admin');
};

// GET /admin/orders
const getAllOrders = async (req, res) => {
  const [orders] = await db.query(
    `SELECT o.*, u.name as user_name, u.email
     FROM orders o JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  res.render('admin/orders', { title: 'All Orders', orders });
};

module.exports = { getDashboard, getAddProduct, postAddProduct,
                   getEditProduct, postEditProduct, deleteProduct, getAllOrders };
