const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCartItem,
} = require("../controllers/cartControllers");

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/update", protect, updateCartItem);

module.exports = router;
