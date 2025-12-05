# 🚀 Git Yönetim Araçları

Cypher Hero projesi için Git yönetim araçları.

## 📋 Dosyalar

### 1. `GIT_MANAGER.bat` - İnteraktif Git Yönetim Aracı
Tam özellikli, menü tabanlı Git yönetim aracı.

**Özellikler:**
- ✅ Git repository başlatma
- ✅ Remote repository bağlama
- ✅ Dosyaları ekleme ve commit yapma
- ✅ GitHub'a push yapma
- ✅ Status kontrolü
- ✅ Tüm işlemleri tek seferde yapma

**Kullanım:**
```bash
GIT_MANAGER.bat
```

### 2. `GIT_QUICK_START.bat` - Hızlı Kurulum
Tüm Git işlemlerini otomatik yapan hızlı kurulum scripti.

**Kullanım:**
```bash
GIT_QUICK_START.bat
```

## 🔧 Kullanım Adımları

### İlk Kez Git'e Yükleme

1. **GitHub'da Repository Oluştur**
   - GitHub'a giriş yapın
   - Yeni repository oluşturun
   - Repository URL'sini kopyalayın (örn: `https://github.com/kullaniciadi/cypher-hero.git`)

2. **Hızlı Kurulum (Önerilen)**
   ```bash
   GIT_QUICK_START.bat
   ```
   - Script size GitHub URL'sini soracak
   - Tüm işlemleri otomatik yapacak

3. **Manuel Kurulum**
   ```bash
   GIT_MANAGER.bat
   ```
   - Menüden seçim yaparak adım adım ilerleyin

### Sonraki Güncellemeler

Değişiklik yaptıktan sonra:

```bash
GIT_MANAGER.bat
```

Menüden:
1. **[3] Tüm Dosyaları Ekle ve Commit Yap** - Değişiklikleri commit edin
2. **[4] Push Yap** - GitHub'a yükleyin

## 🔐 GitHub Kimlik Doğrulaması

### Yöntem 1: GitHub Desktop (Önerilen)
1. [GitHub Desktop](https://desktop.github.com/) indirin ve kurun
2. GitHub hesabınızla giriş yapın
3. Artık push işlemleri otomatik çalışacak

### Yöntem 2: Personal Access Token
1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" tıklayın
3. `repo` yetkisini seçin
4. Token'ı kopyalayın
5. Push yaparken şifre yerine token kullanın

### Yöntem 3: SSH Key
1. SSH key oluşturun: `ssh-keygen -t ed25519 -C "email@example.com"`
2. Public key'i GitHub'a ekleyin
3. Remote URL'yi SSH formatına çevirin:
   ```bash
   git remote set-url origin git@github.com:kullaniciadi/repo.git
   ```

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: İlk Kez Yükleme
```bash
# 1. Hızlı kurulum scriptini çalıştır
GIT_QUICK_START.bat

# 2. GitHub URL'sini gir
# 3. Script otomatik olarak:
#    - Git başlatır
#    - Dosyaları ekler
#    - Commit yapar
#    - Push yapar
```

### Senaryo 2: Güncelleme
```bash
# 1. İnteraktif aracı aç
GIT_MANAGER.bat

# 2. Menüden [3] seç (Commit)
# 3. Commit mesajı gir
# 4. Menüden [4] seç (Push)
# 5. Branch seç (genelde main)
```

### Senaryo 3: Status Kontrolü
```bash
GIT_MANAGER.bat
# Menüden [5] seç (Status)
```

## ⚠️ Önemli Notlar

1. **`.env` Dosyaları**: Asla Git'e eklenmemeli (zaten .gitignore'da)
2. **`node_modules`**: Otomatik ignore edilir
3. **Commit Mesajları**: Açıklayıcı olmalı
4. **Branch**: Genelde `main` veya `master` kullanılır

## 🐛 Sorun Giderme

### "Push yapılamadı" Hatası
- GitHub kimlik doğrulaması kontrol edin
- Branch adını kontrol edin
- İnternet bağlantısını kontrol edin

### "Remote repository bağlanamadı" Hatası
- URL'yi kontrol edin
- GitHub'da repository'nin var olduğundan emin olun
- URL formatı: `https://github.com/kullaniciadi/repo.git`

### "Commit yapılamadı" Hatası
- Değişiklik olmayabilir (normal)
- Git repository başlatılmış mı kontrol edin

## 📚 Ek Kaynaklar

- [Git Dokümantasyonu](https://git-scm.com/doc)
- [GitHub Dokümantasyonu](https://docs.github.com/)
- [Git Bash Kullanımı](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line)

