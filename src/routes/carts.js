// src/routes/carts.js
const express = require("express");
const CartManager = require("../CartManager");
const cm = new CartManager("./data/carts.json");
const router = express.Router();

// POST /api/carts
router.post("/", async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/carts
router.get("/", async (req, res) => {
  try {
    const carts = await cm.getCarts();
    res.json({ carts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  try {
    const cart = await cm.getCartById(cid);
    res.json({ cart });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  try {
    const updatedCart = await cm.addProductToCart(cid, pid);
    res.json({ cart: updatedCart });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
