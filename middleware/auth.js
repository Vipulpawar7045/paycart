// Ensure user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Please login to continue');
  res.redirect('/login');
};

// Ensure user is admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'ADMIN') return next();
  res.status(403).send('Access Denied');
};

module.exports = { isAuthenticated, isAdmin };
