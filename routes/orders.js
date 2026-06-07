const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { getOrders } = require('../controllers/orderController');

router.get('/', isAuthenticated, getOrders);

module.exports = router;
