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
  }, 1000);
});




// CATCH DATA FROM JSON FILE

let products = null;

fetch('../products.json')
  .then(response => {
    if (!response.ok) throw new Error(`❌ JSON file not found (${response.status})`);
    return response.json();
  })
  .then(data => {
    products = data;
    addDataToHTML();
    showDetail();
  })
  .catch(err => console.error('🚨 Error loading products:', err));



// VIEW ALL PRODUCTS

function addDataToHTML() {
  const listProductHTML = document.querySelector('.listProduct');
  if (!listProductHTML || !products) return;

  listProductHTML.innerHTML = '';
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

// PRODUCTS DETAILS PAGE

function showDetail() {
  const detail = document.querySelector('.detail');
  if (!detail || !products) return;

  const productId = new URLSearchParams(window.location.search).get('id');
  const thisProduct = products.find(p => p.id == productId);


  // DATA PRODUCT
  
  const mainImage = detail.querySelector('.image img');
  const nameElement = detail.querySelector('.name');
  const descElement = detail.querySelector('.description');

  if (mainImage) mainImage.src = thisProduct.image || '';
  if (nameElement) nameElement.textContent = thisProduct.name || '';
  if (descElement) descElement.textContent = thisProduct.description || '';


  // VIEW EXTRA IMAGES

  const extraImagesContainer = detail.querySelector('.extra-images');
  if (extraImagesContainer) {
    extraImagesContainer.innerHTML = '';

    if (Array.isArray(thisProduct.images) && thisProduct.images.length > 0) {
      thisProduct.images.forEach(img => {
        const smallImg = document.createElement('img');
        smallImg.src = img;
        smallImg.alt = `${thisProduct.name} extra image`;
        smallImg.classList.add('small-img');

        // OPEN EXTRA IMAGES

        smallImg.addEventListener('click', () => {
          const popup = document.createElement('div');
          popup.classList.add('image-popup');
          popup.innerHTML = `<img src="${img}" alt="">`;
          document.body.appendChild(popup);

          setTimeout(() => popup.classList.add('active'), 10);

          popup.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => popup.remove(), 300);
          });
        });

        extraImagesContainer.appendChild(smallImg);
      });
    }
  }

  // VIEW PRODUCTS

  const listProduct = document.querySelector('.listProduct');
  if (listProduct) {
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
}
