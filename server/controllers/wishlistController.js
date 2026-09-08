const Wishlist = require("../models/Wishlist");

// Get logged-in user's wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.userId,
    }).populate("products");

    // If user doesn't have a wishlist yet, create one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.userId,
        products: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({
      user: req.userId,
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.userId,
        products: [],
      });
    }

    // Check if product already exists
    const alreadyExists = wishlist.products.some(
      (product) => product.toString() === productId,
    );

    if (alreadyExists) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    wishlist.products.push(productId);

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({
      user: req.userId,
    }).populate("products");

    res.json(updatedWishlist);
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    res.status(500).json({
      message: "Failed to add product to wishlist",
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({
      user: req.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId,
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({
      user: req.userId,
    }).populate("products");

    res.json(updatedWishlist);
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);

    res.status(500).json({
      message: "Failed to remove product from wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
