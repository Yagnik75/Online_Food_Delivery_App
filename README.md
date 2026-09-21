# 🍔 Online Food Delivery Platform (MERN Stack)

A comprehensive, multi-vendor web application that digitalizes the food ordering process by connecting local food sellers with customers in a centralized marketplace. Built on the MERN stack, the platform gives customers a secure, real-time experience where they can browse diverse menus and order meals from multiple vendors within a single session.

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Modules](#-project-modules)
- [Backend Architecture](#-backend-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Tech Stack

| Layer              | Technologies                                |
| ------------------ | ------------------------------------------- |
| **Frontend**       | React.js, HTML5, CSS3, JSX                  |
| **Backend**        | Node.js, Express.js                         |
| **Database**       | MongoDB (via Mongoose)                      |
| **Authentication** | JSON Web Tokens (JWT) & bcrypt              |

---

## ✨ Key Features

- **Multi-Vendor Architecture**: Automatically groups and splits a customer's single cart into multiple distinct orders based on the respective sellers.
- **Dynamic Pricing**: Eliminates pricing discrepancies by ensuring shopping carts always fetch the live, up-to-date price directly from the product database.
- **Intelligent Inventory Management**: Automates stock availability by auto-hiding products when stock reaches zero and deducting stock upon successful delivery.
- **Secure Role-Based Access**: Dual authentication systems for Customers and Sellers using encrypted session tokens and a token blacklisting mechanism for secure logouts.
- **Data Integrity**: Actively filters out "ghost items" from user carts if a seller deletes a product from the catalog.

---

## 📦 Project Modules

### 1. Customer Authentication Module
Manages end-user access, identity, and data protection.

- **Register & Login**: Account creation and authentication using encrypted tokens.
- **Data Autonomy**: Secure session termination and the ability for users to permanently delete their accounts and data from the database.

### 2. Seller Authentication Module
Handles onboarding and access security specifically for restaurant owners.

- **Business Profiles**: Allows vendors to register specific shop names and gain access to specialized administrative dashboards.
- **Digital Storefront Management**: Secure logouts and complete storefront deletion capabilities.

### 3. Seller Product Management Module
Equips vendors to maintain a live, up-to-date digital menu.

- **Menu Control**: Add new food items, assign categories (Breakfast, Lunch, Dinner, Desserts), update prices, and manage stock quantities.
- **Order Fulfillment**: View shop-specific orders and update statuses (`Pending`, `Confirmed`, `Delivered`, `Cancelled`).

### 4. Customer Shopping & Checkout Module
Drives the core e-commerce functionality.

- **Dynamic Cart**: Compile items into a virtual cart with live total calculations.
- **Order Placement**: Process transactions, confirm orders with delivery addresses, and permanently record delivery details.
- **Order History**: View past orders sorted chronologically.

---

## 🛠️ Backend Architecture

The backend follows a strict MVC-inspired architecture:

| Component       | Files                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Controllers** | `cartController.js`, `customerController.js`, `productController.js`, `sellerController.js`           |
| **Models**      | `cartModel.js`, `customerModel.js`, `orderModel.js`, `productModel.js`, `sellerModel.js`, `blacklistModel.js` |
| **Middleware**  | `customerAuthMiddleware.js`, `sellerAuthMiddleware.js` (distinct route protection per role)           |

---

## 📁 Project Structure

```
online-food-delivery-platform/
├── backend/
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── customerController.js
│   │   ├── productController.js
│   │   └── sellerController.js
│   ├── middleware/
│   │   ├── customerAuthMiddleware.js
│   │   └── sellerAuthMiddleware.js
│   ├── models/
│   │   ├── blacklistModel.js
│   │   ├── cartModel.js
│   │   ├── customerModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── sellerModel.js
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables)), then start the server:

   ```bash
   npm start
   ```

3. **Set up the frontend**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Open the app**

   The React app runs at `http://localhost:3000` and communicates with the backend API (default `http://localhost:5000`).

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/` with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_super_secret_key
```


---

## 🛡️ Security

- Passwords are hashed with **bcrypt** before being stored.
- Sessions are managed with **JWT**, with separate authentication flows for customers and sellers.
- Logging out adds the token to a **blacklist**, so it can't be reused even before it expires.
- Route-level **role-based middleware** keeps customer and seller endpoints isolated from each other.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add some AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
