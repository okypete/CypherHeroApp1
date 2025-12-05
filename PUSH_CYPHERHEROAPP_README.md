# 🚀 CypherHeroApp Git Push Aracı

Bu araç, `CypherHeroApp` klasörünü kolayca GitHub'a push etmenizi sağlar.

## 📋 Kullanım

### Hızlı Başlangıç

1. **`PUSH_CYPHERHEROAPP.bat`** dosyasını çift tıklayın
2. Menüden **`[1] Hızlı Push (Tüm İşlemler Otomatik)`** seçeneğini seçin
3. İlk kez kullanıyorsanız GitHub Repository URL'sini girin
4. İşlem tamamlanacak!

## 🎯 Menü Seçenekleri

### [1] Hızlı Push (Tüm İşlemler Otomatik)
- Git repository kontrolü ve başlatma (gerekirse)
- Remote repository kontrolü ve bağlama (gerekirse)
- Tüm dosyaları ekleme
- Otomatik commit
- GitHub'a push

**En kolay yöntem!** İlk kez kullanıyorsanız bu seçeneği kullanın.

### [2] Git Repository Başlat
- CypherHeroApp klasöründe Git repository başlatır
- İlk kez Git kullanıyorsanız bu adımı yapın

### [3] Remote Repository Bağla
- GitHub repository URL'sini bağlar
- Örnek: `https://github.com/kullaniciadi/repo.git`

### [4] Dosyaları Ekle ve Commit Yap
- Değişiklikleri staging area'ya ekler
- Commit mesajı ile commit yapar

### [5] Push Yap (GitHub'a Yükle)
- Commit'leri GitHub'a gönderir
- Branch seçimi yapabilirsiniz (varsayılan: main)

### [6] Status Kontrol Et
- Git durumunu gösterir
- Son commit bilgilerini gösterir
- Değişiklikleri listeler

### [7] Remote Repository Bilgisi
- Bağlı remote repository'leri gösterir

## 📝 İlk Kullanım Adımları

### Senaryo 1: Yeni Repository

1. GitHub'da yeni bir repository oluşturun
2. `PUSH_CYPHERHEROAPP.bat` dosyasını çalıştırın
3. **`[1] Hızlı Push`** seçeneğini seçin
4. Repository URL'sini girin: `https://github.com/kullaniciadi/repo.git`
5. İşlem tamamlanacak!

### Senaryo 2: Mevcut Repository

1. `PUSH_CYPHERHEROAPP.bat` dosyasını çalıştırın
2. **`[1] Hızlı Push`** seçeneğini seçin
3. Repository zaten bağlıysa direkt push yapılacak

## ⚙️ Manuel Adımlar

Eğer adım adım yapmak isterseniz:

1. **`[2] Git Repository Başlat`** - İlk kez Git kullanıyorsanız
2. **`[3] Remote Repository Bağla`** - GitHub URL'sini bağlayın
3. **`[4] Dosyaları Ekle ve Commit Yap`** - Değişiklikleri commit edin
4. **`[5] Push Yap`** - GitHub'a gönderin

## 🔧 Sorun Giderme

### "CypherHeroApp klasörü bulunamadı" hatası
- Script'i `cypher-hero-app` klasöründe çalıştırdığınızdan emin olun
- CypherHeroApp klasörünün mevcut dizinde olduğunu kontrol edin

### "Git repository başlatılamadı" hatası
- Git'in kurulu olduğundan emin olun
- `GIT_KURULUM_REHBERI.md` dosyasına bakın

### "Push yapılamadı" hatası
- GitHub kimlik doğrulaması gerekebilir
- Repository URL'sinin doğru olduğundan emin olun
- İnternet bağlantınızı kontrol edin
- Branch adının doğru olduğundan emin olun

### "Remote repository bağlı değil" hatası
- Önce **`[3] Remote Repository Bağla`** seçeneğini kullanın
- GitHub repository URL'sini doğru girdiğinizden emin olun

## 📌 Notlar

- Script otomatik olarak CypherHeroApp klasörüne gider
- İşlemler tamamlandıktan sonra ana dizine geri döner
- Commit mesajı girmezseniz otomatik tarih/saat kullanılır
- Branch belirtmezseniz varsayılan olarak `main` kullanılır

## 🎉 Başarılı Push Sonrası

Push başarılı olduğunda:
- Repository URL gösterilir
- Branch bilgisi gösterilir
- GitHub'da dosyalarınızı görebilirsiniz

---

**Kolay Git Push için `PUSH_CYPHERHEROAPP.bat` dosyasını kullanın!** 🚀

