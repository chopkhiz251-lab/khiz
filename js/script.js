const defaultProducts = [
  {
    id: "1",
    name: "Golden Hour",
    price: 480,
    material: "Mixed media",
    size: "60 × 80 cm",
    status: "Available",
    className: "art-gold",
    description: "A warm study of light, movement and the final glow of the day."
  },
  {
    id: "2",
    name: "Quiet Forms",
    price: 620,
    material: "Acrylic on canvas",
    size: "70 × 90 cm",
    status: "Available",
    className: "art-blue",
    description: "Layered geometric forms exploring balance, space and stillness."
  },
  {
    id: "3",
    name: "Earth Study I",
    price: 390,
    material: "Oil on canvas",
    size: "50 × 70 cm",
    status: "Available",
    className: "art-earth",
    description: "An earthy composition inspired by natural textures and changing landscapes."
  },
  {
    id: "4",
    name: "After Rain",
    price: 540,
    material: "Mixed media",
    size: "60 × 60 cm",
    status: "Available",
    className: "art-pink",
    description: "A bright, atmospheric piece about renewal after a storm."
  }
];

let products = JSON.parse(localStorage.getItem("khizProducts")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("khizCart")) || [];

const money = (value) => `$${Number(value).toLocaleString("en-US")}`;

function saveProducts() {
  localStorage.setItem("khizProducts", JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem("khizCart", JSON.stringify(cart));
}

function showView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(`${view}View`)?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCart() {
  const countElement = document.getElementById("cartCount");
  const itemsElement = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  if (!countElement || !itemsElement || !totalElement) {
    return;
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  countElement.textContent = itemCount;
  totalElement.textContent = money(cartTotal);

  if (!cart.length) {
    itemsElement.innerHTML = '<p class="empty-cart">Your collection is empty.</p>';
    return;
  }

  itemsElement.innerHTML = cart
    .map(
      (item) => `
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

          <button data-action="remove" data-id="${item.id}">
            Remove
          </button>
        </div>
      `
    )
    .join("");
}

function openCart() {
  document.getElementById("cartPanel")?.classList.add("open");
  document.getElementById("overlay")?.classList.add("show");
}

function closeCartPanel() {
  document.getElementById("cartPanel")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("show");
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  openCart();
}

function renderProductGrid() {
  const grid = document.getElementById("artGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
        <article class="art-card" data-id="${product.id}">
          <div class="art-image ${product.className}">
            <span>${String(product.id).padStart(2, "0")}</span>
          </div>

          <div class="art-info">
            <div>
              <p class="art-number">
                ${product.status.toUpperCase()} · 2026
              </p>
              <h3>${product.name}</h3>
              <p>${product.material} · ${product.size}</p>
            </div>

            <strong>${money(product.price)}</strong>
          </div>

          <button class="add-button">Add to collection</button>
        </article>
      `
    )
    .join("");

  grid.querySelectorAll(".art-card").forEach((card) => {
    const product = products.find((item) => item.id === card.dataset.id);

    if (!product) {
      return;
    }

    card.addEventListener("click", (event) => {
      if (!event.target.closest("button")) {
        openArtwork(product.id);
      }
    });

    card.querySelector(".add-button")?.addEventListener("click", () => {
      addToCart(product);
    });
  });
}

function openArtwork(id) {
  const product = products.find((item) => item.id === id) || products[0];
  const detail = document.getElementById("artworkDetail");

  if (!detail || !product) {
    return;
  }

  detail.innerHTML = `
    <div class="detail-art art-image ${product.className}">
      <span>ORIGINAL · ${product.status}</span>
    </div>

    <div class="detail-copy">
      <p class="eyebrow">KHIZ ART · ${product.status.toUpperCase()}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${money(product.price)}</p>
      <p class="detail-description">${product.description}</p>

      <div class="specs">
        <div>
          <small>MATERIAL</small>
          <strong>${product.material}</strong>
        </div>
        <div>
          <small>SIZE</small>
          <strong>${product.size}</strong>
        </div>
      </div>

      <button class="button button-gold" id="detailAdd">
        Add to collection
      </button>

      <button class="text-link" id="detailBuy" type="button">
        Buy now →
      </button>

      <div class="shipping-note">
        <strong>Shipping</strong>
        <p>
          Carefully packed and prepared for delivery. Shipping details will
          be confirmed at checkout.
        </p>
      </div>
    </div>
  `;

  document.getElementById("detailAdd").addEventListener("click", () => {
    addToCart(product);
  });

  document.getElementById("detailBuy").addEventListener("click", () => {
    addToCart(product);
    closeCartPanel();
    showCheckout();
  });

  showView("artwork");
}

function showCheckout() {
  showView("checkout");
  renderCheckout();
}

function renderCheckout() {
  const summary = document.getElementById("checkoutSummary");
  const button = document.getElementById("placeOrder");

  if (!summary) {
    return;
  }

  if (!cart.length) {
    summary.innerHTML = `
      <p>
        Your collection is empty. Return to the collection to add artwork.
      </p>
    `;

    if (button) {
      button.disabled = true;
    }

    return;
  }

  if (button) {
    button.disabled = false;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 500 ? 0 : 35;

  summary.innerHTML = `
    ${cart
      .map(
        (item) => `
          <div class="summary-row">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${money(item.price * item.quantity)}</strong>
          </div>
        `
      )
      .join("")}

    <div class="summary-row">
      <span>Shipping</span>
      <strong>${shipping ? money(shipping) : "Complimentary"}</strong>
    </div>

    <div class="summary-total">
      <span>Total</span>
      <strong>${money(subtotal + shipping)}</strong>
    </div>
  `;
}

function renderAdmin() {
  const list = document.getElementById("adminList");

  if (!list) {
    return;
  }

  if (!products.length) {
    list.innerHTML = "<p>No artworks yet.</p>";
    return;
  }

  list.innerHTML = products
    .map(
      (product) => `
        <div class="admin-item">
          <div>
            <strong>${product.name}</strong>
            <small>
              ${product.status} · ${money(product.price)} · ${product.size}
            </small>
          </div>

          <button data-delete="${product.id}">Delete</button>
        </div>
      `
    )
    .join("");
}

function setupNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

function setupViewNavigation() {
  document.querySelectorAll("[data-view]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const view = event.currentTarget.dataset.view;
      const href = event.currentTarget.getAttribute("href") || "";
      const hash = href.replace("#", "");

      showView(view);

      if (view === "home" && hash && hash !== "home") {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({
            behavior: "smooth"
          });
        }, 80);
      }
    });
  });
}

function setupCart() {
  document.getElementById("cartButton")?.addEventListener("click", openCart);
  document.getElementById("closeCart")?.addEventListener("click", closeCartPanel);
  document.getElementById("overlay")?.addEventListener("click", closeCartPanel);

  document.getElementById("checkoutButton")?.addEventListener("click", () => {
    if (!cart.length) {
      alert("Your collection is empty.");
      return;
    }

    closeCartPanel();
    showCheckout();
  });

  document.getElementById("cartItems")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const id = button.dataset.id;
    const item = cart.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    if (button.dataset.action === "increase") {
      item.quantity += 1;
    }

    if (button.dataset.action === "decrease") {
      item.quantity -= 1;
    }

    if (button.dataset.action === "remove" || item.quantity <= 0) {
      cart = cart.filter((entry) => entry.id !== id);
    }

    saveCart();
    renderCart();
  });
}

function setupCheckout() {
  document.getElementById("checkoutForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const orderNumber = `KHZ-${Date.now().toString().slice(-6)}`;
    const message = document.getElementById("orderMessage");

    message.innerHTML = `
      <strong>Order ${orderNumber} received.</strong><br>
      Thank you, ${form.get("name")}. Payment integration will be connected
      in the next phase.
    `;

    cart = [];
    saveCart();
    renderCart();
    renderCheckout();
    event.target.reset();
  });
}

function setupContactForm() {
  document.getElementById("contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    document.getElementById("formMessage").textContent =
      "Thanks — your enquiry has been received. We will be in touch.";

    event.target.reset();
  });
}

function setupAdmin() {
  document.getElementById("productForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    products.push({
      id: Date.now().toString(),
      name: form.get("name"),
      price: Number(form.get("price")),
      material: form.get("material"),
      size: form.get("size"),
      status: form.get("status"),
      className: form.get("className"),
      description: "New artwork — add a description later."
    });

    saveProducts();
    renderProductGrid();
    renderAdmin();
    event.target.reset();
  });

  document.getElementById("adminList")?.addEventListener("click", (event) => {
    const id = event.target.dataset.delete;

    if (!id) {
      return;
    }

    products = products.filter((product) => product.id !== id);
    saveProducts();
    renderProductGrid();
    renderAdmin();
  });
}

window.openAdmin = () => {
  showView("admin");
  renderAdmin();
};

renderProductGrid();
renderCart();
setupNavigation();
setupViewNavigation();
setupCart();
setupCheckout();
setupContactForm();
setupAdmin();
