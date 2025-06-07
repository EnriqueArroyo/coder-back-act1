const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");

const productsRouter = require("./src/routes/products");
const cartsRouter = require("./src/routes/carts");
const viewsRouter = require("./src/routes/views.router");
const Product = require("./src/models/Product");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose
  .connect("mongodb://localhost:27017/coderhouse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Mongo conectado"))
  .catch((err) => console.error("❌ Error al conectar Mongo", err));

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => res.redirect("/realtimeproducts"));

io.on("connection", (socket) => {
  console.log("Nueva suscripción:", socket.id);

  socket.on("newProduct", async (data) => {
    try {
      await Product.create(data);
      const all = await Product.find().lean();
      io.emit("productsUpdated", all);
    } catch (e) {
      socket.emit("error", e.message);
    }
  });

  socket.on("deleteProduct", async (pid) => {
    try {
      await Product.findByIdAndDelete(pid);
      const all = await Product.find().lean();
      io.emit("productsUpdated", all);
    } catch (e) {
      socket.emit("error", e.message);
    }
  });
});

const PORT = 8080;
httpServer.listen(PORT, () =>
  console.log(`Servidor y Sockets en http://localhost:${PORT}`)
);
