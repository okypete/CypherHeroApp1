@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cls
echo ========================================
echo    YENİ REPOSITORY'YE PUSH ARACI
echo ========================================
echo.

REM cypher-hero-app klasörüne git
cd cypher-hero-app

REM Git repository kontrolü
if not exist ".git" (
    echo [1/5] Git repository başlatılıyor...
    git init
    if %errorlevel%==0 (
        echo [✓] Git repository başlatıldı!
    ) else (
        echo [✗] Git repository başlatılamadı!
        pause
        exit
    )
) else (
    echo [1/5] Git repository zaten mevcut.
)

echo.
echo [2/5] .gitignore kontrol ediliyor...

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
echo [3/5] Dosyalar ekleniyor...
git add .

if %errorlevel%==0 (
    echo [✓] Dosyalar eklendi!
) else (
    echo [✗] Dosyalar eklenemedi!
    pause
    exit
)

echo.
echo [4/5] Commit yapılıyor...
set /p commit_msg="Commit mesajı (Enter = otomatik): "

if "!commit_msg!"=="" (
    set commit_msg=Initial commit: Cypher Hero App
)

git commit -m "!commit_msg!"

if %errorlevel%==0 (
    echo [✓] Commit yapıldı!
) else (
    echo [!] Commit yapılamadı (değişiklik yok olabilir).
)

echo.
echo [5/5] GitHub repository bilgileri...
echo.

REM Mevcut remote kontrolü
git remote -v | findstr /C:"origin" >nul
if %errorlevel%==0 (
    echo [BİLGİ] Mevcut remote repository:
    git remote -v
    echo.
    set /p update_remote="Remote repository'yi güncellemek ister misiniz? (E/H): "
    
    if /i "!update_remote!"=="E" (
        git remote remove origin
    ) else (
        echo [BİLGİ] Mevcut remote korunuyor.
        echo.
        echo Push yapmak için:
        echo   git push -u origin main
        pause
        exit
    )
)

set /p repo_url="GitHub Repository URL'sini girin (örn: https://github.com/kullaniciadi/repo.git): "

if "!repo_url!"=="" (
    echo [✗] URL boş olamaz!
    pause
    exit
)

git remote add origin "!repo_url!"

if %errorlevel%==0 (
    echo [✓] Remote repository eklendi!
) else (
    echo [✗] Remote repository eklenemedi!
    pause
    exit
)

echo.
echo [6/6] Branch ayarlanıyor ve push yapılıyor...
echo.

REM Branch'i main yap
git branch -M main

if %errorlevel%==0 (
    echo [✓] Branch 'main' olarak ayarlandı!
) else (
    echo [!] Branch zaten 'main' olabilir.
)

echo.
echo GitHub'a push yapılıyor...
echo [NOT] İlk kez push yapıyorsanız GitHub kimlik doğrulaması gerekebilir.
echo.

git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo    ✓ BAŞARILI! PUSH TAMAMLANDI
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
    echo.
    echo GitHub'da repository'nizi kontrol edebilirsiniz!
    echo.
    echo Vercel'de deploy için:
    echo 1. Vercel Dashboard → Add New Project
    echo 2. Bu repository'yi seçin
    echo 3. Root Directory: ./ (otomatik)
    echo 4. Environment Variables ekleyin:
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo 5. Deploy!
) else (
    echo.
    echo ========================================
    echo    ✗ PUSH YAPILAMADI
    echo ========================================
    echo.
    echo Olası nedenler:
    echo.
    echo 1. GITHUB KİMLİK DOĞRULAMASI:
    echo    - GitHub Desktop kullanın VEYA
    echo    - Personal Access Token oluşturun:
    echo      https://github.com/settings/tokens
    echo.
    echo 2. BRANCH ADI:
    echo    GitHub'da 'main' branch olmalı
    echo.
    echo 3. MANUEL PUSH DENEYİN:
    echo    git push -u origin main
    echo.
)

cd ..
echo.
echo ========================================
echo    Script tamamlandı!
echo ========================================
echo.
echo Kapatmak için bir tuşa basın...
pause >nul
if errorlevel 1 pause

