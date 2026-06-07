const bcrypt = require('bcryptjs');
const db     = require('../config/db');

// GET /register
const getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

// POST /register
const postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]);
    req.flash('success', 'Registered successfully! Please login.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/register');
  }
};

// GET /login
const getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

// POST /login
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Login failed');
    res.redirect('/login');
  }
};

// GET /logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
