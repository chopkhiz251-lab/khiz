const defaultProducts = [
  { id: "1", name: "Golden Hour", price: 480, material: "Mixed media", size: "60 × 80 cm", status: "Available", className: "art-gold", description: "A warm study of light, movement and the final glow of the day." },
  { id: "2", name: "Quiet Forms", price: 620, material: "Acrylic on canvas", size: "70 × 90 cm", status: "Available", className: "art-blue", description: "Layered geometric forms exploring balance, space and stillness." },
  { id: "3", name: "Earth Study I", price: 390, material: "Oil on canvas", size: "50 × 70 cm", status: "Available", className: "art-earth", description: "An earthy composition inspired by natural textures and changing landscapes." },
  { id: "4", name: "After Rain", price: 540, material: "Mixed media", size: "60 × 60 cm", status: "Available", className: "art-pink", description: "A bright, atmospheric piece about renewal after a storm." }
];

const products = JSON.parse(localStorage.getItem("khizProducts")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("khizCart")) || [];

function money(value) {
  return `$${Number(value).toLocaleString("en-US")}`;
}

function saveCart() {
  localStorage.setItem("khizCart", JSON.stringify(cart));
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!countEl || !itemsEl || !totalEl) return;

  countEl.textContent = count;
  if (!cart.length) {
    itemsEl.innerHTML = '<p class="empty-cart">Your collection is empty.</p>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <div class="cart-quantity">
            <button data-action="decrease" data-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
          <small>${money(item.price)} each</small>
        </div>
        <button data-action="remove" data-id="${item.id}">Remove</button>
      </div>`).join("");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = money(total);
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
  saveCart();
  renderCart();
  openCart();
}

function openCart() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  if (!panel || !overlay) return;
  panel.classList.add("open");
  overlay.classList.add("show");
  panel.setAttribute("aria-hidden", "false");
}

function closeCartPanel() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  if (!panel || !overlay) return;
  panel.classList.remove("open");
  overlay.classList.remove("show");
  panel.setAttribute("aria-hidden", "true");
}

function setupCart() {
  const cartButton = document.getElementById("cartButton");
  const closeButton = document.getElementById("closeCart");
  const overlay = document.getElementById("overlay");
  const items = document.getElementById("cartItems");
  const checkoutButton = document.getElementById("checkoutButton");

  cartButton?.addEventListener("click", openCart);
  closeButton?.addEventListener("click", closeCartPanel);
  overlay?.addEventListener("click", closeCartPanel);

  items?.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = cart.find(entry => entry.id === button.dataset.id);
    if (!item) return;

    if (button.dataset.action === "increase") item.quantity += 1;
    if (button.dataset.action === "decrease") item.quantity -= 1;
    if (button.dataset.action === "remove" || item.quantity <= 0) {
      cart = cart.filter(entry => entry.id !== button.dataset.id);
    }
    saveCart();
    renderCart();
  });

  checkoutButton?.addEventListener("click", () => {
    if (!cart.length) {
      alert("Your collection is empty.");
      return;
    }
    window.location.href = "checkout.html";
  });
}

function setupProductCards() {
  document.querySelectorAll(".art-card").forEach(card => {
    const product = products.find(item => item.id === card.dataset.id);
    if (!product) return;
    card.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      window.location.href = `artwork.html?id=${encodeURIComponent(product.id)}`;
    });
    card.querySelector(".add-button")?.addEventListener("click", () => addToCart(product));
  });
}

function renderProductGrid() {
  const grid = document.getElementById("artGrid");
  if (!grid) return;
  grid.innerHTML = products.map(product => `
    <article class="art-card" data-id="${product.id}">
      <div class="art-image ${product.className}"><span>${String(product.id).padStart(2, "0")}</span></div>
      <div class="art-info">
        <div>
          <p class="art-number">${product.status.toUpperCase()} · 2026</p>
          <h3>${product.name}</h3>
          <p>${product.material} · ${product.size}</p>
        </div>
        <strong>${money(product.price)}</strong>
      </div>
      <button class="add-button">Add to collection</button>
    </article>`).join("");
  setupProductCards();
}

function setupNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => nav?.classList.remove("open")));
}

function setupContactForm() {
  document.getElementById("contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    document.getElementById("formMessage").textContent = "Thanks — your enquiry has been received. We will be in touch.";
    event.target.reset();
  });
}

function setupArtworkPage() {
  const container = document.getElementById("artworkDetail");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id") || "1";
  const product = products.find(item => item.id === id) || products[0];
  document.title = `${product.name} — Khiz Art`;
  container.innerHTML = `
    <div class="detail-art art-image ${product.className}"><span>ORIGINAL · ${product.status}</span></div>
    <div class="detail-copy">
      <p class="eyebrow">KHIZ ART · ${product.status.toUpperCase()}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${money(product.price)}</p>
      <p class="detail-description">${product.description}</p>
      <div class="specs"><div><small>MATERIAL</small><strong>${product.material}</strong></div><div><small>SIZE</small><strong>${product.size}</strong></div></div>
      <button class="button button-gold" id="detailAdd">Add to collection</button>
      <a class="text-link" href="checkout.html">Buy now →</a>
      <div class="shipping-note"><strong>Shipping</strong><p>Carefully packed and prepared for delivery. Shipping details will be confirmed at checkout.</p></div>
    </div>`;
  document.getElementById("detailAdd").addEventListener("click", () => addToCart(product));
}

function setupCheckout() {
  const summary = document.getElementById("checkoutSummary");
  if (!summary) return;
  if (!cart.length) {
    summary.innerHTML = '<p>Your collection is empty. <a href="index.html#shop">Return to the collection →</a></p>';
    document.getElementById("placeOrder")?.setAttribute("disabled", "true");
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 35;
  const total = subtotal + shipping;
  summary.innerHTML = `${cart.map(item => `<div class="summary-row"><span>${item.name} × ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")}<div class="summary-row"><span>Shipping</span><strong>${shipping ? money(shipping) : "Complimentary"}</strong></div><div class="summary-total"><span>Total</span><strong>${money(total)}</strong></div>`;

  document.getElementById("checkoutForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const orderNumber = `KHZ-${Date.now().toString().slice(-6)}`;
    document.getElementById("orderMessage").innerHTML = `<strong>Order ${orderNumber} received.</strong><br>Thank you, ${form.get("name")}. Payment integration will be connected in the next phase.`;
    cart = [];
    saveCart();
    renderCart();
    event.target.reset();
  });
}

renderProductGrid();
setupCart();
setupNavigation();
setupContactForm();
setupArtworkPage();
setupCheckout();
renderCart();
