-- Run this file once to set up the database
-- mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS paycart_db;
USE paycart_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('CUSTOMER','ADMIN') DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  category    VARCHAR(100),
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cart_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  FOREIGN KEY (cart_id)    REFERENCES cart(id)     ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  total_amount      DECIMAL(10,2) NOT NULL,
  status            ENUM('PENDING','PAID','FAILED') DEFAULT 'PENDING',
  razorpay_order_id VARCHAR(200),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  order_id            INT NOT NULL,
  razorpay_payment_id VARCHAR(200),
  razorpay_signature  VARCHAR(500),
  status              ENUM('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  amount              DECIMAL(10,2),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Sample Products
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Wireless Headphones', 'High quality sound with 20hr battery life', 1999.00, 50, 'Electronics', 'https://placehold.co/400x280/4F46E5/white?text=Headphones'),
('Mechanical Keyboard', 'RGB backlit with tactile switches', 2999.00, 30, 'Electronics', 'https://placehold.co/400x280/7C3AED/white?text=Keyboard'),
('Running Shoes', 'Lightweight breathable mesh design', 1499.00, 100, 'Footwear', 'https://placehold.co/400x280/10B981/white?text=Shoes'),
('Water Bottle', 'Stainless steel 1L insulated bottle', 499.00, 200, 'Accessories', 'https://placehold.co/400x280/F59E0B/white?text=Bottle'),
('Desk Lamp', 'LED with 3 brightness levels and USB port', 899.00, 75, 'Home', 'https://placehold.co/400x280/EF4444/white?text=Lamp'),
('Backpack', '30L waterproof with laptop compartment', 1299.00, 60, 'Accessories', 'https://placehold.co/400x280/06B6D4/white?text=Backpack');
