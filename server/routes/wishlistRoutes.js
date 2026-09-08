const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", protect, getWishlist);

router.post("/add", protect, addToWishlist);

router.delete("/remove", protect, removeFromWishlist);

module.exports = router;
