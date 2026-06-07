require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash   = require('connect-flash');
const path    = require('path');

const app = express();

// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.use(flash());

// Make user & flash available in all views
app.use((req, res, next) => {
  res.locals.user          = req.session.user || null;
  res.locals.success_msg   = req.flash('success');
  res.locals.error_msg     = req.flash('error');
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/',        require('./routes/auth'));
app.use('/',        require('./routes/products'));
app.use('/cart',    require('./routes/cart'));
app.use('/orders',  require('./routes/orders'));
app.use('/payment', require('./routes/payment'));
app.use('/admin',   require('./routes/admin'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PayCart running at http://localhost:${PORT}`);
});
