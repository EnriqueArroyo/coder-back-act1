const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    res.status(201).json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().lean();
    res.json({ status: "success", payload: carts });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Verificar que el producto existe
    const prod = await Product.findById(pid);
    if (!prod)
      return res
        .status(404)
        .json({ status: "error", error: "Producto no encontrado" });

    const cart = await Cart.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (item) {
      item.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    const updated = await cart.populate("products.product");
    res.json({ status: "success", cart: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    const updated = await cart.populate("products.product");
    res.json({ status: "success", cart: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    ).populate("products.product");
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (!item)
      return res
        .status(404)
        .json({ status: "error", error: "Producto no en el carrito" });

    item.quantity = quantity;
    await cart.save();
    const updated = await cart.populate("products.product");
    res.json({ status: "success", cart: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

module.exports = router;
