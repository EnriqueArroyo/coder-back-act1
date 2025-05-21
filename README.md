# Coder House – Backend

## Instalación

```bash
npm install
```

## Ejecutar

```bash
node app.js
```

Luego abre en tu navegador:

```
http://localhost:8080
```

## Endpoints de API

### Productos

- GET    /api/products  
- GET    /api/products/:pid  
- POST   /api/products  
- PUT    /api/products/:pid  
- DELETE /api/products/:pid  

### Carritos

- GET    /api/carts  
- POST   /api/carts  
- GET    /api/carts/:cid  
- POST   /api/carts/:cid/product/:pid  

## Vistas

- GET /home: Lista estática de todos los productos (Handlebars).
- GET /realtimeproducts: Actualiza lista en tiempo real (Socket.IO + Handlebars).
