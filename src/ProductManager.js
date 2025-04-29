// src/ProductManager.js
const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor(filePath) { //le paso la ruta en el constructor y la guardo
    this.path = filePath;
    this._init();
  }

  async _init() {
    
    const dir = path.dirname(this.path); // busco la ruta
    await fs.mkdir(dir, { recursive: true }); //si no esta la carpeta la creo
    try {
      await fs.access(this.path); //busco el archivo
    } catch {
      await fs.writeFile(this.path, JSON.stringify([], null, 2), 'utf-8'); //si no existe lo creo
    }
  }

  async getProducts() { //me traigo los productos
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async addProduct(product) { //metodo para crear productos nuevos
    const {
      title,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnails
    } = product;

    // Me fijo y aviso si falto algun campo por poner
    if (
      !title ||
      !description ||
      typeof price !== 'number' ||
      !code ||
      typeof status !== 'boolean' ||
      typeof stock !== 'number' ||
      !category ||
      !Array.isArray(thumbnails)
    ) {
      throw new Error('Faltan campos');
    }

    
    const products = await this.getProducts();
    const newId = products.length
      ? products[products.length - 1].id + 1 //me fijo y calculo el nuevo id, sino le asigno 1
      : 1;

    
    const newProduct = { //se crea el nuevo producto
      id: newId,
      title,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnails
    };

    
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8'); //Guardamos

    return newProduct; // devolvemos los datos del nuevo producto
  }

  async getProductById(id) { // nos traemos el producto esta vez por ID
    const products = await this.getProducts();
    const search = products.find(p => p.id === id);
    if (!search) throw new Error(`El productocon id${id} no se encuentra`);
    return search;
  }


   async updateProduct(id, updates) { //Update pero sin permitir que se modifique el ID
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) throw new Error(`El productocon id${id} no se encuentra`);
    delete updates.id;
    products[idx] = { ...products[idx], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return products[idx];
  }


  async deleteProduct(id) { // Delete del producto por ID
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) {
      throw new Error(`El productocon id${id} no se encuentra`);
    }
    const [deletedProduct] = products.splice(idx, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return deletedProduct; // devuelvo el producto borrado
  }
  
}

module.exports = ProductManager;
