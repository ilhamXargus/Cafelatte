const menuData = [
    { id: 1, name: "Es Kopi Susu Senja", category: "kopi", price: 22000, desc: "Espresso, fresh milk, dan gula aren organik.", img: "https://unsplash.com" },
    { id: 2, name: "Classic Cappuccino", category: "kopi", price: 24000, desc: "Perpaduan espresso pekat dan foam susu lembut.", img: "https://unsplash.com" },
    { id: 3, name: "Creamy Matcha Latte", category: "non-kopi", price: 25000, desc: "Pure matcha asli Uji Jepang dengan susu segar.", img: "https://unsplash.com" },
    { id: 4, name: "Flaky Butter Croissant", category: "camilan", price: 18000, desc: "Croissant renyah panggang hangat dengan mentega Prancis.", img: "https://unsplash.com" },
    { id: 5, name: "Iced Americano", category: "kopi", price: 18000, desc: "Double shot espresso Arabika Gayo dingin menyegarkan.", img: "https://unsplash.com" },
    { id: 6, name: "Artisan Peach Tea", category: "non-kopi", price: 20000, desc: "Teh hitam pilihan dengan potongan buah persik manis.", img: "https://unsplash.com" }
];

let cart = [];
let selectedPayment = "QRIS";
let promoAktif = false;
let currentCategory = 'all';

function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

function aktifkanPromo() {
    promoAktif = !promoAktif;
    const tombolPromo = document.getElementById('btn-klaim-promo');
    
    if (tombolPromo) {
        if (promoAktif) {
            tombolPromo.innerText = "Promo Terpasang ✓";
            tombolPromo.style.backgroundColor = "#4CAF50";
        } else {
            tombolPromo.innerText = "Gunakan Promo";
            tombolPromo.style.backgroundColor = "";
        }
    }
    updateCartUI();
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    const keyword = document.getElementById('search-input').value.toLowerCase();
    container.innerHTML = '';

    const filtered = menuData.filter(item => {
        const matchCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchSearch = item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: #8D6E63; grid-column: 1/-1; text-align: center; padding: 20px;">Menu tidak ditemukan. Coba kata kunci lain!</p>';
        return;
    }

    filtered.forEach(item => {
        container.innerHTML += `
            <div class="menu-card">
                <div>
                    <img src="${item.img}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                </div>
                <div class="card-footer">
                    <span class="price">${formatRupiah(item.price)}</span>
                    <button class="btn-add" onclick="addToCart(${item.id})">+ Keranjang</button>
                </div>
            </div>
        `;
    });
}

function filterMenu(category, btn) {
    document.querySelectorAll('.categories button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = category;
    renderMenu();
}

function searchMenu() {
    renderMenu();
}

function addToCart(id) {
    const product = menuData.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const index = cart.findIndex(c => c.id === id);
    if (index !== -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsEl = document.getElementById('cart-items');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const discountRowEl = document.getElementById('discount-row');
    const discountEl = document.getElementById('cart-discount');
    const promoHintEl = document.getElementById('promo-hint');

    let totalQty = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-msg">Keranjang masih kosong. Yuk pilih kopimu!</p>';
    } else {
        cartItemsEl.innerHTML = '';
        cart.forEach(item => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;

            cartItemsEl.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>${formatRupiah(item.price * item.qty)}</span>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `;
        });
    }

    // Logika Diskon & Peringatan Syarat Minimal 2 Item
    let diskon = 0;
    if (promoAktif) {
        if (totalQty >= 2) {
            diskon = totalPrice * 0.20;
            discountRowEl.style.display = "flex";
            discountEl.innerText = "-" + formatRupiah(diskon);
            if (promoHintEl) promoHintEl.style.display = "none";
        } else {
            discountRowEl.style.display = "none";
            if (promoHintEl) promoHintEl.style.display = "block";
        }
    } else {
        discountRowEl.style.display = "none";
        if (promoHintEl) promoHintEl.style.display = "none";
    }

    let finalPrice = totalPrice - diskon;

    countEl.innerText = totalQty;
    totalEl.innerText = formatRupiah(finalPrice);
}

function selectPayment(el) {
    document.querySelectorAll('.pay-badge').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = el.innerText;
}

function checkout() {
    if (cart.length === 0) {
        alert("Silakan pilih minimal 1 menu terlebih dahulu!");
        return;
    }

    const total = document.getElementById('cart-total').innerText;
    const meja = document.getElementById('table-number').value.trim() || "Takeaway / Bawa Pulang";
    const catatan = document.getElementById('order-note').value.trim() || "-";
    const antrean = "#CF-" + Math.floor(10 + Math.random() * 90);

    document.getElementById('receipt-queue').innerText = antrean;

    let daftarMenuHTML = cart.map(item => 
        `<div class="receipt-item"><span>${item.qty}x ${item.name}</span><span>${formatRupiah(item.price * item.qty)}</span></div>`
    ).join('');

    document.getElementById('receipt-details').innerHTML = `
        <p><strong>Lokasi:</strong> ${meja}</p>
        <p><strong>Catatan:</strong> ${catatan}</p>
        <p><strong>Metode Bayar:</strong> ${selectedPayment}</p>
        <hr style="border: 0; border-top: 1px dashed #D7CCC8; margin: 12px 0;">
        ${daftarMenuHTML}
        <hr style="border: 0; border-top: 1px dashed #D7CCC8; margin: 12px 0;">
        <div class="receipt-item" style="font-weight: bold; font-size: 16px; color: #3E2723;">
            <span>Total Bayar</span><span>${total}</span>
        </div>
    `;

    document.getElementById('receipt-modal').style.display = 'flex';
}

function closeReceipt() {
    document.getElementById('receipt-modal').style.display = 'none';
    cart = [];
    promoAktif = false;
    document.getElementById('table-number').value = '';
    document.getElementById('order-note').value = '';
    
    const tombolPromo = document.getElementById('btn-klaim-promo');
    if (tombolPromo) {
        tombolPromo.innerText = "Gunakan Promo";
        tombolPromo.style.backgroundColor = "";
    }
    updateCartUI();
}

renderMenu();
