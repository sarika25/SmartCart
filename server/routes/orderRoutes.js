const express = require("express");

const protect = require("../middleware/authMiddleware");

const { createOrder, getMyOrders } = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/", protect, getMyOrders);

module.exports = router;
