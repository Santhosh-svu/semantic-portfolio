import { products, categories, formatPrice } from "./products.js";
import { getCart, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal } from "./cart.js";
import { navigate, currentRoute } from "./router.js";

const app = document.querySelector("#app");
const countEl = document.querySelector("#cart-count");
const cartButton = document.querySelector("#cart-button");
const toast = document.querySelector("#toast");
let searchTerm = "";
let activeCategory = "All";
let sortMode = "featured";
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
}
function refreshCartCount() { countEl.textContent = cartCount(); }
function productCard(product) {
  return `<article class="product-card">
    <div class="product-image-wrap" data-route="#/product/${product.id}" tabindex="0" role="link" aria-label="View ${product.name}">
      ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" width="480" height="480">
    </div>
    <div class="product-info">
      <span class="product-category">${product.category} · ${product.color}</span>
      <a class="product-title" href="#/product/${product.id}">${product.name}</a>
      <div class="product-bottom"><span class="price">${formatPrice(product.price)}</span>
      <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button></div>
    </div>
  </article>`;
}
function visibleProducts() {
  let list = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(searchTerm.toLowerCase()));
  if (sortMode === "price-low") list.sort((a,b) => a.price-b.price);
  if (sortMode === "price-high") list.sort((a,b) => b.price-a.price);
  if (sortMode === "name") list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}
