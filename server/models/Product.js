const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: null,
    },

    features: {
      type: [String],
      default: [],
    },

    useCase: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
