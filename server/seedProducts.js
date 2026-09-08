require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing products
    await Product.deleteMany({});

    // Insert new products
    await Product.insertMany(products);

    console.log(`${products.length} products seeded successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
