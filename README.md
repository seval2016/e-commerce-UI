# E-Commerce UI & API (MERN)

## Proje Özeti
Modern, fullstack bir e-ticaret platformu. Frontend (React + Vite + Ant Design + Tailwind CSS), Backend (Node.js + Express + MongoDB). Admin ve kullanıcı paneli, ürün yönetimi, blog, yorum, sipariş, destek sistemi ve daha fazlası.

---

## Klasör Yapısı
```
/
  backend/      # Node.js + Express API
  frontend/     # React + Vite UI
```

---

## Hızlı Başlangıç (Local)
1. **MongoDB Atlas'tan ücretsiz veritabanı oluşturun.**
2. `.env` dosyalarını backend ve frontend için oluşturun:

### backend/.env örneği
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### frontend/.env örneği
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

3. **Kurulum:**
```sh
cd backend && npm install
cd ../frontend && npm install
```

4. **Çalıştır:**
```sh
# Backend
cd backend && npm run dev
# Frontend
cd ../frontend && npm run dev
```

---

## Render.com'da Fullstack Deploy (Ücretsiz)

### 1. Render.com'a Kayıt Ol
- https://render.com/ adresinden ücretsiz hesap aç.

### 2. MongoDB Atlas'tan Ücretsiz DB Oluştur
- https://www.mongodb.com/atlas/database
- Connection string'i backend/.env dosyana ekle.

### 3. Backend Deploy
- Render.com > New > Web Service > GitHub repo'nu seç
- Root directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start` veya `node server.js`
- Environment: Node
- .env dosyasındaki değişkenleri Render panelinden ekle

### 4. Frontend Deploy
- Render.com > New > Static Site > GitHub repo'nu seç
- Root directory: `frontend`
- Build Command: `npm run build`
- Publish directory: `dist`
- .env dosyasındaki VITE_API_URL değerini backend'in Render URL'si ile güncelle

### 5. Domain ve Son Ayarlar
- Render'ın verdiği URL'leri kullanabilir veya kendi domainini bağlayabilirsin.
- Frontend'den API çağrıları için CORS ve .env ayarlarını kontrol et.

---

## Özellikler
- Modern ve responsive UI
- Admin paneli (ürün, kategori, blog, sipariş, müşteri, destek yönetimi)
- Kullanıcı paneli (profil, siparişler, favoriler, yorumlar)
- JWT ile kimlik doğrulama
- Dosya yükleme (Multer)
- Yorum ve inceleme sistemi
- Bildirim ve istatistikler
- PDF fatura oluşturma (jsPDF)

---

## Katkı ve Lisans
- Pull request ve issue açabilirsiniz.
- MIT Lisansı
