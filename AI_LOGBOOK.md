1.)Tahap Eksplorasi ide dan Perancangan Solusi:
Kami menggunakan ai dalam mengeksplor beberapa referensi ide untuk membuat menu digital,dan perancangan solusi.
prompt mengeksplor ide : posisikan dirimu sebagai ahli starup aplikasi yang berbasis web yang ingin mencari refrensi ide membuat menu dalam sebuah kafe yang berbasis website
prompt perancangan solusi : posisikan dirimu sebagai pengembang/pembuat website untuk membuat website dengan ide caffelate yang dapat digunakan oleh pelanggan untuk memesan menu dan disertai harga"

2.)Penyusunan Kerangka Kode:
Dalam tahap ini kami sebagai perancang meminta bantuan ai,dengan menggunakan prompt:
    "posisikan dirimu sebagai pengembang/pembuat website yang ingin membuat website dengan ide caffelate. berikan saya sitak dalam bentuk index.html"
    "posisikan dirimu sebagai pengembang/pembuat website yang ingin membuat website dengan ide caffelate. berikan saya sitak dalam bentuk style.css"
    "posisikan dirimu sebagai pengembang/pembuat website yang ingin membuat website dengan ide caffelate. berikan saya sitak dalam bentuk scropt.js"

3.) pemecahan masalah dan penanganan debugging

4.)refleksi dan penjelasan kode:
_1.code:
const menuData = [ ... ];
let cart = [];
let selectedPayment = "QRIS";
let promoAktif = false;
let currentCategory = 'all';
let selectedProduct = null;
let selectedTemp = "Ice";
let selectedSugar = "Normal";
keterangan:(menuData: Menyimpan daftar produk kafe (kopi, non-kopi, camilan) lengkap dengan ID, nama, kategori, harga, deskripsi, dan link gambar (img).

cart: Array kosong yang berfungsi untuk menampung daftar produk yang dipilih/dibeli oleh pengguna (keranjang belanja).

selectedPayment: Menyimpan metode pembayaran yang sedang dipilih oleh pengguna (default-nya "QRIS").

promoAktif: Status boolean (true/false) untuk menandai apakah kode promo sedang aktif atau tidak.

currentCategory: Menyimpan kategori menu yang sedang ditampilkan saat ini (default-nya 'all' untuk semua menu).

Variabel Pendukung (selectedProduct, selectedTemp, selectedSugar): Menyimpan produk yang sedang dikustomisasi di dalam modal (pop-up), termasuk pilihan suhu (es/panas) dan tingkat manisnya.)

_2.code:
function formatRupiah(angka) { ... }
function showToast(message) { ... }
keterangan:(formatRupiah(angka): Mengubah angka biasa (contoh: 22000) menjadi format mata uang Rupiah Indonesia (contoh: "Rp22.000" menggunakan toLocaleString("id-ID")).

showToast(message): Menampilkan pesan pemberitahuan mengambang (toast notification) di layar untuk memberi tahu aksi pengguna (seperti "Promo aktif", "Barang ditambahkan", dll.) yang otomatis hilang setelah beberapa detik.)

_3.code:
function aktifkanPromo() { ... }
keterangan:(aktifkanPromo(): Mengaktifkan atau menonaktifkan kupon diskon (misalnya promo potongan harga). Fungsi ini mengubah status promoAktif, mengubah warna serta teks tombol promo di antarmuka, dan memperbarui total harga di keranjang secara otomatis.)

_4.code:
function renderMenu() { ... }
function filterMenu(category, btn) { ... }
function searchMenu() { ... }
keterangan:(renderMenu(): Berfungsi untuk menampilkan daftar menu ke halaman web. Fungsi ini juga menyaring menu berdasarkan kategori yang aktif dan kata kunci ketikan di kolom pencarian. Jika menu tidak ditemukan, akan memunculkan teks "Menu tidak ditemukan".

filterMenu(category, btn): Mengatur kategori menu yang ingin dilihat (misalnya hanya "kopi" atau "camilan") ketika tombol kategori diklik, serta memindahkan kelas active pada tombol.

searchMenu(): Dipanggil saat pengguna mengetik di kolom pencarian untuk menyaring produk secara real-time.
(openCustomModal(id): Membuka jendela pop-up (modal) ketika tombol "+ Pilih" pada sebuah menu diklik, memungkinkan pengguna mengatur suhu (Ice/Hot), tingkat gula, tambahan topping (extras), dan catatan khusus.


_5.code:
function openCustomModal(id) { ... }
function closeModal(modalId) { ... }
function selectOpt(btn, type) { ... }
function updateModalPrice() { ... }
function confirmAddToCart() { ... }
keterangan:(openCustomModal(id): Membuka jendela pop-up (modal) ketika tombol "+ Pilih" pada sebuah menu diklik, memungkinkan pengguna mengatur suhu (Ice/Hot), tingkat gula, tambahan topping (extras), dan catatan khusus.

closeModal(modalId): Menutup jendela modal berdclasarkan ID elemennya.

selectOpt(btn, type): Menandai pilihan tombol opsi (seperti "Ice" vs "Hot" atau tingkat gula) yang dipilih pengguna.

updateModalPrice(): Menghitung ulang harga produk di dalam modal jika pengguna menambahkan topping berbayar tambahan.

confirmAddToCart(): Memasukkan pesanan yang sudah dikustomisasi ke dalam array cart (keranjang), lalu memperbarui tampilan keranjang.)

_6.code:
function changeQty(cartKey, delta) { ... }
function clearCart() { ... }
function updateCartUI() { ... }
keterangan:(changeQty(cartKey, delta): Menambah (+1) atau mengurangi (-1) jumlah kuantitas produk di dalam keranjang. Jika jumlahnya habis (0), produk otomatis dihapus dari keranjang.

clearCart(): Mengosongkan seluruh isi keranjang belanja.

updateCartUI(): Memperbarui tampilan antarmuka keranjang di layar secara keseluruhan (menghitung total item, subtotal harga, potongan diskon jika promo aktif, dan menampilkan daftar item di keranjang).)

_7.code:
function selectPayment(el) { ... }
function checkout() { ... }
keterangan:(selectPayment(el): Menandai metode pembayaran yang dipilih oleh pengguna (misalnya QRIS, Transfer Bank, atau Tunai).

checkout(): Memproses pesanan saat tombol bayar/pesan ditekan. Fungsi ini memvalidasi apakah keranjang kosong, membuat nomor antrean acak (misalnya #CF-482), menampilkan struk pembelian di modal sukses, lalu mengosongkan keranjang kembali untuk transaksi berikutnya)

_8.code:
renderMenu();
keterangan:(Baris kode terakhir ini berjalan otomatis saat file/skrip pertama kali dimuat untuk merender dan menampilkan daftar menu awal ke halaman web.)
