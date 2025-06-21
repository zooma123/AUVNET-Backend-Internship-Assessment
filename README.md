# AUVNET-Backend-Internship-Assessment
# 🛒 Auvne E-Commerce Platform (Full Stack MERN)

Welcome to **Auvne**, a full-stack **E-Commerce web application** built with:

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose

---

## 📌 Features

- 🌐 **Browse Products** by:
  - **Category**
  - **Subcategory**
  - **Sub-subcategory**
- 💖 **Wishlist System** — save products you love
- 🛠️ **Admin Panel**:
  - Manage Admins
  - Create/Update/Delete Products
  - Manage Categories & Subcategories
- 🧩 **Modular Backend** with Mongoose and Express

---

## 🗂️ ER Diagram

Here's the full ER Diagram for the project:

![ER Diagram](./Er%20DIAGRAM%20FOR%20AUVNE.JPG)
hint : if We Use SQL DATABASE We Should make Linking Table Between Products and wishlist Containing their Keys  Because Of they have Relation Many To Many 

---

## 🚀 How to Run the Project

### 🔧 Backend
```bash
# Start the server (inside the backend folder)
node index.js
# or (for auto-restart on file changes)
nodemon
```

### 💻 Frontend
```bash
# Go to the frontend folder
cd frontend , cd e-comm
# Install dependencies
npm install
# Start React app
npm start
```

---

## 📁 Folder Structure

```
📦project-root
 ┣ 📂frontend         # React app
 ┣  backend          # Express + MongoDB
 ┣ 📜README.md
 ┗ 🖼️ ER DIAGRAM FOR AUVNE.JPG
```

---

## ✅ Future Enhancements

- Add Cart and Checkout System
- Payment Gateway (Stripe or PayPal)
- User Order History
- Product Ratings & Reviews

