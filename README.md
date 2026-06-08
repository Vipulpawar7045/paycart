# 🛒 PayCart

<div align="center">

### Full Stack E-Commerce Platform

Built with **Node.js • Express.js • MySQL • EJS • Razorpay**

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Web_Framework-black)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-purple)

A full-stack e-commerce platform that enables users to browse products, manage carts, place orders, and make secure payments through Razorpay.

</div>

---

## ✨ Features

### 👤 User Features

* Secure Registration & Login
* Product Search
* Browse Products
* Add to Cart
* Checkout System
* Razorpay Payment Integration
* Order History

### 👨‍💼 Admin Features

* Product Management
* Add Products
* Edit Products
* Delete Products
* Inventory Management
* Order Monitoring

---

## 🛠️ Tech Stack

| Category               | Technologies               |
| ---------------------- | -------------------------- |
| Backend                | Node.js, Express.js        |
| Frontend               | EJS, HTML, CSS, JavaScript |
| Database               | MySQL                      |
| Authentication         | Express Session            |
| Payment Gateway        | Razorpay                   |
| Environment Management | dotenv                     |

---

## 📁 Project Structure

```text
paycart
│
├── config
│   └── db.js
│
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── paymentController.js
│   └── productController.js
│
├── middleware
│   └── auth.js
│
├── public
│   └── css
│       └── style.css
│
├── routes
│
├── views
│
├── .env
├── app.js
├── database.sql
├── package.json
└── package-lock.json
```

---

## 📸 Screenshots

### 🏠 Home Page

<img width="1831" height="853" alt="image" src="https://github.com/user-attachments/assets/f4b19f16-4cf6-4037-aee1-9488d6f420f0" />


### 🔐 Login Page

<img width="436" height="502" alt="image" src="https://github.com/user-attachments/assets/27d1d1c4-8d1a-4622-b9a3-e76dab7f7518" />


### 👨‍💼 Admin Dashboard

<img width="1849" height="781" alt="image" src="https://github.com/user-attachments/assets/d6d13a53-8ef7-454b-99d1-3af9915714a9" />


### ➕ Add Product

<img width="589" height="763" alt="image" src="https://github.com/user-attachments/assets/123e534c-cdd6-4b8f-8aec-5d49e24cddad" />


### 💳 Checkout & Razorpay Payment

<img width="1281" height="420" alt="image" src="https://github.com/user-attachments/assets/75265732-5871-4e3c-9505-db2ce31c5232" />


---

## 🚀 Installation

```bash
git clone https://github.com/Vipulpawar7045/paycart.git

cd paycart

npm install
```

Configure your `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=paycart

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Import database:

```bash
mysql -u root -p < database.sql
```

Run the project:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## 💳 Razorpay Payment Flow

```text
User Login
     ↓
Browse Products
     ↓
Add To Cart
     ↓
Checkout
     ↓
Razorpay Payment Gateway
     ↓
Payment Verification
     ↓
Order Confirmation
```

---

## 👨‍💻 Developer

**Vipul Pawar**

B.Tech Information Technology

🔗 GitHub: https://github.com/Vipulpawar7045

🔗 LinkedIn: https://linkedin.com/in/vipulpawar7045

---

⭐ If you found this project useful, consider giving it a star.
