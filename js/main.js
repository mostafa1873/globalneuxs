'use strict';

// navbar toggle

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

// header & go top btn active on page scroll

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 80) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

// PRELOADER

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  setTimeout(() => {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
  }, 2000); 
});



// PRODUCTS FROM JSON
let products = null;

fetch('../products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    addDataToHTML();
    showDetail();
  });

// عرض كل المنتجات
function addDataToHTML() {
  const listProductHTML = document.querySelector('.listProduct');
  if (!listProductHTML || !products) return;

  products.forEach(product => {
    const newProduct = document.createElement('a');
    newProduct.href = `../pages/productsdetails.html?id=${product.id}`;
    newProduct.classList.add('item');
    newProduct.innerHTML = `
      <img src="${product.image}" alt="">
      <h2>${product.name}</h2>
      <button class="details-button">See Details</button>
    `;
    listProductHTML.appendChild(newProduct);
  });
}

// عرض تفاصيل المنتج
function showDetail() {
  const detail = document.querySelector('.detail');
  if (!detail || !products) return;

  const listProduct = document.querySelector('.listProduct');
  const productId = new URLSearchParams(window.location.search).get('id');
  const thisProduct = products.find(p => p.id == productId);

  if (!thisProduct) {
    window.location.href = '/';
    return;
  }

  // تعبئة بيانات المنتج
  detail.querySelector('.image img').src = thisProduct.image;
  detail.querySelector('.name').innerText = thisProduct.name;
  detail.querySelector('.description').innerText = thisProduct.description;

  if (!listProduct) return;

  // مسح المنتجات القديمة وإضافة مشابهة
  listProduct.innerHTML = '';
  const similarProducts = products.filter(p => p.id != productId);
  similarProducts.forEach(product => {
    const newProduct = document.createElement('a');
    newProduct.href = `../pages/productsdetails.html?id=${product.id}`;
    newProduct.classList.add('item');
    newProduct.innerHTML = `
      <img src="${product.image}" alt="">
      <h2>${product.name}</h2>
    `;
    listProduct.appendChild(newProduct);
  });
}
