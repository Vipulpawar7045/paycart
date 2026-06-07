const express = require('express');
const router  = express.Router();
const { getHome, getProduct } = require('../controllers/productController');

router.get('/',             getHome);
router.get('/products/:id', getProduct);

module.exports = router;
