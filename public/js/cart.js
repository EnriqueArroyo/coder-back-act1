
document.addEventListener('DOMContentLoaded', () => {
  const cid = window.location.pathname.split('/').pop();


  document.querySelectorAll('button.remove').forEach(btn => {
    btn.onclick = () => {
      const pid = btn.closest('tr').dataset.pid;
      fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' })
        .then(()=>location.reload());
    };
  });

  document.querySelectorAll('button.update').forEach(btn => {
    btn.onclick = () => {
      const tr  = btn.closest('tr');
      const pid = tr.dataset.pid;
      const qty = tr.querySelector('input.qty').value;
      fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ quantity: Number(qty) })
      }).then(()=>location.reload());
    };
  });


  document.getElementById('emptyCart')?.addEventListener('click', () => {
    fetch(`/api/carts/${cid}`, { method: 'DELETE' })
      .then(()=>location.reload());
  });
});
