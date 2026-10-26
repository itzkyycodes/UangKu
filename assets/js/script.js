
  (() => {
    "use strict";

    // ==========================================
    // UANGKU - EXPENSE TRACKER
    // ==========================================

    const STORAGE_KEY = "expenseTrackerDemo_v1";
    const EXTRA_KEYS = {
      profile: "uangku_profile_v1",
      language: "uangku_language_v1",
      dateRange: "uangku_date_range_v1"
    };

    const DEFAULT_BUDGET = 0;
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const categories = {
      expense: [
        { name: "Food & Dining", id: "Makanan & Kuliner", icon: "🍜", color: "#fff0e5" },
        { name: "Transportation", id: "Transportasi", icon: "🚗", color: "#e9f2ff" },
        { name: "Shopping", id: "Belanja", icon: "🛍️", color: "#f5eaff" },
        { name: "Bills & Utilities", id: "Tagihan & Utilitas", icon: "💡", color: "#fff7d9" },
        { name: "Entertainment", id: "Hiburan", icon: "🎬", color: "#ffe9ed" },
        { name: "Health", id: "Kesehatan", icon: "💊", color: "#e4f7ed" },
        { name: "Education", id: "Pendidikan", icon: "📚", color: "#e7edff" },
        { name: "Other", id: "Lainnya", icon: "✦", color: "#edf1ee" }
      ],
      income: [
        { name: "Salary", id: "Gaji", icon: "💼", color: "#e4f7ed" },
        { name: "Freelance", id: "Freelance", icon: "💻", color: "#e9f2ff" },
        { name: "Investment", id: "Investasi", icon: "📈", color: "#f5eaff" },
        { name: "Gift", id: "Hadiah", icon: "🎁", color: "#ffe9ed" },
        { name: "Other", id: "Lainnya", icon: "✦", color: "#edf1ee" }
      ]
    };

    const translations = {
      "Dashboard": "Dasbor",
      "Transactions": "Transaksi",
      "Monthly budget": "Anggaran bulanan",
      "Reports": "Laporan",
      "Settings": "Pengaturan",
      "Add transaction": "Tambah transaksi",
      "Add Transaction": "Tambah transaksi",
      "Total Income": "Total pemasukan",
      "Total Expenses": "Total pengeluaran",
      "Total Balance": "Total saldo",
      "Recent transactions": "Transaksi terbaru",
      "All transactions": "Semua transaksi",
      "Search transactions": "Cari transaksi",
      "All categories": "Semua kategori",
      "All types": "Semua tipe",
      "Income": "Pemasukan",
      "Expense": "Pengeluaran",
      "Edit": "Ubah",
      "Delete": "Hapus",
      "Save changes": "Simpan perubahan",
      "Save transaction": "Simpan transaksi",
      "Budget settings": "Pengaturan anggaran",
      "Preferences": "Preferensi",
      "Dark mode": "Mode gelap",
      "Budget alerts": "Peringatan anggaran",
      "Currency": "Mata uang",
      "Data storage": "Penyimpanan data",
      "Reset demo data": "Reset data demo",
      "Language": "Bahasa",
      "Account settings": "Pengaturan akun",
      "Username": "Nama pengguna",
      "Save profile": "Simpan profil",
      "Cancel": "Batal",
      "Today": "Hari ini",
      "Last 7 days": "7 hari terakhir",
      "This month": "Bulan ini",
      "Custom range": "Rentang tanggal",
      "Apply dates": "Terapkan tanggal",
      "Export CSV": "Ekspor CSV",
      "Export Excel": "Ekspor Excel",
      "No transactions yet": "Belum ada transaksi",
      "No transactions found": "Transaksi tidak ditemukan",
      "Personal account": "Akun pribadi",
      "Money tip": "Tips keuangan",
      "Budget limit reached": "Batas anggaran tercapai",
      "You're getting close to your budget": "Anggaran hampir habis",
      "Budget reminder": "Pengingat anggaran",
      "You're on track": "Keuangan terkendali",
      "On track": "Aman",
      "Almost there": "Hampir mencapai batas",
      "Over budget": "Melebihi anggaran",
      "No budget": "Belum ada anggaran",
      "Set a monthly budget": "Atur anggaran bulanan",
      "Set a monthly budget to track your spending.": "Atur anggaran bulanan untuk memantau pengeluaran.",
      "Add expenses to see category insights.": "Tambahkan pengeluaran untuk melihat kategori.",
      "No expenses recorded for this month yet.": "Belum ada pengeluaran bulan ini.",
      "Add some expenses to build your report.": "Tambahkan pengeluaran untuk membuat laporan.",
      "Filter dates": "Filter tanggal",
      "Date range": "Rentang tanggal",
      "Start date": "Tanggal mulai",
      "End date": "Tanggal akhir",
      "Account settings": "Pengaturan akun",
      "Update the name shown on your UangKu account.": "Ubah nama yang ditampilkan pada akun UangKu.",
      "Username required": "Nama pengguna wajib diisi",
      "Please enter a username.": "Silakan masukkan nama pengguna.",
      "Profile updated": "Profil diperbarui",
      "Your username has been saved.": "Nama pengguna berhasil disimpan.",
      "Export transaction data": "Ekspor data transaksi",
      "Export CSV (.csv)": "Ekspor CSV (.csv)",
      "Export Excel-compatible (.xls)": "Ekspor Excel (.xls)",
      "Export complete": "Ekspor selesai",
      "Transaction added": "Transaksi ditambahkan",
      "Transaction updated": "Transaksi diperbarui",
      "Transaction deleted": "Transaksi dihapus",
      "Transaction not found": "Transaksi tidak ditemukan",
      "The transaction may have been deleted.": "Transaksi mungkin sudah dihapus.",
      "Check your input": "Periksa input",
      "Invalid budget": "Anggaran tidak valid",
      "Enter a budget greater than zero.": "Masukkan anggaran lebih dari nol.",
      "Budget updated": "Anggaran diperbarui",
      "Preferences saved": "Preferensi disimpan",
      "Budget alerts are enabled.": "Peringatan anggaran diaktifkan.",
      "Budget alerts are disabled.": "Peringatan anggaran dinonaktifkan.",
      "Data reset": "Data direset",
      "Reset all transactions, budget, and preferences? This action cannot be undone.": "Reset semua transaksi, anggaran, dan preferensi? Tindakan ini tidak dapat dibatalkan.",
      "Delete": "Hapus",
      "Welcome to Expense Tracker": "Selamat datang di UangKu",
      "Your demo data is stored locally in this browser.": "Data demo disimpan secara lokal di browser ini.",
      "You're on track": "Keuangan terkendali",
      "Your spending is currently within your monthly limit.": "Pengeluaran masih dalam batas anggaran bulanan.",
      "Your spending is currently within your monthly limit.": "Pengeluaran masih dalam batas anggaran bulanan.",
      "Save profile": "Simpan profil",
      "Language / Bahasa": "Bahasa / Language",
      "Choose the language used by the interface.": "Pilih bahasa yang digunakan pada aplikasi.",
      "English": "Inggris",
      "Bahasa Indonesia": "Bahasa Indonesia",
      "Food & Dining": "Makanan & Kuliner",
      "Transportation": "Transportasi",
      "Shopping": "Belanja",
      "Bills & Utilities": "Tagihan & Utilitas",
      "Entertainment": "Hiburan",
      "Health": "Kesehatan",
      "Education": "Pendidikan",
      "Other": "Lainnya",
      "Salary": "Gaji",
      "Freelance": "Freelance",
      "Investment": "Investasi",
      "Gift": "Hadiah",
      "All": "Semua",
      "All transactions": "Semua transaksi",
      "No budget set": "Anggaran belum diatur",
      "left": "tersisa",
      "remaining": "tersisa",
      "over budget": "melebihi anggaran",
      "of budget used": "anggaran terpakai",
      "used": "terpakai",
      "suggested share": "alokasi yang disarankan",
      "of spending": "dari pengeluaran",
      "Budget updated": "Anggaran diperbarui",
      "Enter a name, a valid amount, a category, and a date.": "Masukkan nama, jumlah yang valid, kategori, dan tanggal.",
      "Choose a valid start and end date.": "Pilih tanggal mulai dan akhir yang valid.",
      "Invalid date range": "Rentang tanggal tidak valid",
      "Date filter applied": "Filter tanggal diterapkan",
      "Your transaction data was exported as CSV.": "Data transaksi berhasil diekspor sebagai CSV.",
      "Your transaction data was exported as XLS.": "Data transaksi berhasil diekspor sebagai XLS.",
      "Money tip": "Tips keuangan",
      "Try reviewing your spending once a week and give each category a realistic limit.": "Tinjau pengeluaran setiap minggu dan tentukan batas yang realistis untuk setiap kategori.",
      "Welcome to UangKu": "Selamat datang di UangKu",
      "Personal account": "Akun pribadi",
      "Add expenses to see category insights.": "Tambahkan pengeluaran untuk melihat analisis kategori.",
      "No expenses recorded for this month yet.": "Belum ada pengeluaran bulan ini.",
      "Add some expenses to build your report.": "Tambahkan pengeluaran untuk membuat laporan.",
      "Overview": "Ringkasan",
      "Search": "Cari",
      "Search...": "Cari...",
      "Amount": "Jumlah",
      "Title": "Nama transaksi",
      "Description": "Deskripsi",
      "Category": "Kategori",
      "Date": "Tanggal",
      "Type": "Tipe",
      "Actions": "Aksi",
      "Notes": "Catatan",
      "Monthly budget": "Anggaran bulanan",
      "Budget amount": "Jumlah anggaran",
      "Set budget": "Atur anggaran",
      "Update budget": "Perbarui anggaran",
      "Save": "Simpan",
      "Close": "Tutup",
      "Confirm": "Konfirmasi",
      "Confirm delete": "Konfirmasi penghapusan",
      "Are you sure?": "Apakah kamu yakin?",
      "No data available": "Belum ada data",
      "No results": "Tidak ada hasil",
      "View all": "Lihat semua",
      "See all": "Lihat semua",
      "Notifications": "Notifikasi",
      "Mark all as read": "Tandai semua telah dibaca",
      "No notifications": "Tidak ada notifikasi",
      "Profile": "Profil",
      "Account": "Akun",
      "Appearance": "Tampilan",
      "General": "Umum",
      "Data management": "Pengelolaan data",
      "Export data": "Ekspor data",
      "Import data": "Impor data",
      "Reset data": "Reset data",
      "Choose language": "Pilih bahasa",
      "Choose a category": "Pilih kategori",
      "Select date": "Pilih tanggal",
      "From": "Dari",
      "To": "Sampai",
      "Total": "Total",
      "This week": "Minggu ini",
      "Last month": "Bulan lalu",
      "Income vs Expenses": "Pemasukan vs Pengeluaran",
      "Expenses by category": "Pengeluaran berdasarkan kategori",
      "Financial overview": "Ringkasan keuangan",
      "Spending insights": "Analisis pengeluaran",
      "Transaction history": "Riwayat transaksi",
      "Recent activity": "Aktivitas terbaru",
      "No transactions match your filters.": "Tidak ada transaksi yang sesuai dengan filter.",
      "Please try another search.": "Silakan coba pencarian lain.",
      "Something went wrong.": "Terjadi kesalahan.",
      "Please try again.": "Silakan coba lagi.",
      "Settings saved": "Pengaturan disimpan",
      "Changes saved successfully.": "Perubahan berhasil disimpan.",
      "Back": "Kembali",
      "Next": "Berikutnya",
      "Previous": "Sebelumnya",
      "Loading...": "Memuat...",
      "Required": "Wajib diisi",
      "Optional": "Opsional",
      "YOUR FINANCIAL OVERVIEW": "RINGKASAN KEUANGAN ANDA",
      "Good to see you, Alex": "Senang melihatmu, Alex",
      "Here's what's happening with your money today.": "Berikut kondisi keuanganmu hari ini.",
      "Here’s what’s happening with your money today.": "Berikut kondisi keuanganmu hari ini.",
      "Total balance": "Total saldo",
      "Total income": "Total pemasukan",
      "Total expenses": "Total pengeluaran",
      "vs last month": "dibandingkan bulan lalu",
      "Cash flow": "Arus kas",
      "Track your income and expenses over time.": "Pantau pemasukan dan pengeluaranmu dari waktu ke waktu.",
      "Last 6 months": "6 bulan terakhir",
      "Last 3 months": "3 bulan terakhir",
      "Last 12 months": "12 bulan terakhir",
      "Income": "Pemasukan",
      "Expenses": "Pengeluaran",
      "Cash flow chart": "Grafik arus kas",
      "Keep your spending in check.": "Pantau pengeluaranmu agar tetap terkendali.",
      "Total spending": "Total pengeluaran",
      "Monthly limit": "Batas anggaran bulanan",
      "Manage budget": "Kelola anggaran",
      "Your latest financial activity.": "Aktivitas keuangan terbarumu.",
      "View all transactions": "Lihat semua transaksi",
      "TRANSACTION": "TRANSAKSI",
      "CATEGORY": "KATEGORI",
      "DATE": "TANGGAL",
      "AMOUNT": "JUMLAH",
      "Made for a clearer financial future": "Untuk masa depan keuangan yang lebih baik",

      "MONEY IN, MONEY OUT": "UANG MASUK, UANG KELUAR",
      "A clear view of every financial move.": "Lihat semua pergerakan keuanganmu dengan jelas.",
      "All types": "Semua tipe",
      "All categories": "Semua kategori",
      "TRANSAKSI": "TRANSAKSI",
      "CATEGORY": "KATEGORI",
      "DATE": "TANGGAL",
      "TYPE": "TIPE",
      "AMOUNT": "JUMLAH",
      "ACTIONS": "AKSI",
      "Actions": "Aksi",
      "Edit": "Ubah",
      "Delete": "Hapus",
      "Search transactions": "Cari transaksi",

      "PLAN WITH PURPOSE": "RENCANAKAN DENGAN TUJUAN",
      "Give every rupiah a purpose this month.": "Rencanakan penggunaan setiap rupiah bulan ini.",
      "Edit budget": "Ubah anggaran",
      "Budget overview": "Ringkasan anggaran",
      "spent out of": "terpakai dari",
      "Little reminder": "Pengingat kecil",
      "A budget is not about restricting yourself. It’s about making room for the things that matter most.": "Anggaran bukan tentang membatasi diri. Anggaran membantu menyediakan ruang untuk hal-hal yang paling penting.",
      "A budget is not about restricting yourself. It's about making room for the things that matter most.": "Anggaran bukan tentang membatasi diri. Anggaran membantu menyediakan ruang untuk hal-hal yang paling penting.",
      "YOUR FINANCIAL WELLNESS NOTE": "CATATAN KESEHATAN KEUANGAN",
      "Spending by category": "Pengeluaran berdasarkan kategori",
      "See how each category compares to its budget.": "Lihat perbandingan pengeluaran setiap kategori dengan anggarannya.",
      "of spending": "dari pengeluaran",
      "suggested allocation": "alokasi yang disarankan",
      "Budget overview": "Ringkasan anggaran",
      
      "YOUR MONEY, IN PERSPECTIVE": "GAMBARAN KEUANGANMU",
      "Understand your financial habits at a glance.": "Pahami kebiasaan keuanganmu dengan mudah.",
      "Savings this month": "Sisa uang bulan ini",
      "Income minus expenses": "Pemasukan dikurangi pengeluaran",
      "Recorded this month": "Tercatat bulan ini",
      "Average expense": "Rata-rata pengeluaran",
      "Per expense transaction": "Per transaksi pengeluaran",
      "Spending breakdown": "Rincian pengeluaran",
      "Where your money is going.": "Lihat ke mana uangmu digunakan.",

      
      "MAKE IT YOURS": "SESUAIKAN DENGAN KEBUTUHANMU",
      "A few preferences to make Expense Tracker feel like home.": "Atur preferensi agar UangKu terasa lebih nyaman digunakan.",
      "Appearance": "Tampilan",
      "Switch between light and dark mode.": "Beralih antara mode terang dan mode gelap.",
      "Show a notification when spending reaches 80% of your limit.": "Tampilkan notifikasi saat pengeluaran mencapai 80% dari batas anggaran.",
      "Currency used throughout the app.": "Mata uang yang digunakan di seluruh aplikasi.",
      "Indonesian Rupiah (IDR)": "Rupiah Indonesia (IDR)",
      "This demo saves data in this browser only.": "Versi demo ini hanya menyimpan data di browser ini.",
      "Local storage": "Penyimpanan lokal",
      "Reset all data": "Reset semua data",
      "Choose the language used by the interface.": "Pilih bahasa yang digunakan pada aplikasi.",
      "Bahasa / Language": "Bahasa / Language",

      // Tambah transaksi
"YOUR MONEY JOURNAL": "JURNAL KEUANGANMU",
"Add Transaction": "Tambah Transaksi",
"Record a money move in just a moment.": "Catat transaksi keuanganmu dengan cepat.",
"Expense": "Pengeluaran",
"Income": "Pemasukan",
"Transaction name": "Nama transaksi",
"Amount (Rp)": "Jumlah (Rp)",
"Date": "Tanggal",
"Category": "Kategori",
"Note (optional)": "Catatan (opsional)",
"Cancel": "Batal",
"Save Transaction": "Simpan Transaksi",
"Food & Dining": "Makanan & Kuliner",
"Transportation": "Transportasi",
"Shopping": "Belanja",
"Bills & Utilities": "Tagihan & Utilitas",
"Entertainment": "Hiburan",
"Health": "Kesehatan",
"Education": "Pendidikan",
"Other": "Lainnya",
"Lunch": "Makan Siang",
"Add a note": "Tambahkan catatan",

// Anggaran bulanan
"PLAN AHEAD": "RENCANAKAN KEUANGAN",
"Set monthly budget": "Atur Anggaran Bulanan",
"Choose a limit that works for you.": "Tentukan batas anggaran yang sesuai untukmu.",
"Monthly spending limit (Rp)": "Batas pengeluaran bulanan (Rp)",
"Save budget": "Simpan Anggaran",
"Edit Budget": "Ubah Anggaran"

    };

    const today = new Date();

    function localDateString(date = new Date()) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    function formatCurrency(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(Number(amount) || 0).replace(/\u00a0/g, " ");
    }

    function formatDate(date, language = selectedLanguage) {
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "-";
      const parsed = new Date(`${date}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return "-";

      return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(parsed);
    }

    function escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]);
    }

    function createId() {
      return typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    function normalizeTransaction(item) {
      if (!item || typeof item !== "object") return null;

      const amount = Number(item.amount);
      const type = item.type === "income" ? "income" : "expense";

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        typeof item.title !== "string" ||
        !item.title.trim() ||
        typeof item.date !== "string"
      ) return null;

      return {
        id: String(item.id || createId()),
        title: item.title.trim().slice(0, 60),
        amount,
        date: item.date,
        type,
        category: String(item.category || "Other"),
        note: String(item.note || "").slice(0, 100)
      };
    }

    function createInitialState() {
      return { transactions: [], budget: DEFAULT_BUDGET, alerts: true, dark: false };
    }

    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (!saved || !Array.isArray(saved.transactions)) return createInitialState();

        return {
          transactions: saved.transactions.map(normalizeTransaction).filter(Boolean),
          budget: Number.isFinite(Number(saved.budget)) ? Math.max(0, Number(saved.budget)) : DEFAULT_BUDGET,
          alerts: saved.alerts !== false,
          dark: saved.dark === true
        };
      } catch (error) {
        console.error("Gagal memuat data:", error);
        return createInitialState();
      }
    }

    let state = loadState();
    let currentType = "expense";
    let editingId = null;
    let toastCounter = 0;
    let selectedLanguage = localStorage.getItem(EXTRA_KEYS.language) || "id";

    if (!["id", "en"].includes(selectedLanguage)) selectedLanguage = "id";

    let selectedRange = (() => {
      try {
        const saved = JSON.parse(localStorage.getItem(EXTRA_KEYS.dateRange) || "null");
        if (saved && saved.start && saved.end) return saved;
      } catch (_) {}
      return {
        preset: "month",
        start: localDateString(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: localDateString()
      };
    })();

    let accountProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem(EXTRA_KEYS.profile) || "null") || { username: "Alexandra Doe" };
      } catch (_) {
        return { username: "Alexandra Doe" };
      }
    })();

    // Simpan teks asli supaya pergantian bahasa bisa dilakukan dua arah.
    const originalText = new WeakMap();

function translate(value) {
  const text = String(value ?? "");
  const trimmed = text.trim();

  // Bahasa Inggris menggunakan teks asli.
  if (selectedLanguage === "en") {
    return text;
  }

  // Bahasa Indonesia menggunakan kamus terjemahan.
  const translated = translations[trimmed];

  if (translated) {
    const start = text.indexOf(trimmed);

    return (
      text.slice(0, start) +
      translated +
      text.slice(start + trimmed.length)
    );
  }

  return text;
}


function applyLanguage(root = document.body) {
  document.documentElement.lang = selectedLanguage;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const parent = node.parentElement;

    if (
      !parent ||
      parent.closest(
        "script, style, textarea, input, [data-no-translate]"
      )
    ) {
      return;
    }

    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);

    node.nodeValue =
      selectedLanguage === "id"
        ? translate(original)
        : original;
  });

  $$("input[placeholder], textarea[placeholder]").forEach(
    (element) => {
      if (!element.dataset.originalPlaceholder) {
        element.dataset.originalPlaceholder = element.placeholder;
      }

      element.placeholder =
        selectedLanguage === "id"
          ? translate(element.dataset.originalPlaceholder)
          : element.dataset.originalPlaceholder;
    }
  );

  // Perbarui pilihan bahasa.
  const langSelect = $("#uangkuLanguage");

  if (langSelect) {
    langSelect.value = selectedLanguage;
  }

  // Perbarui label khusus pengaturan bahasa.
  const languageCard = $("#uangkuLanguageCard");

  if (languageCard) {
    const title = languageCard.querySelector("h3");
    const description = languageCard.querySelector("p");
    const label = languageCard.querySelector("label");

    if (title) {
      title.textContent =
        selectedLanguage === "id"
          ? "Bahasa / Language"
          : "Language / Bahasa";
    }

    if (description) {
      description.textContent =
        selectedLanguage === "id"
          ? "Pilih bahasa yang digunakan pada aplikasi."
          : "Choose the language used by the interface.";
    }

    if (label) {
      label.textContent =
        selectedLanguage === "id" ? "Bahasa" : "Language";
    }
  }

  updateDateChipLabel();
  updateProfileDisplay();
}


    function saveLanguage(language) {
      selectedLanguage = language === "id" ? "id" : "en";
      localStorage.setItem(EXTRA_KEYS.language, selectedLanguage);

      applyLanguage();

      showToast(
        selectedLanguage === "id" ? "Bahasa diubah" : "Language updated",
        selectedLanguage === "id"
          ? "Preferensi bahasa berhasil disimpan."
          : "Your language preference has been saved."
      );
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch (error) {
        console.error("Gagal menyimpan data:", error);
        showToast(
          selectedLanguage === "id" ? "Penyimpanan gagal" : "Save failed",
          selectedLanguage === "id"
            ? "Browser tidak dapat menyimpan data."
            : "The browser could not save your data.",
          "warning"
        );
        return false;
      }
    }

    function showToast(title, message, type = "success") {
      const region = $("#toastRegion");
      if (!region) {
        console.log(`${title}: ${message}`);
        return;
      }

      const toast = document.createElement("div");
      toast.dataset.toastId = String(++toastCounter);
      toast.className = `toast ${type === "warning" ? "warning" : ""}`;

      const icon = document.createElement("span");
      icon.className = "toast-icon";
      icon.textContent = type === "warning" ? "!" : "✓";

      const content = document.createElement("div");
      const heading = document.createElement("strong");
      const paragraph = document.createElement("p");

      heading.textContent = title;
      paragraph.textContent = message;
      content.append(heading, paragraph);
      toast.append(icon, content);
      region.appendChild(toast);

      window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(12px)";
        window.setTimeout(() => toast.remove(), 250);
      }, 3500);
    }

    function sum(items) {
      return items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    }

    function isThisMonth(dateString) {
      if (!dateString) return false;
      const parts = dateString.split("-").map(Number);
      return parts.length === 3 &&
        parts[0] === today.getFullYear() &&
        parts[1] === today.getMonth() + 1;
    }

    function inSelectedRange(item) {
      return item.date >= selectedRange.start && item.date <= selectedRange.end;
    }

    function rangeTransactions() {
      return state.transactions.filter(inSelectedRange);
    }

    function monthTransactions() {
      return state.transactions.filter((item) => isThisMonth(item.date));
    }

    function monthExpenses() {
      return monthTransactions().filter((item) => item.type === "expense");
    }

    function monthIncome() {
      return monthTransactions().filter((item) => item.type === "income");
    }

    function rangeExpenses() {
      return rangeTransactions().filter((item) => item.type === "expense");
    }

    function rangeIncome() {
      return rangeTransactions().filter((item) => item.type === "income");
    }

    function getCategory(name, type = "") {
      const list = type
        ? categories[type] || []
        : [...categories.expense, ...categories.income];

      return list.find((item) => item.name === name) || { icon: "✦", color: "#edf1ee" };
    }

    function checkBudgetAlert(previousSpent = 0) {
      if (!state.alerts || state.budget <= 0) return;

      const spent = sum(monthExpenses());
      const before = previousSpent / state.budget;
      const ratio = spent / state.budget;

      if (ratio >= 1 && before < 1) {
        showToast(
          selectedLanguage === "id" ? "Batas anggaran tercapai" : "Budget limit reached",
          selectedLanguage === "id"
            ? `Pengeluaran melebihi anggaran sebesar ${formatCurrency(spent - state.budget)}.`
            : `Your spending is ${formatCurrency(spent - state.budget)} over budget.`,
          "warning"
        );
      } else if (ratio >= 0.8 && before < 0.8) {
        showToast(
          selectedLanguage === "id" ? "Anggaran hampir habis" : "You're getting close to your budget",
          selectedLanguage === "id"
            ? `${Math.round(ratio * 100)}% anggaran bulanan telah digunakan.`
            : `You've used ${Math.round(ratio * 100)}% of your monthly budget.`,
          "warning"
        );
      }
    }

    function renderStats() {
      const income = sum(rangeIncome());
      const expenses = sum(rangeExpenses());

      $("#totalIncome").textContent = formatCurrency(income);
      $("#totalExpenses").textContent = formatCurrency(expenses);
      $("#totalBalance").textContent = formatCurrency(income - expenses);
      $("#reportSavings").textContent = formatCurrency(income - expenses);
      $("#reportCount").textContent = rangeTransactions().length;
      $("#reportAverage").textContent = formatCurrency(
        rangeExpenses().length ? Math.round(expenses / rangeExpenses().length) : 0
      );
    }

    function renderTransactionRow(item, showType = false, showActions = false) {
      const category = getCategory(item.category, item.type);
      const typeLabel = item.type === "income"
        ? (selectedLanguage === "id" ? "Pemasukan" : "Income")
        : (selectedLanguage === "id" ? "Pengeluaran" : "Expense");

      const typeColumn = showType
        ? `<td><span class="type-pill ${item.type}">${typeLabel}</span></td>`
        : "";

      const actionsColumn = showActions
        ? `<td><div class="row-actions">
            <button type="button" class="tiny-action" data-edit="${escapeHTML(item.id)}">${selectedLanguage === "id" ? "Ubah" : "Edit"}</button>
            <button type="button" class="tiny-action" data-delete="${escapeHTML(item.id)}">${selectedLanguage === "id" ? "Hapus" : "Delete"}</button>
          </div></td>`
        : `<td><button type="button" class="tiny-action" data-edit="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.title)}">···</button></td>`;

      return `
        <tr>
          <td>
            <div class="transaction-name">
              <span class="transaction-symbol" style="background:${category.color}">${category.icon}</span>
              <span class="transaction-name-copy">
                <strong>${escapeHTML(item.title)}</strong>
                <span>${escapeHTML(item.note || typeLabel)}</span>
              </span>
            </div>
          </td>
          <td>${escapeHTML(selectedLanguage === "id" ? (categories[item.type].find((c) => c.name === item.category)?.id || item.category) : item.category)}</td>
          <td>${formatDate(item.date)}</td>
          ${typeColumn}
          <td class="amount ${item.type}">${item.type === "income" ? "+" : "−"}${formatCurrency(item.amount)}</td>
          ${actionsColumn}
        </tr>`;
    }

    function renderRecentTransactions() {
      const items = rangeTransactions()
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5);

      $("#recentTransactions").innerHTML = items.map((item) => renderTransactionRow(item)).join("");
      $("#recentEmpty").classList.toggle("hidden", items.length > 0);
      applyLanguage();
    }

    function renderAllTransactions() {
      const searchInput = $("#transactionSearch");
      const typeInput = $("#typeFilter");
      const categoryInput = $("#categoryFilter");
      if (!searchInput || !typeInput || !categoryInput) return;

      const query = searchInput.value.trim().toLowerCase();
      const type = typeInput.value;
      const category = categoryInput.value;

      const items = rangeTransactions().filter((item) => {
        const text = `${item.title} ${item.category} ${item.note || ""}`.toLowerCase();
        return text.includes(query) &&
          (type === "all" || item.type === type) &&
          (category === "all" || item.category === category);
      }).sort((a, b) => b.date.localeCompare(a.date));

      $("#allTransactions").innerHTML = items.map((item) => renderTransactionRow(item, true, true)).join("");
      $("#allEmpty").classList.toggle("hidden", items.length > 0);
      applyLanguage();
    }

    function renderBudget() {
      // Anggaran bulanan selalu dihitung dari seluruh transaksi bulan ini,
      // bukan hanya transaksi dalam filter tanggal.
      const spent = sum(monthExpenses());
      const budget = state.budget;
      const ratio = budget > 0 ? spent / budget : 0;
      const percent = Math.round(ratio * 1000) / 10;
      const remaining = budget - spent;
      const fillClass = ratio >= 0.8 ? "warning" : "";
      const id = selectedLanguage === "id";

      ["#budgetSpent", "#budgetOverviewSpent"].forEach((selector) => {
        if ($(selector)) $(selector).textContent = formatCurrency(spent);
      });

      ["#budgetLimit", "#budgetOverviewLimit"].forEach((selector) => {
        if ($(selector)) $(selector).textContent = formatCurrency(budget);
      });

      $("#budgetPercent").textContent = budget > 0 ? `${percent}% ${id ? "terpakai" : "used"}` : (id ? "Belum ada anggaran" : "No budget set");

      $("#budgetRemaining").textContent = budget > 0
        ? remaining >= 0
          ? `${formatCurrency(remaining)} ${id ? "tersisa" : "left"}`
          : `${formatCurrency(Math.abs(remaining))} ${id ? "melebihi anggaran" : "over budget"}`
        : (id ? "Atur anggaran bulanan" : "Set a monthly budget");

      ["#budgetProgress", "#budgetOverviewProgress"].forEach((selector) => {
        if ($(selector)) {
          $(selector).style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
          $(selector).className = `progress-fill ${fillClass}`;
        }
      });

      $("#budgetOverviewPercent").textContent = budget > 0
        ? `${percent}% ${id ? "anggaran terpakai" : "of budget used"}`
        : (id ? "Belum ada anggaran" : "No budget set");

      $("#budgetOverviewRemaining").textContent = budget > 0
        ? remaining >= 0
          ? `${formatCurrency(remaining)} ${id ? "tersisa" : "remaining"}`
          : `${formatCurrency(Math.abs(remaining))} ${id ? "melebihi anggaran" : "over budget"}`
        : (id ? "Atur anggaran bulanan" : "Set a monthly budget");

      $("#budgetStatus").textContent = budget <= 0
        ? (id ? "Belum ada anggaran" : "No budget")
        : ratio >= 1
          ? (id ? "Melebihi anggaran" : "Over budget")
          : ratio >= 0.8
            ? (id ? "Hampir mencapai batas" : "Almost there")
            : (id ? "Aman" : "On track");

      $("#budgetStatus").className = `status-pill ${budget > 0 && ratio >= 0.8 ? "warning" : ""}`;

      $("#budgetMonthLabel").textContent = new Intl.DateTimeFormat(id ? "id-ID" : "en-US", {
        month: "long",
        year: "numeric"
      }).format(today);

      const totals = {};
      monthExpenses().forEach((item) => {
        totals[item.category] = (totals[item.category] || 0) + Number(item.amount);
      });

      const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);

      $("#budgetCategoryList").innerHTML = entries.length
        ? entries.map(([name, amount]) => {
            const category = getCategory(name, "expense");
            const cap = Math.max(amount * 1.25, 500000);
            const categoryPercent = Math.min(100, amount / cap * 100);
            const totalPercent = Math.round(amount / Math.max(spent, 1) * 100);
            const displayName = id ? (category.id || name) : name;

            return `<div class="budget-category">
              <span class="category-icon" style="background:${category.color}">${category.icon}</span>
              <div class="category-info">
                <div class="category-info-top"><strong>${escapeHTML(displayName)}</strong><span>${formatCurrency(amount)}</span></div>
                <div class="progress-track category-progress"><div class="progress-fill" style="width:${categoryPercent}%"></div></div>
              </div>
              <span class="category-amount">${totalPercent}%</span>
            </div>`;
          }).join("")
        : `<div class="empty-state">${id ? "Tambahkan pengeluaran untuk melihat kategori." : "Add expenses to see category insights."}</div>`;

      $("#categoryBudgetList").innerHTML = entries.length
        ? entries.map(([name, amount]) => {
            const category = getCategory(name, "expense");
            const share = spent > 0 ? amount / spent * 100 : 0;
            const categoryLimit = Math.round(budget * share / 100);
            const over = budget > 0 && amount > categoryLimit;
            const displayName = id ? (category.id || name) : name;

            return `<div class="category-budget-item">
              <span class="category-icon" style="background:${category.color}">${category.icon}</span>
              <div class="category-info">
                <div class="category-info-top"><strong>${escapeHTML(displayName)}</strong><span>${Math.round(share)}% ${id ? "dari pengeluaran" : "of spending"}</span></div>
                <div class="progress-track category-progress"><div class="progress-fill ${over ? "warning" : ""}" style="width:${Math.min(100, share)}%"></div></div>
              </div>
              <div class="category-budget-right"><strong>${formatCurrency(amount)}</strong><span>${formatCurrency(categoryLimit)} ${id ? "alokasi disarankan" : "suggested share"}</span></div>
            </div>`;
          }).join("")
        : `<div class="empty-state">${id ? "Belum ada pengeluaran bulan ini." : "No expenses recorded for this month yet."}</div>`;
    }

    function renderReports() {
      const expenses = rangeExpenses();
      const totals = {};

      expenses.forEach((item) => {
        totals[item.category] = (totals[item.category] || 0) + Number(item.amount);
      });

      const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
      const total = sum(expenses);
      const id = selectedLanguage === "id";

      $("#reportBreakdown").innerHTML = entries.length
        ? entries.map(([name, amount]) => {
            const category = getCategory(name, "expense");
            const percent = total > 0 ? amount / total * 100 : 0;
            const displayName = id ? (category.id || name) : name;

            return `<div class="report-row">
              <span class="category-icon" style="background:${category.color}">${category.icon}</span>
              <div class="report-row-main">
                <div><strong>${escapeHTML(displayName)}</strong><span>${Math.round(percent)}%</span></div>
                <div class="progress-track category-progress"><div class="progress-fill" style="width:${percent}%"></div></div>
              </div>
              <span class="report-row-amount">${formatCurrency(amount)}</span>
            </div>`;
          }).join("")
        : `<div class="empty-state">${id ? "Tambahkan pengeluaran untuk membuat laporan." : "Add some expenses to build your report."}</div>`;
    }

    function updateFormCategories(selected = "") {
      const options = categories[currentType];
      const select = $("#transactionCategory");
      if (!select) return;

      select.innerHTML = options.map((item) => {
        const name = selectedLanguage === "id" ? item.id : item.name;
        return `<option value="${escapeHTML(item.name)}">${item.icon} ${escapeHTML(name)}</option>`;
      }).join("");

      if (selected && options.some((item) => item.name === selected)) select.value = selected;
    }

    function renderCategoryOptions() {
      const all = [...new Map([...categories.expense, ...categories.income].map((item) => [item.name, item])).values()];
      const filter = $("#categoryFilter");
      if (!filter) return;

      const previous = filter.value;
      filter.innerHTML = `<option value="all">${selectedLanguage === "id" ? "Semua kategori" : "All categories"}</option>` +
        all.map((item) => `<option value="${escapeHTML(item.name)}">${escapeHTML(selectedLanguage === "id" ? item.id : item.name)}</option>`).join("");

      if (all.some((item) => item.name === previous)) filter.value = previous;
      updateFormCategories();
    }

    function renderChart() {
      const canvas = $("#cashflowChart");
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const count = Number($("#chartPeriod").value || 6);
      const id = selectedLanguage === "id";
      const monthNames = new Intl.DateTimeFormat(id ? "id-ID" : "en-US", { month: "short" });
      const points = [];

      for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();

        const items = state.transactions.filter((item) => {
          const parts = item.date.split("-").map(Number);
          return parts[0] === year && parts[1] === month + 1;
        });

        points.push({
          label: monthNames.format(date),
          income: sum(items.filter((item) => item.type === "income")),
          expense: sum(items.filter((item) => item.type === "expense"))
        });
      }

      const max = Math.max(1000000, ...points.flatMap((point) => [point.income, point.expense])) * 1.15;
      const left = 42, right = 8, top = 10, bottom = 28;
      const plotWidth = Math.max(0, width - left - right);
      const plotHeight = Math.max(0, height - top - bottom);

      ctx.clearRect(0, 0, width, height);
      ctx.font = "9px DM Sans, sans-serif";
      ctx.textBaseline = "middle";

      const css = getComputedStyle(document.body);
      const gridColor = css.getPropertyValue("--line").trim() || "#e8eeeb";
      const textColor = css.getPropertyValue("--muted").trim() || "#87958d";

      for (let i = 0; i <= 4; i++) {
        const y = top + plotHeight * i / 4;
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
        ctx.stroke();

        const value = max * (1 - i / 4);
        ctx.fillStyle = textColor;
        ctx.textAlign = "right";
        ctx.fillText(value >= 1000000 ? `${(value / 1000000).toFixed(1)}m` : `${Math.round(value / 1000)}k`, left - 8, y);
      }

      const groupWidth = plotWidth / count;
      const barWidth = Math.min(13, groupWidth * 0.24);

      points.forEach((point, index) => {
        const center = left + groupWidth * (index + 0.5);
        const incomeHeight = point.income / max * plotHeight;
        const expenseHeight = point.expense / max * plotHeight;

        ctx.fillStyle = "#23835e";
        roundRect(ctx, center - barWidth - 2, top + plotHeight - incomeHeight, barWidth, incomeHeight, 4);

        ctx.fillStyle = "#f2a06c";
        roundRect(ctx, center + 2, top + plotHeight - expenseHeight, barWidth, expenseHeight, 4);

        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText(point.label, center, height - 11);
      });
    }

    function roundRect(ctx, x, y, width, height, radius) {
      if (height <= 0 || width <= 0) return;
      const r = Math.min(radius, width / 2, height);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
      ctx.fill();
    }

    function renderAll() {
      renderStats();
      renderRecentTransactions();
      renderAllTransactions();
      renderBudget();
      renderReports();
      renderChart();
      applyLanguage();
    }

    // ==========================================
    // MODAL TRANSAKSI DAN ANGGARAN
    // ==========================================

    function openTransactionModal(item = null) {
      editingId = item ? item.id : null;
      currentType = item ? item.type : "expense";

      $("#transactionForm").reset();
      $("#transactionId").value = item ? item.id : "";
      $("#transactionTitle").value = item ? item.title : "";
      $("#transactionAmount").value = item ? item.amount : "";
      $("#transactionDate").value = item ? item.date : localDateString();
      $("#transactionNote").value = item ? item.note || "" : "";

      $$(".type-choice").forEach((button) => {
        button.classList.toggle("active", button.dataset.type === currentType);
      });

      updateFormCategories(item ? item.category : "");

      $("#modalTitle").textContent = item
        ? (selectedLanguage === "id" ? "Ubah transaksi" : "Edit transaction")
        : (selectedLanguage === "id" ? "Tambah transaksi" : "Add transaction");

      $("#saveTransactionButton").innerHTML = item
        ? `${selectedLanguage === "id" ? "Simpan perubahan" : "Save changes"} <span>→</span>`
        : `${selectedLanguage === "id" ? "Simpan transaksi" : "Save transaction"} <span>→</span>`;

      $("#transactionModal").classList.add("open");
      $("#transactionModal").setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.setTimeout(() => $("#transactionTitle").focus(), 100);
    }

    function closeTransactionModal() {
      $("#transactionModal").classList.remove("open");
      $("#transactionModal").setAttribute("aria-hidden", "true");
      if (!$("#budgetModal").classList.contains("open")) document.body.style.overflow = "";
      editingId = null;
    }

    function openBudgetModal() {
      $("#monthlyLimitInput").value = state.budget || "";
      $("#budgetModal").classList.add("open");
      $("#budgetModal").setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.setTimeout(() => $("#monthlyLimitInput").focus(), 100);
    }

    function closeBudgetModal() {
      $("#budgetModal").classList.remove("open");
      $("#budgetModal").setAttribute("aria-hidden", "true");
      if (!$("#transactionModal").classList.contains("open")) document.body.style.overflow = "";
    }

    function switchPage(page) {
      const target = $(`#page-${page}`);
      if (!target) return;

      $$(".page-view").forEach((view) => view.classList.toggle("active", view === target));
      $$(".nav-item[data-page]").forEach((item) => item.classList.toggle("active", item.dataset.page === page));

      const labels = {
        dashboard: selectedLanguage === "id" ? "Dasbor" : "Dashboard",
        transactions: selectedLanguage === "id" ? "Transaksi" : "Transactions",
        budgets: selectedLanguage === "id" ? "Anggaran bulanan" : "Monthly budget",
        reports: selectedLanguage === "id" ? "Laporan" : "Reports",
        settings: selectedLanguage === "id" ? "Pengaturan" : "Settings"
      };

      $("#breadcrumbCurrent").textContent = labels[page] || labels.dashboard;
      if (page === "reports") renderReports();
      if (page === "budgets") renderBudget();
      if (page === "dashboard") window.setTimeout(renderChart, 50);

      $("#sidebar").classList.remove("open");
      window.scrollTo({ top: 0, behavior: "smooth" });
      applyLanguage();
    }

    function renderNotifications() {
      const spent = sum(monthExpenses());
      const ratio = state.budget > 0 ? spent / state.budget : 0;
      const id = selectedLanguage === "id";

      let content = `
        <div class="notification-item">
          <span>✦</span>
          <div>
            <strong>${id ? "Selamat datang di UangKu" : "Welcome to UangKu"}</strong>
            <p>${id ? "Data demo disimpan di browser ini." : "Your demo data is stored locally in this browser."}</p>
          </div>
        </div>`;

      if (state.budget > 0 && ratio >= 0.8) {
        content += `<div class="notification-item"><span>!</span><div>
          <strong>${id ? "Pengingat anggaran" : "Budget reminder"}</strong>
          <p>${id ? `Kamu telah menggunakan ${Math.round(ratio * 100)}% anggaran bulanan.` : `You've used ${Math.round(ratio * 100)}% of your monthly budget.`}</p>
        </div></div>`;
      } else {
        content += `<div class="notification-item"><span>✓</span><div>
          <strong>${id ? "Keuangan terkendali" : "You're on track"}</strong>
          <p>${state.budget > 0
            ? (id ? "Pengeluaran masih dalam batas anggaran." : "Your spending is currently within your monthly limit.")
            : (id ? "Atur anggaran bulanan untuk memantau pengeluaran." : "Set a monthly budget to track your spending.")}</p>
        </div></div>`;
      }

      $("#notificationContent").innerHTML = content;
    }

    // ==========================================
    // BAHASA, PROFIL, EKSPOR, FILTER TANGGAL
    // ==========================================

    function installExtraStyles() {
      if ($("#uangkuExtraStyles")) return;

      const style = document.createElement("style");
      style.id = "uangkuExtraStyles";
      style.textContent = `
        .uangku-popover {
          position:absolute; z-index:1000; top:calc(100% + 8px); right:0;
          min-width:230px; max-width:calc(100vw - 32px); padding:14px;
          border:1px solid var(--line,#e8eeeb); border-radius:14px;
          background:var(--surface,#fff); color:var(--text,#20332a);
          box-shadow:0 14px 40px rgba(0,0,0,.12);
        }
        .uangku-popover label,.uangku-popover strong { display:block; margin-bottom:8px; font-size:13px; }
        .uangku-popover select,.uangku-popover input,.uangku-profile-modal input {
          box-sizing:border-box; width:100%; min-width:0; padding:10px; margin:4px 0 10px;
          border:1px solid var(--line,#dce5df); border-radius:9px;
          background:var(--bg,#f8faf9); color:var(--text,#20332a); font:inherit;
        }
        .uangku-popover button,.uangku-profile-modal button {
          padding:9px 12px; border:0; border-radius:9px; cursor:pointer; font:inherit;
        }
        .uangku-primary { width:100%; background:var(--green,#23835e); color:#fff; font-weight:600; }
        .uangku-menu-item {
          display:block; width:100%; padding:10px; border:0; border-radius:8px;
          background:transparent; color:var(--text,#20332a); text-align:left; cursor:pointer;
        }
        .uangku-menu-item:hover { background:var(--bg,#f4f7f5); }
        .uangku-overlay {
          position:fixed; inset:0; z-index:2000; display:none; align-items:center;
          justify-content:center; padding:20px; background:rgba(12,24,18,.45);
        }
        .uangku-overlay.open { display:flex; }
        .uangku-profile-modal {
          box-sizing:border-box; width:min(100%,420px); padding:24px;
          border-radius:18px; background:var(--surface,#fff); color:var(--text,#20332a);
          box-shadow:0 20px 60px rgba(0,0,0,.2);
        }
        .uangku-profile-modal h2 { margin:0 0 8px; }
        .uangku-profile-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:8px; }
        .uangku-profile-actions .uangku-primary { width:auto; }
        .date-chip { cursor:pointer; position:relative; }
        .profile-mini { gap:12px; }
        .profile-mini .profile-copy { flex:1; min-width:0; }
        .profile-mini .more-button { flex:0 0 auto; margin-left:8px; padding:8px; }
        .profile-mini > .avatar,.profile-mini > .profile-avatar { flex-shrink:0; }
        .top-avatar { cursor:pointer; }
        .uangku-popover[hidden] { display:none !important; }
        @media(max-width:480px) {
          .uangku-popover { position:fixed; top:90px; left:16px; right:16px; min-width:0; }
        }
      `;
      document.head.appendChild(style);
    }

    function updateProfileDisplay() {
      const name = (accountProfile.username || "User").trim();
      const initials = name.split(/\s+/).slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase()).join("") || "U";

      const profileName = $(".profile-mini strong");
      const profileSubtitle = $(".profile-mini .profile-subtitle");

      if (profileName) profileName.textContent = name;
      if (profileSubtitle) profileSubtitle.textContent =
        selectedLanguage === "id" ? "Akun pribadi" : "Personal account";

      const topAvatar = $(".top-avatar");
      if (topAvatar) {
        topAvatar.textContent = initials;
        topAvatar.setAttribute("aria-label", selectedLanguage === "id" ? "Buka pengaturan akun" : "Open account settings");
        topAvatar.title = selectedLanguage === "id" ? "Pengaturan akun" : "Account settings";
      }

      const bottomAvatar = $(".profile-mini .avatar, .profile-mini .profile-avatar");
      if (bottomAvatar) bottomAvatar.textContent = initials;
    }

    function openAccountSettings() {
      let overlay = $("#uangkuProfileOverlay");
      const id = selectedLanguage === "id";

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "uangkuProfileOverlay";
        overlay.className = "uangku-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        document.body.appendChild(overlay);
      }

      overlay.innerHTML = `
        <div class="uangku-profile-modal">
          <h2>${id ? "Pengaturan akun" : "Account settings"}</h2>
          <p>${id ? "Ubah nama yang ditampilkan pada akun UangKu." : "Update the name shown on your UangKu account."}</p>
          <form id="uangkuProfileForm">
            <label for="uangkuUsername">${id ? "Nama pengguna" : "Username"}</label>
            <input id="uangkuUsername" name="username" maxlength="40" autocomplete="nickname" required>
            <div class="uangku-profile-actions">
              <button type="button" id="uangkuProfileCancel">${id ? "Batal" : "Cancel"}</button>
              <button type="submit" class="uangku-primary">${id ? "Simpan profil" : "Save profile"}</button>
            </div>
          </form>
          <p style="font-size:12px;opacity:.7;margin-top:16px">${id ? "Pengaturan ini tersimpan di browser. Login sungguhan belum diaktifkan." : "This profile is stored in this browser. Real account login is not enabled yet."}</p>
        </div>`;

      $("#uangkuUsername").value = accountProfile.username || "";
      overlay.classList.add("open");

      overlay.onclick = (event) => {
        if (event.target === overlay) overlay.classList.remove("open");
      };

      $("#uangkuProfileCancel").onclick = () => overlay.classList.remove("open");

      $("#uangkuProfileForm").onsubmit = (event) => {
        event.preventDefault();
        const username = $("#uangkuUsername").value.trim();

        if (!username) {
          showToast(
            id ? "Nama pengguna wajib diisi" : "Username required",
            id ? "Silakan masukkan nama pengguna." : "Please enter a username.",
            "warning"
          );
          return;
        }

        accountProfile.username = username.slice(0, 40);

        try {
          localStorage.setItem(EXTRA_KEYS.profile, JSON.stringify(accountProfile));
        } catch (error) {
          showToast(id ? "Penyimpanan gagal" : "Save failed", String(error), "warning");
          return;
        }

        updateProfileDisplay();
        overlay.classList.remove("open");
        showToast(
          id ? "Profil diperbarui" : "Profile updated",
          id ? "Nama pengguna berhasil disimpan." : "Your username has been saved."
        );
      };

      $("#uangkuUsername").focus();
    }

    function exportTransactions(format) {
      const rows = [
        ["Title", "Amount", "Type", "Category", "Date", "Note"],
        ...state.transactions.map((item) => [
          item.title, item.amount, item.type, item.category, item.date, item.note || ""
        ])
      ];

      const escapeCSV = (value) => {
        let text = String(value ?? "");
        if (/^[=+\-@]/.test(text)) text = "'" + text;
        return `"${text.replace(/"/g, '""')}"`;
      };

      let content, mime, extension;

      if (format === "xls") {
        const tableRows = rows.map((row, index) => {
          const cells = row.map((cell) => {
            const safe = escapeHTML(String(cell ?? ""));
            return index === 0 ? `<th>${safe}</th>` : `<td>${safe}</td>`;
          }).join("");
          return `<tr>${cells}</tr>`;
        }).join("");

        content = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${tableRows}</table></body></html>`;
        mime = "application/vnd.ms-excel;charset=utf-8;";
        extension = "xls";
      } else {
        // BOM dan CRLF harus berupa karakter asli, bukan teks literal "\\uFEFF".
        content = "\uFEFF" + rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
        mime = "text/csv;charset=utf-8;";
        extension = "csv";
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `uangku-transactions-${localDateString()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      showToast(
        selectedLanguage === "id" ? "Ekspor selesai" : "Export complete",
        selectedLanguage === "id"
          ? `Data transaksi diekspor sebagai ${extension.toUpperCase()}.`
          : `Your transaction data was exported as ${extension.toUpperCase()}.`
      );
    }

    function addExportMenu() {
      const button = $(".more-button");
      if (!button || $("#uangkuExportMenu")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "uangku-export-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.flex = "0 0 auto";
      button.parentNode.insertBefore(wrapper, button);
      wrapper.appendChild(button);

      const menu = document.createElement("div");
      menu.id = "uangkuExportMenu";
      menu.className = "uangku-popover";
      menu.hidden = true;
      menu.innerHTML = `
        <strong>${selectedLanguage === "id" ? "Ekspor data transaksi" : "Export transaction data"}</strong>
        <button type="button" class="uangku-menu-item" data-export-format="csv">Export CSV (.csv)</button>
        <button type="button" class="uangku-menu-item" data-export-format="xls">Export Excel (.xls)</button>`;
      wrapper.appendChild(menu);

      button.setAttribute("aria-label", selectedLanguage === "id" ? "Buka menu ekspor" : "Open export menu");
      button.title = selectedLanguage === "id" ? "Ekspor data" : "Export data";

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden = !menu.hidden;
      });

      menu.addEventListener("click", (event) => {
        const target = event.target.closest("[data-export-format]");
        if (!target) return;
        exportTransactions(target.dataset.exportFormat);
        menu.hidden = true;
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) menu.hidden = true;
      });
    }

    function addDateFilter() {
      const chip = $(".date-chip");
      if (!chip || $("#uangkuDatePopover")) return;

      const popover = document.createElement("div");
      popover.id = "uangkuDatePopover";
      popover.className = "uangku-popover";
      popover.hidden = true;
      popover.innerHTML = `
        <strong id="uangkuDateTitle"></strong>
        <label for="uangkuDatePreset" id="uangkuDateRangeLabel"></label>
        <select id="uangkuDatePreset">
          <option value="today">Today</option>
          <option value="7days">Last 7 days</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>
        <div id="uangkuCustomDates" hidden>
          <label for="uangkuDateStart" id="uangkuStartLabel"></label>
          <input type="date" id="uangkuDateStart">
          <label for="uangkuDateEnd" id="uangkuEndLabel"></label>
          <input type="date" id="uangkuDateEnd">
        </div>
        <button type="button" id="uangkuApplyDates" class="uangku-primary"></button>`;
      chip.appendChild(popover);

      const preset = $("#uangkuDatePreset");
      const start = $("#uangkuDateStart");
      const end = $("#uangkuDateEnd");
      const custom = $("#uangkuCustomDates");

      preset.value = selectedRange.preset || "month";
      start.value = selectedRange.start || localDateString();
      end.value = selectedRange.end || localDateString();
      custom.hidden = preset.value !== "custom";

      preset.addEventListener("change", () => {
        custom.hidden = preset.value !== "custom";
      });

      chip.addEventListener("click", (event) => {
        if (event.target.closest("#uangkuDatePopover")) return;
        event.preventDefault();
        popover.hidden = !popover.hidden;
      });

      $("#uangkuApplyDates").addEventListener("click", () => {
        const now = new Date();
        let startDate, endDate;

        switch (preset.value) {
          case "today":
            startDate = endDate = localDateString(now);
            break;
          case "7days": {
            const first = new Date(now);
            first.setDate(first.getDate() - 6);
            startDate = localDateString(first);
            endDate = localDateString(now);
            break;
          }
          case "custom":
            startDate = start.value;
            endDate = end.value;
            if (!startDate || !endDate || startDate > endDate) {
              showToast(
                selectedLanguage === "id" ? "Rentang tanggal tidak valid" : "Invalid date range",
                selectedLanguage === "id" ? "Pilih tanggal mulai dan akhir yang valid." : "Choose a valid start and end date.",
                "warning"
              );
              return;
            }
            break;
          default:
            startDate = localDateString(new Date(now.getFullYear(), now.getMonth(), 1));
            endDate = localDateString(now);
        }

        selectedRange = { preset: preset.value, start: startDate, end: endDate };
        localStorage.setItem(EXTRA_KEYS.dateRange, JSON.stringify(selectedRange));

        updateDateChipLabel();
        popover.hidden = true;
        renderAll();

        showToast(
          selectedLanguage === "id" ? "Filter tanggal diterapkan" : "Date filter applied",
          `${formatDate(startDate)} – ${formatDate(endDate)}`
        );
      });

      updateDateChipLabel();
    }

    function updateDateChipLabel() {
      const label = $("#todayLabel");
      if (!label) return;

      const names = selectedLanguage === "id"
        ? { today: "Hari ini", "7days": "7 hari terakhir", month: "Bulan ini", custom: "Rentang tanggal" }
        : { today: "Today", "7days": "Last 7 days", month: "This month", custom: "Custom range" };

      label.textContent = names[selectedRange.preset] || names.month;
      label.title = `${formatDate(selectedRange.start)} – ${formatDate(selectedRange.end)}`;

      const id = selectedLanguage === "id";
      if ($("#uangkuDateTitle")) $("#uangkuDateTitle").textContent = id ? "Filter tanggal" : "Filter dates";
      if ($("#uangkuDateRangeLabel")) $("#uangkuDateRangeLabel").textContent = id ? "Rentang tanggal" : "Date range";
      if ($("#uangkuStartLabel")) $("#uangkuStartLabel").textContent = id ? "Tanggal mulai" : "Start date";
      if ($("#uangkuEndLabel")) $("#uangkuEndLabel").textContent = id ? "Tanggal akhir" : "End date";
      if ($("#uangkuApplyDates")) $("#uangkuApplyDates").textContent = id ? "Terapkan tanggal" : "Apply dates";

      const preset = $("#uangkuDatePreset");
      if (preset) {
        [...preset.options].forEach((option) => {
          const namesByValue = id
            ? { today: "Hari ini", "7days": "7 hari terakhir", month: "Bulan ini", custom: "Rentang khusus" }
            : { today: "Today", "7days": "Last 7 days", month: "This month", custom: "Custom range" };
          option.textContent = namesByValue[option.value] || option.textContent;
        });
      }
    }

    function installEnhancements() {
      installExtraStyles();
      addDateFilter();
      addExportMenu();
      updateProfileDisplay();

      const brand = $(".brand[data-page='dashboard']");
      if (brand) {
        brand.addEventListener("click", (event) => {
          event.preventDefault();
          switchPage("dashboard");
        });
      }

      const topAvatar = $(".top-avatar");
      if (topAvatar) topAvatar.addEventListener("click", openAccountSettings);

      const profile = $(".profile-mini");
      if (profile) {
        profile.style.cursor = "pointer";
        profile.setAttribute("role", "button");
        profile.setAttribute("tabindex", "0");
        profile.setAttribute("aria-label", selectedLanguage === "id" ? "Buka pengaturan akun" : "Open account settings");

        profile.addEventListener("click", (event) => {
          if (event.target.closest(".more-button") || event.target.closest(".uangku-export-wrapper")) return;
          openAccountSettings();
        });

        profile.addEventListener("keydown", (event) => {
          if ((event.key === "Enter" || event.key === " ") && event.target === profile) {
            event.preventDefault();
            openAccountSettings();
          }
        });
      }
    }

    // ==========================================
    // EVENT UTAMA
    // ==========================================

    function bindEvents() {
      
      // Pengaturan bahasa
      const languageSelect = $("#uangkuLanguage");

      if (languageSelect) {
        languageSelect.addEventListener("change", (event) => {
          saveLanguage(event.target.value);

          renderCategoryOptions();
          renderAll();
          renderNotifications();
        });
      }

      $("#addTransactionButton").addEventListener("click", () => openTransactionModal());
      $("#addTransactionButton2").addEventListener("click", () => openTransactionModal());
      $("#closeModal").addEventListener("click", closeTransactionModal);
      $("#cancelModal").addEventListener("click", closeTransactionModal);

      $("#transactionModal").addEventListener("click", (event) => {
        if (event.target === $("#transactionModal")) closeTransactionModal();
      });

      $("#closeBudgetModal").addEventListener("click", closeBudgetModal);
      $("#cancelBudgetModal").addEventListener("click", closeBudgetModal);

      $("#budgetModal").addEventListener("click", (event) => {
        if (event.target === $("#budgetModal")) closeBudgetModal();
      });

      $("#editBudgetButton").addEventListener("click", openBudgetModal);
      $("#chartPeriod").addEventListener("change", renderChart);

      $("#transactionSearch").addEventListener("input", renderAllTransactions);
      $("#typeFilter").addEventListener("change", renderAllTransactions);
      $("#categoryFilter").addEventListener("change", renderAllTransactions);

      $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

      $("#notificationButton").addEventListener("click", () => {
        renderNotifications();
        $("#notificationPopover").classList.toggle("hidden");
      });

      $("#closeNotifications").addEventListener("click", () => {
        $("#notificationPopover").classList.add("hidden");
      });

      $("#tipsButton").addEventListener("click", () => {
        showToast(
          selectedLanguage === "id" ? "Tips keuangan" : "Money tip",
          selectedLanguage === "id"
            ? "Tinjau pengeluaran setiap minggu dan tentukan batas yang realistis."
            : "Review your spending weekly and give each category a realistic limit."
        );
      });

      $("#themeToggle").checked = state.dark;
      $("#alertsToggle").checked = state.alerts;
      document.body.classList.toggle("dark-theme", state.dark);

      $("#themeToggle").addEventListener("change", (event) => {
        const previous = state.dark;
        state.dark = event.target.checked;

        if (!saveState()) {
          state.dark = previous;
          event.target.checked = previous;
          return;
        }

        document.body.classList.toggle("dark-theme", state.dark);
        renderChart();
      });

      $("#alertsToggle").addEventListener("change", (event) => {
        const previous = state.alerts;
        state.alerts = event.target.checked;

        if (!saveState()) {
          state.alerts = previous;
          event.target.checked = previous;
          return;
        }

        showToast(
          selectedLanguage === "id" ? "Preferensi disimpan" : "Preferences saved",
          state.alerts
            ? (selectedLanguage === "id" ? "Peringatan anggaran diaktifkan." : "Budget alerts are enabled.")
            : (selectedLanguage === "id" ? "Peringatan anggaran dinonaktifkan." : "Budget alerts are disabled.")
        );
      });

      $$(".nav-item[data-page]").forEach((button) => {
        button.addEventListener("click", () => switchPage(button.dataset.page));
      });

      $$("[data-goto]").forEach((button) => {
        button.addEventListener("click", () => switchPage(button.dataset.goto));
      });

      $$(".type-choice").forEach((button) => {
        button.addEventListener("click", () => {
          currentType = button.dataset.type;
          $$(".type-choice").forEach((choice) => choice.classList.toggle("active", choice === button));
          updateFormCategories();
        });
      });

      $("#transactionForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const title = $("#transactionTitle").value.trim();
        const amount = Number($("#transactionAmount").value);
        const date = $("#transactionDate").value;
        const category = $("#transactionCategory").value;
        const note = $("#transactionNote").value.trim();

        if (!title || !Number.isFinite(amount) || amount <= 0 || !date || !category) {
          showToast(
            selectedLanguage === "id" ? "Periksa input" : "Check your input",
            selectedLanguage === "id"
              ? "Masukkan nama, jumlah yang valid, kategori, dan tanggal."
              : "Enter a name, a valid amount, a category, and a date.",
            "warning"
          );
          return;
        }

        const previousSpent = sum(monthExpenses());
        const item = {
          id: editingId || createId(),
          title,
          amount,
          date,
          type: currentType,
          category,
          note
        };

        const previousTransactions = state.transactions.map((entry) => ({ ...entry }));

        if (editingId) {
          if (!state.transactions.some((entry) => entry.id === editingId)) {
            showToast(
              selectedLanguage === "id" ? "Transaksi tidak ditemukan" : "Transaction not found",
              selectedLanguage === "id" ? "Transaksi mungkin sudah dihapus." : "The transaction may have been deleted.",
              "warning"
            );
            closeTransactionModal();
            renderAll();
            return;
          }

          state.transactions = state.transactions.map((entry) => entry.id === editingId ? item : entry);
        } else {
          state.transactions.push(item);
        }

        if (!saveState()) {
          state.transactions = previousTransactions;
          renderAll();
          return;
        }

        const wasEditing = Boolean(editingId);
        closeTransactionModal();
        renderAll();
        checkBudgetAlert(previousSpent);

        showToast(
          wasEditing
            ? (selectedLanguage === "id" ? "Transaksi diperbarui" : "Transaction updated")
            : (selectedLanguage === "id" ? "Transaksi ditambahkan" : "Transaction added"),
          `${item.title} · ${formatCurrency(item.amount)}`
        );
      });

      $("#budgetForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const value = Number($("#monthlyLimitInput").value);
        if (!Number.isFinite(value) || value <= 0) {
          showToast(
            selectedLanguage === "id" ? "Anggaran tidak valid" : "Invalid budget",
            selectedLanguage === "id" ? "Masukkan anggaran lebih dari nol." : "Enter a budget greater than zero.",
            "warning"
          );
          return;
        }

        const previous = state.budget;
        state.budget = value;

        if (!saveState()) {
          state.budget = previous;
          renderAll();
          return;
        }

        closeBudgetModal();
        renderAll();
        showToast(
          selectedLanguage === "id" ? "Anggaran diperbarui" : "Budget updated",
          selectedLanguage === "id"
            ? `Batas bulanan sekarang ${formatCurrency(value)}.`
            : `Your monthly limit is now ${formatCurrency(value)}.`
        );
        checkBudgetAlert(0);
      });

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const editButton = target.closest("[data-edit]");
        if (editButton) {
          const item = state.transactions.find((entry) => entry.id === editButton.dataset.edit);
          if (item) openTransactionModal(item);
          return;
        }

        const deleteButton = target.closest("[data-delete]");
        if (!deleteButton) return;

        const item = state.transactions.find((entry) => entry.id === deleteButton.dataset.delete);
        if (!item) return;

        const confirmed = window.confirm(
          selectedLanguage === "id"
            ? `Hapus transaksi "${item.title}"?`
            : `Delete "${item.title}"?`
        );
        if (!confirmed) return;

        const previous = state.transactions.map((entry) => ({ ...entry }));
        state.transactions = state.transactions.filter((entry) => entry.id !== item.id);

        if (!saveState()) {
          state.transactions = previous;
          renderAll();
          return;
        }

        renderAll();
        showToast(
          selectedLanguage === "id" ? "Transaksi dihapus" : "Transaction deleted",
          selectedLanguage === "id"
            ? `${item.title} telah dihapus.`
            : `${item.title} has been removed.`
        );
      });

      $("#resetDemoButton").addEventListener("click", () => {
        const confirmed = window.confirm(
          selectedLanguage === "id"
            ? "Reset semua transaksi, anggaran, dan preferensi? Tindakan ini tidak bisa dibatalkan."
            : "Reset all transactions, budget, and preferences? This action cannot be undone."
        );
        if (!confirmed) return;

        const previous = state;
        state = createInitialState();

        if (!saveState()) {
          state = previous;
          renderAll();
          return;
        }

        $("#transactionSearch").value = "";
        $("#typeFilter").value = "all";
        $("#categoryFilter").value = "all";
        $("#themeToggle").checked = false;
        $("#alertsToggle").checked = true;

        document.body.classList.remove("dark-theme");
        renderAll();

        showToast(
          selectedLanguage === "id" ? "Data direset" : "Data reset",
          selectedLanguage === "id"
            ? "Transaksi, anggaran, dan preferensi telah direset."
            : "Transactions, budget, and preferences have been reset."
        );
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeTransactionModal();
          closeBudgetModal();
          $("#notificationPopover").classList.add("hidden");
          $("#sidebar").classList.remove("open");

          const profileOverlay = $("#uangkuProfileOverlay");
          if (profileOverlay) profileOverlay.classList.remove("open");

          const datePopover = $("#uangkuDatePopover");
          if (datePopover) datePopover.hidden = true;

          const exportMenu = $("#uangkuExportMenu");
          if (exportMenu) exportMenu.hidden = true;
        }

        if (event.key === "Tab" && $("#transactionModal").classList.contains("open")) {
          trapModalFocus(event, $("#transactionModal"));
        } else if (event.key === "Tab" && $("#budgetModal").classList.contains("open")) {
          trapModalFocus(event, $("#budgetModal"));
        }
      });

      let resizeTimer;
      window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(renderChart, 100);
      });
    }

    function trapModalFocus(event, modal) {
      const focusable = [...modal.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )].filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // ==========================================
    // START APLIKASI
    // ==========================================

    function init() {
      const todayLabel = $("#todayLabel");
      if (todayLabel) {
        todayLabel.textContent = new Intl.DateTimeFormat(
          selectedLanguage === "id" ? "id-ID" : "en-US",
          { weekday: "short", day: "numeric", month: "short" }
        ).format(today);
      }

      renderCategoryOptions();
      bindEvents();
      installEnhancements();
      renderAll();
      applyLanguage();
    }

    init();
  })();
