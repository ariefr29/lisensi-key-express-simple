# Cara Penggunaan Sample License Demo

## 📋 Ringkasan
Project ini adalah contoh implementasi sederhana yang mendemonstrasikan bagaimana sistem lisensi key bekerja. Aplikasi ini akan:
- ✅ Memvalidasi license key melalui server utama
- ✅ Menyimpan license yang aktif secara lokal
- ✅ Menampilkan konten premium hanya jika license valid
- ❌ Menampilkan notifikasi error jika license tidak valid

## 🚀 Cara Menjalankan

### 1. Pastikan Server Utama Berjalan
Server utama harus berjalan di port **3001**:
```powershell
cd "c:/Users/arief/Desktop/experimen with AI/antigravity/lisensi-key-2"
$env:PORT=3001; npm run dev
```

### 2. Jalankan Sample App
Di terminal baru:
```powershell
cd "c:/Users/arief/Desktop/experimen with AI/antigravity/lisensi-key-2/contoh_implement"
node server.js
```

Server akan berjalan di: **http://localhost:3005**

## 📝 Langkah-langkah Testing

### Step 1: Buat License Key
1. Buka admin dashboard: http://localhost:3001/admin/dashboard
2. Login dengan kredensial admin
3. Klik menu **"Licenses"** → **"Create License"**
4. Isi form:
   - **License Key**: Akan di-generate otomatis (atau buat custom)
   - **Max Domains**: Misalnya `3`
   - **Expire Date**: Pilih tanggal di masa depan
   - **Notes**: Opsional
5. Klik **"Create"** dan **salin license key** yang dibuat

### Step 2: Aktivasi License di Sample App
1. Buka browser: http://localhost:3005
2. Anda akan melihat form input license key
3. Paste license key yang sudah dibuat
4. Klik tombol **"Activate"**

### Step 3: Hasil yang Diharapkan

#### ✅ Jika License VALID:
- Status akan menampilkan: **"License valid."**
- Form input akan hilang
- Muncul section **"Premium Content"** dengan pesan:
  ```
  🎉 This is premium content visible only with a valid license!
  ```
- Tombol **"Refresh Status"** tersedia untuk mengecek ulang

#### ❌ Jika License TIDAK VALID:
Akan muncul pesan error, misalnya:
- `"License key not found"` - Key tidak ada di database
- `"License is suspended"` - License di-suspend oleh admin
- `"License has expired"` - License sudah kadaluarsa
- `"Domain limit reached"` - Sudah mencapai batas maksimal domain

## 🔍 Testing Skenario Lain

### Skenario 1: License Expired
1. Buat license dengan expire date di masa lalu
2. Coba aktivasi → akan muncul error **"License has expired"**

### Skenario 2: License Suspended
1. Aktivasi license yang valid
2. Di admin dashboard, suspend license tersebut
3. Klik **"Refresh Status"** di sample app
4. Premium content akan hilang dan muncul pesan error

### Skenario 3: Domain Limit
1. Buat license dengan `max_domains: 1`
2. Aktivasi di sample app (localhost:3005)
3. Coba aktivasi lagi dengan domain berbeda
4. Akan muncul error **"Domain limit reached"**

## 🛠️ API Endpoints Sample App

### POST /activate
Aktivasi license key baru:
```powershell
curl.exe -X POST http://localhost:3005/activate `
  -H "Content-Type: application/json" `
  -d '{\"license_key\":\"YOUR-LICENSE-KEY\"}'
```

### GET /check
Cek status license yang tersimpan:
```powershell
curl.exe http://localhost:3005/check
```

### GET /premium
Akses konten premium (hanya jika license valid):
```powershell
curl.exe http://localhost:3005/premium
```

## 📂 Struktur File

```
contoh_implement/
├── package.json          # Dependencies
├── server.js             # Express server
├── license.json          # Penyimpanan license lokal (dibuat otomatis)
├── public/
│   ├── index.html        # UI halaman utama
│   ├── styles.css        # Styling
│   └── client.js         # Logic frontend
└── CARA_PENGGUNAAN.md    # File ini
```

## 💡 Cara Kerja Sistem

1. **Aktivasi**:
   - User input license key
   - Sample app kirim request ke server utama (`POST /api/activate`)
   - Server utama validasi key dan bind domain
   - Jika sukses, sample app simpan key di `license.json`

2. **Validasi**:
   - Sample app kirim request ke server utama (`POST /api/check`)
   - Server utama cek status license dan domain
   - Return status: `active`, `suspended`, atau `expired`

3. **Premium Content**:
   - Cek apakah ada license tersimpan di `license.json`
   - Jika ada, tampilkan konten premium
   - Jika tidak, tampilkan form aktivasi

## 🎯 Kesimpulan

Sample project ini mendemonstrasikan:
- ✅ Cara mengintegrasikan sistem license ke aplikasi
- ✅ Validasi license secara real-time
- ✅ Handling berbagai status license (active, suspended, expired)
- ✅ Proteksi konten premium dengan license key

Anda bisa menggunakan pola yang sama untuk mengintegrasikan sistem license ini ke aplikasi production Anda!
