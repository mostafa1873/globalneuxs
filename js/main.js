'use strict';

//  LANGUAGE SYSTEM

const defaultLang = 'en';
let currentLang = localStorage.getItem('lang') || defaultLang;

const langPath = window.location.pathname.includes('/pages/')
  ? '../lang/'
  : './lang/';

function getTranslation(key) {
  const langData = JSON.parse(localStorage.getItem(`translations_${currentLang}`)) || {};
  return langData[key] || key;
}

async function loadLanguage(lang) {
  try {
    const response = await fetch(`${langPath}${lang}.json`);
    if (!response.ok) throw new Error(`Language file not found: ${response.status}`);

    const translations = await response.json();

    localStorage.setItem(`translations_${lang}`, JSON.stringify(translations));

    document.querySelectorAll('[data-lang]').forEach((el) => {
      const key = el.getAttribute('data-lang');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    localStorage.setItem('lang', lang);
    currentLang = lang;

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (products.length) {
      setTimeout(() => {
        if (document.querySelector('.listProduct')) addDataToHTML(currentFilter);
        if (document.querySelector('.detail')) showDetail();
      }, 150);
    }

  } catch (error) {
    console.error('🚨 Error loading language:', error);
  }
}

loadLanguage(currentLang);

//  LANGUAGE DROPDOWN

const dropdown = document.querySelector('.lang-dropdown');
const currentLangBtn = document.getElementById('current-lang');

if (currentLangBtn && dropdown) {
  currentLangBtn.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });
}

function changeLanguage(code, flag, name) {
  if (!currentLangBtn || !dropdown) return;

  currentLangBtn.innerHTML = `
    <img src="${flag}" alt="${name} flag" class="flag-icon">
    ${name}
    <span class="arrow">▼</span>
  `;

  dropdown.classList.remove('active');
  loadLanguage(code);
}

//  NAVBAR TOGGLE

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [overlay, navOpenBtn, navCloseBtn];

navElems.forEach(el => {
  if (el) {
    el.addEventListener("click", () => {
      navbar?.classList.toggle("active");
      overlay?.classList.toggle("active");
    });
  }
});

//  HEADER & GO TOP

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", () => {
  const active = window.scrollY >= 80;
  header?.classList.toggle("active", active);
  goTopBtn?.classList.toggle("active", active);
});

//  PRELOADER

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("loaded");
    document.body.classList.add("loaded");
  }, 1000);
});

//  PRODUCTS DATA HANDLER

let products = [];
let currentFilter = "all"; 

const productPath = window.location.pathname.includes('/pages/')
  ? '../products.json'
  : './products.json';

async function loadProducts() {
  try {
    const response = await fetch(productPath);
    if (!response.ok) throw new Error(`❌ Products file not found (${response.status})`);
    products = await response.json();

    if (document.querySelector('.listProduct')) addDataToHTML(currentFilter);
    if (document.querySelector('.detail')) showDetail();

    setupFilterButtons(); 

  } catch (error) {
    console.error('🚨 Error loading products:', error);
  }
}

loadProducts();

//  LIST ALL PRODUCTS + FILTER SUPPORT

function addDataToHTML(filter = "all") {
  const listProductHTML = document.querySelector('.listProduct');
  if (!listProductHTML || !products.length) return;

  listProductHTML.innerHTML = '';

  const filteredProducts = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  filteredProducts.forEach(product => {
    const linkPrefix = window.location.pathname.includes('/pages/') ? '' : './pages/';
    const newProduct = document.createElement('a');
    newProduct.href = `${linkPrefix}productsdetails.html?id=${product.id}`;
    newProduct.classList.add('item');

    newProduct.innerHTML = `
      <img src="${product.image}" alt="${product[`name_${currentLang}`]}">
      <h2>${product[`name_${currentLang}`]}</h2>
      <button class="details-button">
        ${getTranslation("details_page_button_details")}
      </button>
    `;

    listProductHTML.appendChild(newProduct);
  });
}

//  FILTER BUTTONS

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      addDataToHTML(currentFilter);
    });
  });
}

//  PRODUCT DETAILS PAGE

function showDetail() {
  const detail = document.querySelector('.detail');
  if (!detail || !products.length) return;

  const productId = new URLSearchParams(window.location.search).get('id');
  const thisProduct = products.find(p => p.id == productId);
  if (!thisProduct) return;

  const mainImage = detail.querySelector('.image img');
  const nameElement = detail.querySelector('.name');
  const descElement = detail.querySelector('.description');

  if (mainImage) mainImage.src = thisProduct.image || '';
  if (nameElement) nameElement.textContent = thisProduct[`name_${currentLang}`] || '';
  if (descElement) descElement.textContent = thisProduct[`description_${currentLang}`] || '';

  const extraImagesContainer = detail.querySelector('.extra-images');
  if (extraImagesContainer) {
    extraImagesContainer.innerHTML = '';
    if (Array.isArray(thisProduct.images) && thisProduct.images.length) {
      thisProduct.images.forEach(img => {
        const smallImg = document.createElement('img');
        smallImg.src = img;
        smallImg.alt = `${thisProduct[`name_${currentLang}`]} extra image`;
        smallImg.classList.add('small-img');

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
        <h2>${product[`name_${currentLang}`]}</h2>
      `;
      listProduct.appendChild(newProduct);
    });
  }
}

//  ACCORDION

const accordions = document.querySelectorAll("[data-accordion]");
let lastActiveAccordion = null;

accordions.forEach(currentAccordion => {
  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");
  accordionBtn?.addEventListener("click", () => {
    if (lastActiveAccordion && lastActiveAccordion !== currentAccordion) {
      lastActiveAccordion.classList.remove("expanded");
    }
    currentAccordion.classList.toggle("expanded");
    lastActiveAccordion = currentAccordion;
  });
});
