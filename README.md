# 🛒 SmartCart — AI-Powered E-Commerce Platform

SmartCart is a full-stack e-commerce web application built using the **MERN stack** with an integrated **AI-powered shopping assistant**. It allows users to browse products, search and filter products, manage their cart and wishlist, place orders, and get personalized product recommendations through an AI chatbot.

## 🌐 Live Demo

**Live Website:** https://smartcart-pearl.vercel.app/

**Backend API:** https://smartcart-backend-3ktj.onrender.com/

**GitHub Repository:** https://github.com/sarika25/SmartCart

---

## ✨ Features

### 🛍️ Product Browsing

- Browse products across multiple categories
- Product search functionality
- Category-based filtering
- Product details page
- Product ratings and pricing
- Responsive product cards

### 🤖 AI Shopping Assistant

- AI-powered chatbot for shopping assistance
- Understands natural-language product requests
- Extracts requirements such as:
  - Product category
  - Budget
  - Features
  - Use case

- Provides personalized product recommendations
- Helps users find suitable products based on their requirements

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Session-based token management

### 🛒 Shopping Cart

- Add products to cart
- Increase/decrease product quantity
- Remove products
- Cart persists for authenticated users
- Automatic total calculation

### ❤️ Wishlist

- Add products to wishlist
- Remove products from wishlist
- User-specific wishlist

### 📦 Orders & Checkout

- Checkout process
- Place orders
- View previous orders
- Order success confirmation
- User-specific order history

### 📱 Responsive Design

- Responsive layout for desktop, tablet, and mobile devices
- Mobile-friendly navigation
- Responsive product grids and pages

---

## 🧠 AI Recommendation Flow

The AI shopping assistant processes natural-language requests and converts them into structured requirements.

For example:

> "I need wireless headphones under ₹5000 for office calls."

The AI extracts information such as:

```text
Category: Electronics
Budget: ₹5000
Use Case: Office calls
Features: Wireless
```

The backend then uses these requirements to find matching products from the product database and returns suitable recommendations.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router
- Tailwind CSS
- Vite
- HTML5
- CSS3
- Remix Icon

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt.js

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### AI

- Google Gemini API
- `@google/genai`

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Project Structure

```text
SmartCart/
│
├── client/
│   ├── public/
│   │   ├── categories/
│   │   └── products/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── package.json
│   ├── seedProducts.js
│   ├── server.js
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │       Vercel        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node + Express    │
                    │       Render        │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └────────────┐
                ▼                              ▼
       ┌─────────────────┐            ┌─────────────────┐
       │  MongoDB Atlas  │            │   Gemini API    │
       │    Database     │            │ AI Assistant    │
       └─────────────────┘            └─────────────────┘
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sarika25/SmartCart.git
```

Navigate into the project:

```bash
cd SmartCart
```

---

### 2. Install frontend dependencies

```bash
cd client
npm install
```

---

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

### Frontend

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Create:

```text
server/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

**Never commit your `.env` files or API keys to GitHub.**

---

## ▶️ Run the Application Locally

### Start the backend

From the `server` directory:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

From the `client` directory:

```bash
npm run dev
```

The frontend will run on the Vite development URL, typically:

```text
http://localhost:5173
```

---

## 📡 API Routes

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
```

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Cart

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart
DELETE /api/cart
```

### Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist
```

### Orders

```text
GET    /api/orders
POST   /api/orders
```

### AI Recommendations

```text
POST   /api/ai/recommend
```

---

## 🚀 Deployment

SmartCart uses separate deployments for the frontend and backend.

### Frontend — Vercel

The React/Vite application is deployed on Vercel.

Production API URL:

```text
https://smartcart-backend-3ktj.onrender.com/api
```

### Backend — Render

The Node.js/Express API is deployed on Render.

Production backend:

```text
https://smartcart-backend-3ktj.onrender.com
```

### Database — MongoDB Atlas

MongoDB Atlas is used as the cloud database for storing:

- Users
- Products
- Cart data
- Wishlist data
- Orders

### AI — Gemini

The Gemini API powers the AI shopping assistant and converts natural-language shopping requests into structured product requirements.

---

## 🔒 Security

The application implements:

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Environment variables for sensitive credentials
- CORS configuration for frontend/backend communication

Sensitive credentials are excluded from the Git repository using `.gitignore`.

---

## 📌 Key Learning Outcomes

Through this project, I worked with:

- Building a full-stack MERN application
- Creating reusable React components
- Managing application state using React Context
- Implementing REST APIs with Express
- MongoDB database integration using Mongoose
- JWT authentication and protected routes
- Integrating an external AI API
- Building AI-based product recommendations
- Connecting frontend and backend APIs
- Deploying a full-stack application
- Managing environment variables in production
- Git and GitHub workflow

---

## 👩‍💻 Author

**Sarika Bharti**

Frontend Developer | React.js | JavaScript | MERN Stack

GitHub: https://github.com/sarika25

---

## ⭐ Project

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
