// src/routes/products.js
const express = require("express");
const ProductManager = require("../ProductManager");
const pm = new ProductManager("./data/products.json");

const router = express.Router(); 


router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const product = await pm.getProductById(pid);
    res.json({ product });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    const io = req.app.get("io");
    const allProducts = await pm.getProducts();
    io.emit("productsUpdated", allProducts);

    res.status(201).json({ product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:pid 
router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const updated = await pm.updateProduct(pid, req.body);

    const io = req.app.get("io");
    const allProducts = await pm.getProducts();
    io.emit("productsUpdated", allProducts);

    res.json({ product: updated });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const deleted = await pm.deleteProduct(pid);
    const io = req.app.get("io");
    const allProducts = await pm.getProducts();
    io.emit("productsUpdated", allProducts);

    res.status(200).json({ deleted });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
