const express = require('express');
const router  = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.use(isAuthenticated, isAdmin); // protect all admin routes

router.get('/',                    ctrl.getDashboard);
router.get('/products/add',        ctrl.getAddProduct);
router.post('/products/add',       ctrl.postAddProduct);
router.get('/products/edit/:id',   ctrl.getEditProduct);
router.post('/products/edit/:id',  ctrl.postEditProduct);
router.post('/products/delete/:id',ctrl.deleteProduct);
router.get('/orders',              ctrl.getAllOrders);

module.exports = router;
