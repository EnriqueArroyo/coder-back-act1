const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");
const viewsRouter = require("./src/routes/views.router");
const ProductManager = require('./src/ProductManager');
const pm = new ProductManager('./data/products.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.set("io", io);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => res.redirect("/realtimeproducts"));

io.on('connection', socket => {
  console.log('Nueva suscripcion al skt:', socket.id);

  socket.on('newProduct', async data => {
    try {
      await pm.addProduct(data);
      const all = await pm.getProducts();
      io.emit('productsUpdated', all);
    } catch (e) {
      socket.emit('error', e.message);
    }
  });

  socket.on('deleteProduct', async pid => {
    try {
      await pm.deleteProduct(pid);
      const all = await pm.getProducts();
      io.emit('productsUpdated', all);
    } catch (e) {
      socket.emit('error', e.message);
    }
  });
});


const PORT = 8080;
httpServer.listen(PORT, () =>
  console.log(`Servidor y Sockets en http://localhost:${PORT}`)
);
