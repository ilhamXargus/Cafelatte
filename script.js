const menuData = [
    { id: 1, name: "Es Kopi Susu Senja", category: "kopi", price: 22000, desc: "Espresso, fresh milk, dan gula aren organik.", img: "https://plus.unsplash.com/premium_photo-1677607237294-b041e4b57391?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
    { id: 2, name: "Classic Cappuccino", category: "kopi", price: 24000, desc: "Perpaduan espresso pekat dan foam susu lembut.", img: "https://images.unsplash.com/photo-1710173472469-9d28e977914c?q=80&w=916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
    { id: 3, name: "Creamy Matcha Latte", category: "non-kopi", price: 25000, desc: "Pure matcha asli Uji Jepang dengan susu segar.", img: "https://images.unsplash.com/photo-1775846933630-3c1531299e5a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
    { id: 4, name: "Flaky Butter Croissant", category: "camilan", price: 18000, desc: "Croissant renyah panggang hangat dengan mentega Prancis.", img: "https://images.unsplash.com/photo-1612366747681-e4ca6992b1e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
    { id: 5, name: "Iced Americano", category: "kopi", price: 18000, desc: "Double shot espresso Arabika Gayo dingin menyegarkan.", img: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
    { id: 6, name: "Artisan Peach Tea", category: "non-kopi", price: 20000, desc: "Teh hitam pilihan dengan potongan buah persik manis.", img: "https://images.unsplash.com/photo-1597916374805-77c812a72447?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" }
];

let cart = [];
let selectedPayment = "QRIS";
let promoAktif = false; // Status apakah tombol promo sedang dipakai

function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

// Fungsi baru untuk mengaktifkan / menonaktifkan promo
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

function renderMenu(filter = 'all') {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    const filtered = filter === 'all' ? menuData : menuData.filter(item => item.category === filter);

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
    renderMenu(category);
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

    // Perhitungan Diskon 20% (jika promo aktif & minimal 2 item)
    let diskon = 0;
    if (promoAktif && totalQty >= 2) {
        diskon = totalPrice * 0.20;
        if (discountRowEl && discountEl) {
            discountRowEl.style.display = "flex";
            discountEl.innerText = "-" + formatRupiah(diskon);
        }
    } else {
        if (discountRowEl) {
            discountRowEl.style.display = "none";
        }
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
    alert(`Terima kasih! Pesanan Anda sebesar ${total} sedang diproses melalui pembayaran ${selectedPayment}.`);
   
    // Reset keranjang dan promo setelah pembayaran selesai
    cart = [];
    promoAktif = false;
    const tombolPromo = document.getElementById('btn-klaim-promo');
    if (tombolPromo) {
        tombolPromo.innerText = "Gunakan Promo";
        tombolPromo.style.backgroundColor = "";
    }
   
    updateCartUI();
}

renderMenu();

const menuData = [
    { id: 1, name: "Es Kopi Susu Senja", category: "kopi", price: 22000, desc: "Espresso, fresh milk, dan gula aren organik.", img: "https://plus.unsplash.com/premium_photo-1677607237294-b041e4b57391?q=80&w=687&auto=format&fit=crop" },
    { id: 2, name: "Classic Cappuccino", category: "kopi", price: 24000, desc: "Perpaduan espresso pekat dan foam susu lembut.", img: "https://images.unsplash.com/photo-1710173472469-9d28e977914c?q=80&w=916&auto=format&fit=crop" },
    { id: 3, name: "Creamy Matcha Latte", category: "non-kopi", price: 25000, desc: "Pure matcha asli Uji Jepang dengan susu segar.", img: "https://images.unsplash.com/photo-1775846933630-3c1531299e5a?q=80&w=687&auto=format&fit=crop" },
    { id: 4, name: "Flaky Butter Croissant", category: "camilan", price: 18000, desc: "Croissant renyah panggang hangat dengan mentega Prancis.", img: "https://images.unsplash.com/photo-1612366747681-e4ca6992b1e9?w=600&auto=format&fit=crop&q=60" },
    { id: 5, name: "Iced Americano", category: "kopi", price: 18000, desc: "Double shot espresso Arabika Gayo dingin menyegarkan.", img: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?q=80&w=1173&auto=format&fit=crop" },
    { id: 6, name: "Artisan Peach Tea", category: "non-kopi", price: 20000, desc: "Teh hitam pilihan dengan potongan buah persik manis.", img: "https://images.unsplash.com/photo-1597916374805-77c812a72447?q=80&w=687&auto=format&fit=crop" }
];

let cart = [];
let selectedPayment = "QRIS";
let promoAktif = false;
let currentCategory = 'all';
let selectedProduct = null;
let selectedTemp = "Ice";
let selectedSugar = "Normal";

function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
}

// Notifikasi Toast Melayang
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Aktivasi Promo
function aktifkanPromo() {
    promoAktif = !promoAktif;
    const tombolPromo = document.getElementById('btn-klaim-promo');
    
    if (promoAktif) {
        tombolPromo.innerText = "Promo Terpasang ✓";
        tombolPromo.style.backgroundColor = "#4CAF50";
        showToast("🎉 Kode promo KOPIHEMAT aktif! (Min. 2 item)");
    } else {
        tombolPromo.innerText = "Gunakan Promo";
        tombolPromo.style.backgroundColor = "";
        showToast("Promo dinonaktifkan.");
    }
    updateCartUI();
}

// Render Menu (Mendukung Filter Kategori & Pencarian)
function renderMenu() {
    const container = document.getElementById('menu-container');
    const keyword = document.getElementById('search-input').value.toLowerCase();
    container.innerHTML = '';

    const filtered = menuData.filter(item => {
        const matchCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchKeyword = item.name.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
        return matchCategory && matchKeyword;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#7A6B63; padding:30px;">Menu tidak ditemukan 😔</p>`;
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
                    <button class="btn-add" onclick="openCustomModal(${item.id})">+ Pilih</button>
                </div>
            </div>
        `;
    });
}

function filterMenu(category, btn) {
    currentCategory = category;
    document.querySelectorAll('.categories button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

function searchMenu() {
    renderMenu();
}

// Buka Modal Kustomisasi
function openCustomModal(id) {
    selectedProduct = menuData.find(p => p.id === id);
    selectedTemp = "Ice";
    selectedSugar = "Normal";

    document.getElementById('modal-item-name').innerText = selectedProduct.name;
    document.getElementById('modal-item-desc').innerText = selectedProduct.desc;
    document.getElementById('item-note').value = "";

    // Reset pilihan opsi
    document.querySelectorAll('#temp-options .opt-btn').forEach((btn, idx) => btn.classList.toggle('selected', idx === 0));
    document.querySelectorAll('#sugar-options .opt-btn').forEach((btn, idx) => btn.classList.toggle('selected', idx === 0));
    document.querySelectorAll('.checkbox-group input').forEach(cb => cb.checked = false);

    // Sembunyikan opsi suhu & gula jika kategori camilan
    const drinkOpts = document.getElementById('drink-options');
    drinkOpts.style.display = selectedProduct.category === 'camilan' ? 'none' : 'block';

    updateModalPrice();
    document.getElementById('custom-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function selectOpt(btn, type) {
    btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (type === 'temp') selectedTemp = btn.innerText.replace(/[^a-zA-Z]/g, '');
    if (type === 'sugar') selectedSugar = btn.innerText;
}

function updateModalPrice() {
    let extraPrice = 0;
    document.querySelectorAll('.checkbox-group input:checked').forEach(cb => {
        extraPrice += parseInt(cb.dataset.price);
    });
    const finalItemPrice = selectedProduct.price + extraPrice;
    document.getElementById('btn-confirm-add').innerText = `Tambah ke Keranjang - ${formatRupiah(finalItemPrice)}`;
}

// Konfirmasi Tambah ke Keranjang
function confirmAddToCart() {
    let extraPrice = 0;
    let addons = [];
    document.querySelectorAll('.checkbox-group input:checked').forEach(cb => {
        extraPrice += parseInt(cb.dataset.price);
        addons.push(cb.value);
    });

    const note = document.getElementById('item-note').value.trim();
    const finalPrice = selectedProduct.price + extraPrice;

    // Buat deskripsi varian
    let variantText = selectedProduct.category === 'camilan' ? 'Hangat' : `${selectedTemp}, ${selectedSugar}`;
    if (addons.length > 0) variantText += ` + ${addons.join(', ')}`;
    if (note) variantText += ` ("${note}")`;

    // Cek apakah item dengan varian persis sama sudah ada di keranjang
    const cartKey = `${selectedProduct.id}-${variantText}`;
    const existing = cart.find(c => c.cartKey === cartKey);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            cartKey,
            id: selectedProduct.id,
            name: selectedProduct.name,
            variant: variantText,
            price: finalPrice,
            qty: 1
        });
    }

    closeModal('custom-modal');
    updateCartUI();
    showToast(`☕ ${selectedProduct.name} ditambahkan ke keranjang!`);
}

function changeQty(cartKey, delta) {
    const index = cart.findIndex(c => c.cartKey === cartKey);
    if (index !== -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    showToast("Keranjang dikosongkan.");
}

function updateCartUI() {
    const cartItemsEl = document.getElementById('cart-items');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const discountRowEl = document.getElementById('discount-row');
    const discountEl = document.getElementById('cart-discount');

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
                        <span class="cart-item-variant">${item.variant}</span>
                        <span class="cart-item-price">${formatRupiah(item.price * item.qty)}</span>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty('${item.cartKey}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty('${item.cartKey}', 1)">+</button>
                    </div>
                </div>
            `;
        });
    }

    let diskon = 0;
    if (promoAktif && totalQty >= 2) {
        diskon = totalPrice * 0.20;
        discountRowEl.style.display = "flex";
        discountEl.innerText = "-" + formatRupiah(diskon);
    } else {
        discountRowEl.style.display = "none";
    }

    countEl.innerText = totalQty;
    totalEl.innerText = formatRupiah(totalPrice - diskon);
}

function selectPayment(el) {
    document.querySelectorAll('.pay-badge').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    selectedPayment = el.innerText;
}

// Checkout dengan Struk Digital
function checkout() {
    if (cart.length === 0) {
        showToast("⚠️ Silakan pilih minimal 1 menu terlebih dahulu!");
        return;
    }

    const total = document.getElementById('cart-total').innerText;
    const queueNum = "#CF-" + Math.floor(100 + Math.random() * 900);

    let itemsHtml = cart.map(i => `<div>• ${i.qty}x <strong>${i.name}</strong> (${i.variant})</div>`).join('');
    document.getElementById('receipt-queue').innerText = queueNum;
    document.getElementById('receipt-details').innerHTML = `
        ${itemsHtml}
        <hr style="margin: 8px 0; border: none; border-top: 1px dashed #ccc;">
        <div>Metode Bayar: <strong>${selectedPayment}</strong></div>
        <div>Total Dibayar: <strong>${total}</strong></div>
    `;

    document.getElementById('receipt-modal').style.display = 'flex';

    // Reset keranjang & promo
    cart = [];
    promoAktif = false;
    const tombolPromo = document.getElementById('btn-klaim-promo');
    if (tombolPromo) {
        tombolPromo.innerText = "Gunakan Promo";
        tombolPromo.style.backgroundColor = "";
    }
    updateCartUI();
}

renderMenu();
