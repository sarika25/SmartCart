const express = require("express");

const { recommendProducts } = require("../controllers/aiController");

const router = express.Router();

router.post("/recommend", recommendProducts);

module.exports = router;
