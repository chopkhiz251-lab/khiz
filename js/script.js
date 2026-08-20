const cart = [];
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');

function money(value) { return `$${value.toLocaleString('en-US')}`; }

function renderCart() {
  cartCount.textContent = cart.length;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <div><strong>${item.name}</strong><br><small>${money(item.price)}</small></div>
        <button data-remove="${index}">Remove</button>
      </div>`).join('');
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = money(total);
}

function toggleCart(open) {
  cartPanel.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
  cartPanel.setAttribute('aria-hidden', String(!open));
}

cartButton.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.art-card');
    cart.push({ id: card.dataset.id, name: card.dataset.name, price: Number(card.dataset.price) });
    renderCart();
    toggleCart(true);
  });
});

cartItems.addEventListener('click', event => {
  const remove = event.target.closest('[data-remove]');
  if (!remove) return;
  cart.splice(Number(remove.dataset.remove), 1);
  renderCart();
});

checkoutButton.addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }
  alert('Checkout is ready to connect to your payment provider.');
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('formMessage').textContent = 'Thanks — your enquiry has been received. We will be in touch.';
  event.target.reset();
});

renderCart();
