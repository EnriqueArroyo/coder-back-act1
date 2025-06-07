const express = require("express");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const router = express.Router();

function buildLink(base, params) {
  const esc = encodeURIComponent;
  const qs = Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join("&");
  return `${base}?${qs}`;
}

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch {
    res.status(500).send("Error interno al cargar productos");
  }
});

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const lim = parseInt(limit, 10);
  const pg = parseInt(page, 10);

  const filter = query ? { category: query } : {};
  const sortOpt =
    sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

  const totalDocs = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / lim);
  const prods = await Product.find(filter)
    .sort(sortOpt)
    .skip((pg - 1) * lim)
    .limit(lim)
    .lean();

  let cart = await Cart.findOne();
  if (!cart) {
    cart = await new Cart({ products: [] }).save();
  }

  res.render("products", {
    prods,
    pagination: {
      page: pg,
      totalPages,
      prevLink:
        pg > 1
          ? buildLink("/products", { limit: lim, page: pg - 1, sort, query })
          : null,
      nextLink:
        pg < totalPages
          ? buildLink("/products", { limit: lim, page: pg + 1, sort, query })
          : null,
    },
    cartId: cart._id.toString(),
  });
});

// Detalle de un producto
router.get("/products/:pid", async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid).lean();
    if (!prod) return res.status(404).send("No existe ese producto");

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await new Cart({ products: [] }).save();
    }

    res.render("productDetail", {
      prod,
      cartId: cart._id.toString(),
    });
  } catch {
    res.status(500).send("Error interno");
  }
});

// Vista de un carrito específico
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
  } catch {
    res.status(500).send("Error interno");
  }
});

module.exports = router;
