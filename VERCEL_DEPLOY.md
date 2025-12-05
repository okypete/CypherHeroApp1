# 🚀 Vercel Deployment Guide

## Sorun
Vercel, `app` veya `pages` dizinini bulamıyor çünkü Next.js uygulaması `cypher-hero-app` alt dizininde.

## Çözüm 1: Vercel Dashboard'da Root Directory Ayarlama (Önerilen)

1. **Vercel Dashboard'a gidin**
   - https://vercel.com/dashboard
   - Projenizi seçin

2. **Settings → General → Root Directory**
   - "Root Directory" bölümünü bulun
   - `cypher-hero-app` yazın
   - "Save" tıklayın

3. **Redeploy yapın**
   - "Deployments" sekmesine gidin
   - Son deployment'ın yanındaki "..." menüsünden "Redeploy" seçin

## Çözüm 2: GitHub Repository Yapısını Değiştirme

Eğer sadece `cypher-hero-app` klasörünü deploy etmek istiyorsanız:

1. **Yeni bir repository oluşturun** (sadece cypher-hero-app için)
2. **Veya mevcut repository'yi düzenleyin:**
   ```bash
   # cypher-hero-app içindeki tüm dosyaları root'a taşıyın
   # (Sadece gerekli dosyaları)
   ```

## Çözüm 3: vercel.json Kullanma

`vercel.json` dosyası zaten oluşturuldu. Vercel otomatik olarak algılamalı.

## Vercel Environment Variables

Supabase için environment variables ekleyin:

1. **Vercel Dashboard → Settings → Environment Variables**
2. Şu değişkenleri ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Build Ayarları

Vercel otomatik olarak şunları algılamalı:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Kontrol Listesi

- [ ] Root Directory: `cypher-hero-app` olarak ayarlandı
- [ ] Environment Variables eklendi
- [ ] `package.json` mevcut
- [ ] `next.config.js` mevcut
- [ ] `app/` dizini mevcut
- [ ] `vercel.json` mevcut (opsiyonel)

## Hızlı Test

Local'de build test edin:
```bash
cd cypher-hero-app
npm run build
```

Eğer local'de çalışıyorsa, Vercel'de de çalışmalı (root directory ayarlandıktan sonra).

## Sorun Giderme

### "Couldn't find any `pages` or `app` directory"
- Root Directory'nin `cypher-hero-app` olarak ayarlandığından emin olun
- Vercel Dashboard → Settings → General → Root Directory

### Build hatası
- Environment variables'ları kontrol edin
- `npm run build` komutunu local'de test edin

### Supabase bağlantı hatası
- Environment variables'ların doğru eklendiğinden emin olun
- Production environment'ı seçtiğinizden emin olun

