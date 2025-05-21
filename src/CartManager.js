
const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) { 
    this.path = filePath;
    this._init();
  }

  async _init() {
    const dir = path.dirname(this.path); 
    await fs.mkdir(dir, { recursive: true }); 
    try {
      await fs.access(this.path); 
    } catch {
      await fs.writeFile(this.path, JSON.stringify([], null, 2), 'utf-8'); 
    }
  }

  async getCarts() { 
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async createCart() { 
    const carts = await this.getCarts();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1; 
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    return newCart;
  }

  async getCartById(id) { 
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === id);
    if (!cart) throw new Error(`No se encuetra carrito con ${id}`);
    return cart;
  }

  async addProductToCart(cid, pid) { 
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => c.id === cid);
    if (idx < 0) throw new Error(`No se encuetra carrito con ${id}`); 

    const cart = carts[idx];
    const prodIndex = cart.products.findIndex(p => p.product === pid);
    if (prodIndex < 0) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity++;
    }

    carts[idx] = cart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    return cart;
  }
}

module.exports = CartManager;
