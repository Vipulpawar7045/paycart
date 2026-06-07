const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getCheckout, paymentSuccess } = require('../controllers/paymentController');

router.get('/checkout',  isAuthenticated, getCheckout);
router.post('/success',  isAuthenticated, paymentSuccess);

module.exports = router;
