@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cls
echo ========================================
echo    CYPHER HERO - HIZLI GIT KURULUMU
echo ========================================
echo.
echo Bu script tüm Git işlemlerini otomatik yapar:
echo 1. Git repository başlatır
echo 2. Dosyaları ekler
echo 3. Commit yapar
echo 4. GitHub'a push yapar
echo.
echo [NOT] GitHub repository URL'sine ihtiyacınız var!
echo.
set /p continue="Devam etmek istiyor musunuz? (E/H): "

if /i not "!continue!"=="E" (
    echo İşlem iptal edildi.
    timeout /t 2 >nul
    exit
)

echo.
echo ========================================
echo    ADIM 1: GIT REPOSITORY BAŞLATMA
echo ========================================
echo.

if not exist ".git" (
    git init
    if %errorlevel%==0 (
        echo [✓] Git repository başlatıldı!
    ) else (
        echo [✗] Hata: Git başlatılamadı!
        pause
        exit
    )
) else (
    echo [✓] Git repository zaten mevcut.
)

echo.
echo ========================================
echo    ADIM 2: REMOTE REPOSITORY BAĞLAMA
echo ========================================
echo.

git remote -v | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    set /p repo_url="GitHub Repository URL'sini girin (örn: https://github.com/kullaniciadi/repo.git): "
    
    if "!repo_url!"=="" (
        echo [✗] URL boş olamaz!
        pause
        exit
    )
    
    git remote add origin "!repo_url!"
    if %errorlevel%==0 (
        echo [✓] Remote repository bağlandı!
    ) else (
        echo [✗] Hata: Remote repository bağlanamadı!
        pause
        exit
    )
) else (
    echo [✓] Remote repository zaten bağlı.
    git remote -v
)

echo.
echo ========================================
echo    ADIM 3: DOSYALARI EKLE VE COMMIT
echo ========================================
echo.

git add .
if %errorlevel%==0 (
    echo [✓] Dosyalar eklendi!
    
    for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set mydate=%%d-%%b-%%c
    set commit_msg=Initial commit: Cypher Hero Game - !mydate!
    git commit -m "!commit_msg!"
    
    if %errorlevel%==0 (
        echo [✓] Commit yapıldı!
    ) else (
        echo [!] Commit yapılamadı (değişiklik yok olabilir).
    )
) else (
    echo [✗] Hata: Dosyalar eklenemedi!
    pause
    exit
)

echo.
echo ========================================
echo    ADIM 4: GITHUB'A PUSH YAPMA
echo ========================================
echo.

git branch --show-current > temp_branch.txt 2>nul
set /p current_branch=<temp_branch.txt
del temp_branch.txt 2>nul

if "!current_branch!"=="" set current_branch=main

echo Branch: !current_branch!
echo.

REM GitHub'da branch var mı kontrol et
git ls-remote --heads origin !current_branch! 2>nul | findstr /C:"!current_branch!" >nul
if %errorlevel% neq 0 (
    echo [BİLGİ] İlk push yapılıyor (branch GitHub'da yok)...
) else (
    echo [BİLGİ] Mevcut branch'e push yapılıyor...
)

echo.
echo GitHub'a push yapılıyor...
echo [NOT] İlk kez push yapıyorsanız GitHub kimlik doğrulaması gerekebilir.
echo.

REM Önce normal push dene
git push -u origin !current_branch! 2>nul

REM Eğer başarısız olursa, branch adını kontrol et
if %errorlevel% neq 0 (
    echo.
    echo [UYARI] Push başarısız! Branch uyumsuzluğu olabilir.
    echo.
    
    REM GitHub'da main var mı kontrol et
    git ls-remote --heads origin main 2>nul | findstr /C:"main" >nul
    if %errorlevel%==0 (
        echo [BİLGİ] GitHub'da 'main' branch bulundu, ona push yapılıyor...
        git push -u origin main
    ) else (
        REM GitHub'da master var mı kontrol et
        git ls-remote --heads origin master 2>nul | findstr /C:"master" >nul
        if %errorlevel%==0 (
            echo [BİLGİ] GitHub'da 'master' branch bulundu, ona push yapılıyor...
            git push -u origin master
        ) else (
            REM İlk push, mevcut branch'i kullan
            echo [BİLGİ] İlk push yapılıyor...
            git push -u origin !current_branch!
        )
    )
)

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo    ✓ BAŞARILI! TÜM İŞLEMLER TAMAMLANDI
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
    echo.
    echo GitHub'da repository'nizi kontrol edebilirsiniz!
) else (
    echo.
    echo ========================================
    echo    ✗ PUSH YAPILAMADI
    echo ========================================
    echo.
    echo Olası nedenler:
    echo 1. GitHub kimlik doğrulaması gerekebilir
    echo    - GitHub Desktop kullanın VEYA
    echo    - Personal Access Token oluşturun
    echo.
    echo 2. Branch adı kontrol edin
    echo    - Mevcut branch: !current_branch!
    echo    - GitHub'da 'main' veya 'master' branch olmalı
    echo.
    echo 3. Manuel push deneyin:
    echo    git push -u origin !current_branch!
)

echo.
pause

