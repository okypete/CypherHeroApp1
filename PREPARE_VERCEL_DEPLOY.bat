@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cls
echo ========================================
echo    VERCEL DEPLOY HAZIRLIK ARACI
echo ========================================
echo.
echo Bu script cypher-hero-app klasörünü
echo Vercel deploy için hazırlar.
echo.
echo [1] Sadece cypher-hero-app'i yeni repository olarak hazırla
echo [2] Mevcut repository'yi kullan (manuel ayar gerekli)
echo [3] Çıkış
echo.
set /p choice="Seçiminiz (1-3): "

if "%choice%"=="1" goto NEW_REPO
if "%choice%"=="2" goto EXISTING_REPO
if "%choice%"=="3" goto EXIT
goto MENU

:NEW_REPO
cls
echo ========================================
echo    YENİ REPOSITORY HAZIRLAMA
echo ========================================
echo.
echo Bu işlem:
echo 1. cypher-hero-app klasöründe yeni git repository başlatır
echo 2. Tüm dosyaları hazırlar
echo 3. GitHub'a push için komutları gösterir
echo.
set /p continue="Devam etmek istiyor musunuz? (E/H): "

if /i not "!continue!"=="E" (
    echo İşlem iptal edildi.
    pause
    goto EXIT
)

echo.
echo [1/3] Git repository başlatılıyor...
cd cypher-hero-app

if exist ".git" (
    echo [UYARI] Git repository zaten mevcut!
    echo.
    set /p overwrite="Mevcut git repository'yi silmek ister misiniz? (E/H): "
    if /i "!overwrite!"=="E" (
        rmdir /s /q .git 2>nul
        echo [✓] Eski git repository silindi.
    ) else (
        echo [BİLGİ] Mevcut git repository korunuyor.
        goto SKIP_INIT
    )
)

git init
if %errorlevel%==0 (
    echo [✓] Git repository başlatıldı!
) else (
    echo [✗] Git repository başlatılamadı!
    pause
    exit
)

:SKIP_INIT
echo.
echo [2/3] .gitignore kontrol ediliyor...

if not exist ".gitignore" (
    echo [BİLGİ] .gitignore oluşturuluyor...
    (
        echo # dependencies
        echo /node_modules
        echo /.pnp
        echo .pnp.js
        echo.
        echo # testing
        echo /coverage
        echo.
        echo # next.js
        echo /.next/
        echo /out/
        echo.
        echo # production
        echo /build
        echo.
        echo # misc
        echo .DS_Store
        echo *.pem
        echo.
        echo # debug
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # local env files
        echo .env*.local
        echo .env
        echo.
        echo # vercel
        echo .vercel
        echo.
        echo # typescript
        echo *.tsbuildinfo
        echo next-env.d.ts
    ) > .gitignore
    echo [✓] .gitignore oluşturuldu!
) else (
    echo [✓] .gitignore zaten mevcut.
)

echo.
echo [3/3] Dosyalar ekleniyor...
git add .

if %errorlevel%==0 (
    echo [✓] Dosyalar eklendi!
    echo.
    echo ========================================
    echo    ✓ HAZIRLIK TAMAMLANDI!
    echo ========================================
    echo.
    echo Şimdi yapmanız gerekenler:
    echo.
    echo 1. GitHub'da yeni bir repository oluşturun:
    echo    https://github.com/new
    echo.
    echo 2. Repository adı: cypher-hero-app (veya istediğiniz isim)
    echo.
    echo 3. Aşağıdaki komutları çalıştırın:
    echo.
    echo    git commit -m "Initial commit for Vercel deploy"
    echo    git branch -M main
    echo    git remote add origin https://github.com/KULLANICIADI/REPO-ADI.git
    echo    git push -u origin main
    echo.
    echo 4. Vercel Dashboard'da:
    echo    - Add New Project
    echo    - Yeni repository'yi seçin
    echo    - Root Directory: ./ (otomatik)
    echo    - Deploy!
    echo.
) else (
    echo [✗] Dosyalar eklenemedi!
)

cd ..
pause
goto EXIT

:EXISTING_REPO
cls
echo ========================================
echo    MEVCUT REPOSITORY KULLANIMI
echo ========================================
echo.
echo Vercel Dashboard'da:
echo.
echo 1. Settings → General
echo 2. "Root Directory" alanını bulun
echo 3. "cypher-hero-app" yazın
echo 4. Save
echo 5. Redeploy yapın
echo.
echo Eğer "Root Directory" seçeneği yoksa:
echo - Projeyi silin
echo - Yeni proje oluştururken bu seçenek görünebilir
echo.
pause
goto EXIT

:EXIT
exit

