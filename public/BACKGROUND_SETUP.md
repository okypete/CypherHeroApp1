# Background Pattern Setup

## Görseli Ekleme

1. Görseli `public` klasörüne ekleyin
2. Dosya adı: `background-pattern.png` (veya `.jpg`, `.webp`)
3. Görsel mavi neon çizgi sanat stili olmalı (görseldeki gibi)

## Alternatif Dosya Adları

Eğer farklı bir dosya adı kullanmak isterseniz, `app/globals.css` dosyasındaki şu satırları güncelleyin:

```css
background-image: 
  url('/background-pattern.png'),  /* Buraya dosya adınızı yazın */
  ...
```

## Önerilen Görsel Özellikleri

- Format: PNG (şeffaf arka plan için) veya JPG
- Boyut: 1920x1080 veya daha büyük (retina ekranlar için)
- Stil: Mavi neon çizgi sanat, koyu arka plan üzerinde
- Opasite: CSS'te 0.15 olarak ayarlanmış (hafif görünüm için)

## Not

Görsel eklenmezse, arka plan sadece gradient efektleriyle görünecektir (hata vermez).

