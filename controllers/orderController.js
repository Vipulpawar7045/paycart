const db = require('../config/db');

// GET /orders — user's order history
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.user.id]
    );

    // Attach items to each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.render('orders', { title: 'My Orders', orders });
  } catch (err) {
    console.error(err);
    res.render('orders', { title: 'My Orders', orders: [] });
  }
};

module.exports = { getOrders };
