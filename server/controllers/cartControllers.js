const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    } else {
      // Remove items whose products no longer exist
      const validItems = cart.items.filter((item) => item.product !== null);

      if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
      }
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product && item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      message: "Failed to add product to cart",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product && item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    // Remove product when quantity becomes 0
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product && item.product.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    // Remove any invalid product references
    cart.items = cart.items.filter((item) => item.product);

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    // Remove products that no longer exist in database
    updatedCart.items = updatedCart.items.filter(
      (item) => item.product !== null,
    );

    await updatedCart.save();

    res.json(updatedCart);
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      message: "Failed to update cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
};
