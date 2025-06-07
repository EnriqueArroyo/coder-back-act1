# Coder House – Backend
## Instalación

npm install

## Ejecución

node app.js

Luego abre en tu navegador:

http://localhost:8080

---
## API REST

### Productos
- GET  /api/products  
  Opcional: ?limit=<n>&page=<n>&sort=asc|desc&query=<categoría>
- GET  /api/products/:pid
- POST /api/products
- PUT  /api/products/:pid
- DELETE /api/products/:pid

### Carritos
- POST   /api/carts
- GET    /api/carts
- GET    /api/carts/:cid
- POST   /api/carts/:cid/product/:pid
- PUT    /api/carts/:cid
- PUT    /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid

---
### Vistas (Handlebars + Socket.IO)
- GET /realtimeproducts
  Admin: lista en tiempo real, crea y borra productos vía WebSocket
- GET /products
  Cliente: catálogo paginado con botón + Carrito
- GET /products/:pid
  Detalle: ficha con botón “Agregar al carrito” y navegación
- GET /carts/:cid
  Carrito: ver y gestionar (cantidad, eliminar, vaciar)