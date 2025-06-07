
document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('products');
  if (container) {
    const cartId = container.dataset.cartId;


    const socket = io();
    socket.on('productsUpdated', () => location.reload());

    container.addEventListener('click', e => {
      if (!e.target.matches('button.add')) return;
      const pid = e.target.dataset.pid;

      fetch(`/api/carts/${cartId}/product/${pid}`, { method: 'POST' })
        .then(res => res.json())
        .then(json => {
          if (json.status === 'success') {
            alert('¡Producto agregado al carrito!');
          } else {
            alert('Error: ' + (json.error || 'No se pudo agregar'));
          }
        })
        .catch(() => alert('Error al conectar con el servidor'));
    });
  }
});
