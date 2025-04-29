// src/CartManager.js
const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) { // le paso la ruta para leer el json de carritos en el argumento del constructor
    this.path = filePath;
    this._init();
  }

  async _init() {
    const dir = path.dirname(this.path); //busco la carpeta en la ruta
    await fs.mkdir(dir, { recursive: true }); // con esto creo la carpeta si no existe
    try {
      await fs.access(this.path); //busco el archivo
    } catch {
      await fs.writeFile(this.path, JSON.stringify([], null, 2), 'utf-8'); //lo creo si no existe
    }
  }

  async getCarts() { //nos traemos los carritos
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async createCart() { //creamos carrito nuevo
    const carts = await this.getCarts();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1; //validamos el id y que sea incrementable
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    return newCart;
  }

  async getCartById(id) { //traigo carrito por ID
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === id);
    if (!cart) throw new Error(`No se encuetra carrito con ${id}`);
    return cart;
  }

  async addProductToCart(cid, pid) { //valida encontrar el carrito del endpooint y el producto, si existe, le agrega una unidad a la cantidad
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => c.id === cid);
    if (idx < 0) throw new Error(`No se encuetra carrito con ${id}`); 

    const cart = carts[idx];
    const prodIndex = cart.products.findIndex(p => p.product === pid);
    if (prodIndex < 0) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity++; //Agrego una unidad al producto dentro del carrito
    }

    carts[idx] = cart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    return cart;
  }
}

module.exports = CartManager;
