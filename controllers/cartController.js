const db = require('../config/db');

// Helper: get or create cart for user
const getOrCreateCart = async (userId) => {
  let [rows] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }
  return rows[0].id;
};

// Helper: get full cart with items
const getCartWithItems = async (userId) => {
  const cartId = await getOrCreateCart(userId);
  const [items] = await db.query(
    `SELECT ci.id, ci.quantity, p.id as product_id,
            p.name, p.price, p.image_url,
            (p.price * ci.quantity) as subtotal
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
  const total = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
  return { cartId, items, total };
};

// GET /cart
const getCart = async (req, res) => {
  try {
    const { items, total } = await getCartWithItems(req.session.user.id);
    res.render('cart', { title: 'Your Cart', items, total });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// POST /cart/add
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const cartId = await getOrCreateCart(req.session.user.id);
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }
    req.flash('success', 'Item added to cart!');
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// POST /cart/remove/:itemId
const removeFromCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.itemId]);
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
};

// POST /cart/update
const updateCart = async (req, res) => {
  const { itemId, quantity } = req.body;
  try {
    if (parseInt(quantity) <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    }
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCart, getCartWithItems, getOrCreateCart };
