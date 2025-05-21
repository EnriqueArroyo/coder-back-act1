const express = require('express');
const ProductManager = require('../ProductManager');
const pm = new ProductManager('./data/products.json');
const router = express.Router();

router.get('/home', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await pm.getProducts();
  res.render('realTimeProducts', { products });
});

module.exports = router;
