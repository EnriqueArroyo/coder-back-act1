const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

  async getProducts() { 
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async addProduct(product) { 
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
      ? products[products.length - 1].id + 1 : 1;

    
    const newProduct = { 
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
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8'); 

    return newProduct; 
  }

  async getProductById(id) { 
    const products = await this.getProducts();
    const search = products.find(p => p.id === id);
    if (!search) throw new Error(`El productocon id${id} no se encuentra`);
    return search;
  }


   async updateProduct(id, updates) { 
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) throw new Error(`El productocon id${id} no se encuentra`);
    delete updates.id;
    products[idx] = { ...products[idx], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return products[idx];
  }


  async deleteProduct(id) {
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) {
      throw new Error(`El productocon id${id} no se encuentra`);
    }
    const [deletedProduct] = products.splice(idx, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    return deletedProduct; 
  }
  
}

module.exports = ProductManager;