function renderShop() {
  app.innerHTML = `<section class="hero">
    <div><span class="eyebrow">Good things, thoughtfully chosen</span>
      <h1>Make room for the everyday.</h1>
      <p>Useful objects with considered design, honest materials and a little more joy built in.</p>
      <a class="primary-button" href="#products">Explore the collection <span aria-hidden="true">&nbsp;↘</span></a>
    </div><img class="hero-art" src="assets/hero.svg" alt="Illustration of everyday objects" width="640" height="500" fetchpriority="high">
  </section>
  <section class="section" id="products">
    <div class="section-heading"><div><span class="eyebrow">The collection</span><h2>Find your next favourite.</h2><p>Eight useful finds for home, work and everywhere between.</p></div><span id="result-count">${products.length} items</span></div>
    <div class="toolbar">
      <label class="search-box"><input id="search-input" type="search" placeholder="Search products…" aria-label="Search products" value="${searchTerm.replaceAll('"',"&quot;")}"></label>
      <label><span class="sr-only"></span><select id="sort-select" aria-label="Sort products">
        <option value="featured" ${sortMode==="featured"?"selected":""}>Featured</option><option value="price-low" ${sortMode==="price-low"?"selected":""}>Price: low to high</option><option value="price-high" ${sortMode==="price-high"?"selected":""}>Price: high to low</option><option value="name" ${sortMode==="name"?"selected":""}>Name A–Z</option>
      </select></label>
    </div>
    <div class="category-row" aria-label="Filter by category">${categories.map(c=>`<button class="chip ${activeCategory===c?"active":""}" data-category="${c}">${c}</button>`).join("")}</div>
    <div class="product-grid" id="product-grid">${visibleProducts().map(productCard).join("") || `<div class="empty-state"><h3>No products found</h3><p>Try a different search or category.</p><button class="secondary-button" data-reset>Clear filters</button></div>`}</div>
  </section>`;
  document.querySelector("#search-input").addEventListener("input", e => { searchTerm=e.target.value; updateGrid(); });
  document.querySelector("#sort-select").addEventListener("change", e => { sortMode=e.target.value; updateGrid(); });
}
function updateGrid() {
  const list = visibleProducts();
  document.querySelector("#product-grid").innerHTML = list.map(productCard).join("") || `<div class="empty-state"><h3>No products found</h3><p>Try a different search or category.</p><button class="secondary-button" data-reset>Clear filters</button></div>`;
  document.querySelector("#result-count").textContent = `${list.length} ${list.length===1?"item":"items"}`;
  document.querySelectorAll("[data-category]").forEach(btn=>btn.classList.toggle("active",btn.dataset.category===activeCategory));
}
function renderProduct(id) {
  const p=products.find(item=>item.id===id);
  if (!p) { app.innerHTML=`<section class="cart-page"><h1>Product not found</h1><a class="primary-button" href="#/">Back to shop</a></section>`; return; }
  app.innerHTML=`<section class="detail-layout"><div><a class="back-link" href="#/">← Back to collection</a><img class="detail-image" src="${p.image}" alt="${p.name}" width="600" height="600"></div><div class="detail-copy"><span class="eyebrow">${p.category} · ${p.color}</span><h1>${p.name}</h1><div class="detail-price">${formatPrice(p.price)}</div><p>${p.description}</p><p><strong>Designed for daily use.</strong> Simple details, dependable quality, no unnecessary fuss.</p><button class="primary-button" data-add="${p.id}">Add to bag</button><p class="product-category">Demo store · checkout does not process real payments.</p></div></section>`;
}
function renderCart() {
  const cart=getCart();
  if (!cart.length) { app.innerHTML=`<section class="cart-page"><a class="back-link" href="#/">← Continue shopping</a><h1 class="page-title">Your bag is taking a breather.</h1><p style="color:var(--muted)">Add something you love and it will appear here.</p><a class="primary-button" href="#/">Explore products</a></section>`; return; }
  const rows=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return "";return `<div class="cart-row"><img class="cart-thumb" src="${p.image}" alt="" width="76" height="76"><div><h3>${p.name}</h3><p>${formatPrice(p.price)} each</p></div><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove-button" data-remove="${p.id}">Remove</button></div>`}).join("");
  app.innerHTML=`<section class="cart-page"><a class="back-link" href="#/">← Continue shopping</a><h1 class="page-title">Your bag</h1><p style="color:var(--muted)">Review your picks before you go.</p>${rows}<aside class="cart-summary"><div class="summary-line"><span>Subtotal</span><strong>${formatPrice(cartTotal())}</strong></div><div class="summary-line"><span>Shipping</span><span>Calculated at checkout</span></div><div class="summary-line summary-total"><span>Total</span><span>${formatPrice(cartTotal())}</span></div><button class="primary-button" id="demo-checkout">Continue to checkout</button><small style="display:block;color:var(--muted);margin-top:10px">Demo only — no payment or order is submitted.</small></aside></section>`;
}
function renderAbout() {
  app.innerHTML=`<section class="about-page"><div class="about-hero"><span class="eyebrow">Our story</span><h1>Less clutter. More considered living.</h1><p>Northstar is a fictional concept store for everyday objects that are useful, approachable and designed to last.</p><a class="primary-button" href="#/">Shop the collection</a></div><div class="features"><article class="feature"><strong>01 · Thoughtful design</strong><p>Clean shapes and practical details that earn their place.</p></article><article class="feature"><strong>02 · Everyday value</strong><p>Clear pricing and products designed to be used, not just displayed.</p></article><article class="feature"><strong>03 · Built for the web</strong><p>A responsive, accessible demo with client-side routing and local cart state.</p></article></div></section>`;
}
function render() {
  const route=currentRoute();
  if(route.page==="product") renderProduct(route.id);
  else if(route.page==="cart") renderCart();
  else if(route.page==="about") renderAbout();
  else renderShop();
  refreshCartCount();
}
document.addEventListener("click", e => {
  const add=e.target.closest("[data-add]");
  const cat=e.target.closest("[data-category]");
  const qty=e.target.closest("[data-qty]");
  const remove=e.target.closest("[data-remove]");
  const routeEl=e.target.closest("[data-route]");
  if(add){addToCart(add.dataset.add);refreshCartCount();showToast("Added to your bag");if(currentRoute().page==="cart")renderCart();}
  if(cat){activeCategory=cat.dataset.category;updateGrid();}
  if(qty){updateQuantity(qty.dataset.qty,Number(qty.dataset.delta));renderCart();refreshCartCount();}
  if(remove){removeFromCart(remove.dataset.remove);renderCart();refreshCartCount();showToast("Item removed");}
  if(routeEl) navigate(routeEl.dataset.route);
  if(e.target.closest("[data-reset]")){searchTerm="";activeCategory="All";sortMode="featured";renderShop();}
  if(e.target.closest("#demo-checkout"))showToast("Demo checkout only — no payment taken");
});
document.addEventListener("keydown",e=>{const target=e.target.closest("[data-route]");if(target&&(e.key==="Enter"||e.key===" ")){e.preventDefault();navigate(target.dataset.route);}});
cartButton.addEventListener("click",()=>navigate("#/cart"));
window.addEventListener("hashchange",render);
window.addEventListener("storage",refreshCartCount);
render();
