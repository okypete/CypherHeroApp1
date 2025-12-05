# 🚀 Git Kurulum Rehberi - Windows

Bu rehber, Windows işletim sisteminde Git'i nasıl kuracağınızı adım adım anlatmaktadır.

## 📥 Git İndirme ve Kurulum

### Adım 1: Git İndirme
1. Tarayıcınızda şu adresi açın: **https://git-scm.com/download/win**
2. Sayfa otomatik olarak en son sürümü algılayacak ve indirme başlayacaktır
3. Alternatif olarak, **https://github.com/git-for-windows/git/releases** adresinden de indirebilirsiniz

### Adım 2: Kurulum Dosyasını Çalıştırma
1. İndirilen `.exe` dosyasını çift tıklayarak çalıştırın
2. İlk ekranda **"Next"** butonuna tıklayın

### Adım 3: Kurulum Ayarları

#### Lisans Sözleşmesi
- Lisans sözleşmesini okuyun ve **"Next"** butonuna tıklayın

#### Kurulum Konumu
- Varsayılan konumu kullanabilirsiniz (genellikle `C:\Program Files\Git`)
- Veya farklı bir konum seçmek isterseniz **"Browse"** butonuna tıklayın
- **"Next"** butonuna tıklayın

#### Bileşen Seçimi (Select Components)
✅ **Önerilen seçimler:**
- ✅ Additional icons (Ekstra simgeler)
- ✅ Windows Explorer integration (Windows Explorer entegrasyonu)
- ✅ Git LFS (Large File Support)
- ✅ Associate .git* configuration files with the default text editor
- ✅ Associate .sh files to be run with Bash
- ✅ Use a TrueType font in all console windows

**"Next"** butonuna tıklayın

#### Başlangıç Menüsü Klasörü
- Varsayılan ayarları kullanabilirsiniz
- **"Next"** butonuna tıklayın

#### Varsayılan Düzenleyici Seçimi
- **"Use Visual Studio Code as Git's default editor"** seçeneğini seçebilirsiniz (VS Code kullanıyorsanız)
- Veya **"Use the Nano editor by default"** seçeneğini seçebilirsiniz
- **"Next"** butonuna tıklayın

#### PATH Ortam Değişkeni Ayarları
🔴 **ÖNEMLİ:** Aşağıdaki seçeneği seçin:
- ✅ **"Git from the command line and also from 3rd-party software"** (ÖNERİLEN)
  - Bu seçenek Git'i hem komut satırından hem de üçüncü parti yazılımlardan kullanmanıza olanak sağlar

**"Next"** butonuna tıklayın

#### HTTPS Aktarım Kütüphanesi
- ✅ **"Use the OpenSSL library"** (Varsayılan - Önerilen)
- **"Next"** butonuna tıklayın

#### Satır Sonu Dönüşümleri (Line Ending Conversions)
🔴 **ÖNEMLİ:** Aşağıdaki seçeneği seçin:
- ✅ **"Checkout Windows-style, commit Unix-style line endings"** (ÖNERİLEN)
  - Bu, Windows ve Linux/Mac arasında uyumluluk sağlar

**"Next"** butonuna tıklayın

#### Terminal Emülatörü
- ✅ **"Use MinTTY (the default terminal of MSYS2)"** (Önerilen)
- **"Next"** butonuna tıklayın

#### Varsayılan Davranış (git pull)
- ✅ **"Default (fast-forward or merge)"** (Varsayılan)
- **"Next"** butonuna tıklayın

#### Credential Helper
- ✅ **"Git Credential Manager"** (Önerilen - GitHub ile otomatik kimlik doğrulama için)
- **"Next"** butonuna tıklayın

#### Ek Seçenekler (Extra Options)
✅ **Önerilen seçimler:**
- ✅ Enable file system caching
- ✅ Enable symbolic links

**"Next"** butonuna tıklayın

#### Deneysel Özellikler (Experimental Options)
- Bu adımı atlayabilirsiniz (varsayılan ayarları kullanın)
- **"Install"** butonuna tıklayın

### Adım 4: Kurulum Tamamlanıyor
- Kurulum işlemi başlayacak ve birkaç dakika sürebilir
- Kurulum tamamlandığında **"Finish"** butonuna tıklayın

## ✅ Kurulumu Doğrulama

### Terminal/Command Prompt'ta Kontrol
1. **Windows + R** tuşlarına basın
2. `cmd` yazın ve **Enter**'a basın
3. Veya PowerShell'i açın
4. Şu komutu çalıştırın:

```bash
git --version
```

**Beklenen çıktı:**
```
git version 2.xx.x.windows.x
```

Eğer bir versiyon numarası görüyorsanız, Git başarıyla kurulmuştur! 🎉

## 🔧 İlk Git Yapılandırması

Kurulumdan sonra Git'i yapılandırmanız gerekiyor:

### 1. Kullanıcı Adı ve E-posta Ayarlama

Terminal/PowerShell'de şu komutları çalıştırın:

```bash
git config --global user.name "Adınız Soyadınız"
git config --global user.email "email@example.com"
```

**Örnek:**
```bash
git config --global user.name "Ali Yılmaz"
git config --global user.email "ali@example.com"
```

### 2. Yapılandırmayı Kontrol Etme

```bash
git config --list
```

## 🎯 Sonraki Adımlar

Git kurulumu tamamlandıktan sonra:

1. ✅ **GIT_MANAGER.bat** dosyanızı kullanabilirsiniz
2. ✅ Projenizde Git repository başlatabilirsiniz
3. ✅ GitHub'a kod gönderebilirsiniz

### GIT_MANAGER.bat Kullanımı

Proje klasörünüzde `GIT_MANAGER.bat` dosyasını çift tıklayarak Git yönetim aracını başlatabilirsiniz.

## 🆘 Sorun Giderme

### Git komutu bulunamıyor hatası
- Bilgisayarınızı yeniden başlatın
- PATH ortam değişkeninin doğru ayarlandığından emin olun
- Git'in kurulu olduğu klasörü kontrol edin: `C:\Program Files\Git\cmd`

### GitHub kimlik doğrulama sorunu
- Git Credential Manager kurulu olmalı
- GitHub'da Personal Access Token oluşturmanız gerekebilir
- Daha fazla bilgi için: https://docs.github.com/en/authentication

## 📚 Faydalı Kaynaklar

- **Git Resmi Dokümantasyon:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

**Kurulum tamamlandıktan sonra GIT_MANAGER.bat dosyanızı kullanarak projenizi GitHub'a yükleyebilirsiniz!** 🚀

