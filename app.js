// app.js
const express = require('express');
const productsRouter = require('./src/routes/products');
const cartsRouter    = require('./src/routes/carts');

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);

app.get('/', (req, res) =>
  res.send('API corriendo. Usa /api/products y /api/carts')
);

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`Servidor: http://localhost:${PORT}`)
);
