# 🚀 Vercel Deployment - Root Directory Sorunu Çözümü

## Sorun
Vercel'de root directory ayarı yok veya değiştirilemiyor. Next.js uygulaması `cypher-hero-app` alt klasöründe.

## ✅ Çözüm: Root'ta vercel.json ve package.json

Root dizinde (`CYPHER HERO` klasörü) iki dosya oluşturuldu:

### 1. `vercel.json` (Root dizinde)
Build komutlarını `cypher-hero-app` klasörüne yönlendirir.

### 2. `package.json` (Root dizinde)
Root'tan build yapabilmek için wrapper script'ler içerir.

## 📋 Deployment Adımları

### Yöntem 1: Mevcut Repository'yi Deploy Et (Önerilen)

1. **GitHub'a push yapın:**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push
   ```

2. **Vercel'de yeni proje oluşturun:**
   - Vercel Dashboard → "Add New Project"
   - GitHub repository'nizi seçin
   - Root directory: `./` (varsayılan, değiştirmeyin)
   - Framework: Next.js (otomatik algılanacak)
   - Build Command: Otomatik (vercel.json'dan alınacak)

3. **Environment Variables ekleyin:**
   - Settings → Environment Variables
   - Şunları ekleyin:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy edin!**

### Yöntem 2: Sadece cypher-hero-app'i Deploy Et

Eğer sadece `cypher-hero-app` klasörünü deploy etmek istiyorsanız:

1. **Yeni bir GitHub repository oluşturun**
2. **Sadece cypher-hero-app içindeki dosyaları push edin:**
   ```bash
   cd cypher-hero-app
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/kullaniciadi/cypher-hero-app.git
   git push -u origin main
   ```
3. **Vercel'de bu yeni repository'yi deploy edin**
   - Root directory: `./` (otomatik)
   - Artık root directory sorunu olmayacak

## 🔧 Dosya Yapısı

```
CYPHER HERO/
├── vercel.json          ← YENİ (Root'ta)
├── package.json         ← YENİ (Root'ta)
├── cypher-hero-app/
│   ├── app/
│   ├── components/
│   ├── package.json
│   ├── vercel.json
│   └── ...
└── ...
```

## ⚙️ Vercel Build Ayarları

Vercel otomatik olarak şunları algılayacak:

- **Framework:** Next.js
- **Build Command:** `cd cypher-hero-app && npm install && npm run build`
- **Output Directory:** `cypher-hero-app/.next`
- **Install Command:** `cd cypher-hero-app && npm install`

## 🧪 Test

Local'de test edin:

```bash
# Root dizinde
npm run build
```

Bu komut `cypher-hero-app` klasörüne gidip build yapacak.

## 📝 Notlar

- Root'taki `package.json` sadece wrapper'dır
- Asıl uygulama `cypher-hero-app` klasöründe
- Vercel build sırasında otomatik olarak `cypher-hero-app` klasörüne gidecek
- Environment variables'ları Vercel dashboard'dan eklemeyi unutmayın

## 🐛 Sorun Giderme

### "Build failed" hatası
- Environment variables'ları kontrol edin
- `cypher-hero-app/package.json` dosyasının mevcut olduğundan emin olun

### "Couldn't find app directory"
- `vercel.json` dosyasının root'ta olduğundan emin olun
- Build command'in doğru olduğundan emin olun

### Supabase bağlantı hatası
- Environment variables'ların Production, Preview ve Development için eklendiğinden emin olun

