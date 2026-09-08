const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create a new order from the user's cart
const createOrder = async (req, res) => {
  try {
    // Find the logged-in user's cart
    const cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    // Check whether cart exists
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Check whether cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Create order items using a product snapshot
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    console.log("ORDER ITEMS:", orderItems);
    // Calculate total amount
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Create order
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
    });

    // Clear the cart after successful order creation
    cart.items = [];

    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// Get all orders belonging to logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
