const Razorpay = require('razorpay');
const crypto   = require('crypto');
const db       = require('../config/db');
const { getCartWithItems, getOrCreateCart } = require('./cartController');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET /payment/checkout
const getCheckout = async (req, res) => {
  try {
    const { items, total, cartId } = await getCartWithItems(req.session.user.id);
    if (items.length === 0) return res.redirect('/cart');

    // Step 1: Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100), // paise
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    });

    // Step 2: Save pending order in DB
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_amount, status, razorpay_order_id) VALUES (?, ?, ?, ?)',
      [req.session.user.id, total, 'PENDING', rzpOrder.id]
    );
    const orderId = orderResult.insertId;

    // Step 3: Save order items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.render('checkout', {
      title:         'Checkout',
      items,
      total,
      orderId,
      rzpOrderId:    rzpOrder.id,
      rzpKeyId:      process.env.RAZORPAY_KEY_ID,
      amountInPaise: Math.round(total * 100),
      userName:      req.session.user.name,
      userEmail:     req.session.user.email,
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not initiate payment. Try again.');
    res.redirect('/cart');
  }
};

// POST /payment/success — called after Razorpay payment
const paymentSuccess = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    // Step 4: Verify signature (HMAC-SHA256)
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      req.flash('error', 'Payment verification failed!');
      return res.redirect('/cart');
    }

    // Step 5: Mark order as PAID
    const [orders] = await db.query(
      'SELECT id, total_amount FROM orders WHERE razorpay_order_id = ?',
      [razorpay_order_id]
    );
    if (orders.length === 0) return res.redirect('/');

    const order = orders[0];
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['PAID', order.id]);

    // Step 6: Save payment record
    await db.query(
      `INSERT INTO payments
        (order_id, razorpay_payment_id, razorpay_signature, status, amount)
       VALUES (?, ?, ?, ?, ?)`,
      [order.id, razorpay_payment_id, razorpay_signature, 'SUCCESS', order.total_amount]
    );

    // Step 7: Clear the cart
    const cartId = await getOrCreateCart(req.session.user.id);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    res.render('order-success', {
      title:   'Order Confirmed!',
      orderId: order.id,
      total:   order.total_amount,
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong after payment.');
    res.redirect('/');
  }
};

module.exports = { getCheckout, paymentSuccess };
