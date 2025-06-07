
const express = require('express');
const Product = require('../models/Product');
const router  = express.Router();


router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit, 10);
    page  = parseInt(page, 10);

    const filter     = query ? { category: query } : {};
    const sortOption = sort === 'asc'  ? { price: 1 }
                     : sort === 'desc' ? { price: -1 }
                     : {};

    const totalDocs  = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    const docs = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      status:      'success',
      payload:     docs,
      totalPages,
      prevPage:    page > 1           ? page - 1       : null,
      nextPage:    page < totalPages  ? page + 1       : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:    page > 1
        ? `/api/products?limit=${limit}&page=${page-1}&sort=${sort||''}&query=${query||''}`
        : null,
      nextLink:    page < totalPages
        ? `/api/products?limit=${limit}&page=${page+1}&sort=${sort||''}&query=${query||''}`
        : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid).lean();
    if (!prod) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', product: prod });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const newProd = await Product.create(req.body);
    res.status(201).json({ status: 'success', product: newProd });
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});


router.put('/:pid', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', product: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
