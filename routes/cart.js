const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');

router.get('/',               isAuthenticated, getCart);
router.post('/add',           isAuthenticated, addToCart);
router.post('/remove/:itemId',isAuthenticated, removeFromCart);
router.post('/update',        isAuthenticated, updateCart);

module.exports = router;
