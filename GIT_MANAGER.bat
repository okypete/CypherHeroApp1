@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:MENU
cls
echo ========================================
echo    CYPHER HERO - GIT YÖNETİM ARACI
echo ========================================
echo.
echo [1] Git Repository Başlat
echo [2] Remote Repository Bağla
echo [3] Tüm Dosyaları Ekle ve Commit Yap
echo [4] Push Yap (GitHub'a Yükle)
echo [5] Status Kontrol Et
echo [6] Tüm İşlemleri Yap (Baştan Sona)
echo [7] Çıkış
echo.
set /p choice="Seçiminiz (1-7): "

if "%choice%"=="1" goto INIT
if "%choice%"=="2" goto REMOTE
if "%choice%"=="3" goto ADD_COMMIT
if "%choice%"=="4" goto PUSH
if "%choice%"=="5" goto STATUS
if "%choice%"=="6" goto ALL
if "%choice%"=="7" goto EXIT
goto MENU

:INIT
cls
echo ========================================
echo    GIT REPOSITORY BAŞLATILIYOR...
echo ========================================
echo.

if exist ".git" (
    echo [UYARI] Git repository zaten başlatılmış!
    pause
    goto MENU
)

git init
if %errorlevel%==0 (
    echo [✓] Git repository başarıyla başlatıldı!
) else (
    echo [✗] Hata: Git repository başlatılamadı!
)
echo.
pause
goto MENU

:REMOTE
cls
echo ========================================
echo    REMOTE REPOSITORY BAĞLAMA
echo ========================================
echo.

git remote -v
echo.

set /p repo_url="GitHub Repository URL'sini girin (örn: https://github.com/kullaniciadi/repo.git): "

if "!repo_url!"=="" (
    echo [✗] URL boş olamaz!
    pause
    goto MENU
)

git remote remove origin 2>nul
git remote add origin "!repo_url!"

if %errorlevel%==0 (
    echo [✓] Remote repository başarıyla bağlandı!
    echo.
    echo Bağlı repository:
    git remote -v
) else (
    echo [✗] Hata: Remote repository bağlanamadı!
)
echo.
pause
goto MENU

:ADD_COMMIT
cls
echo ========================================
echo    DOSYALARI EKLE VE COMMIT YAP
echo ========================================
echo.

if not exist ".git" (
    echo [UYARI] Önce Git repository başlatmalısınız!
    pause
    goto MENU
)

echo Mevcut değişiklikler:
git status --short
echo.

set /p commit_msg="Commit mesajını girin: "

if "!commit_msg!"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set mydate=%%d-%%b-%%c
    set commit_msg=Update: !mydate!
)

echo.
echo Dosyalar ekleniyor...
git add .

if %errorlevel%==0 (
    echo [✓] Dosyalar başarıyla eklendi!
    echo.
    echo Commit yapılıyor...
    git commit -m "!commit_msg!"
    
    if %errorlevel%==0 (
        echo [✓] Commit başarıyla yapıldı!
    ) else (
        echo [✗] Hata: Commit yapılamadı!
        echo [BİLGİ] Değişiklik yoksa commit yapılamaz.
    )
) else (
    echo [✗] Hata: Dosyalar eklenemedi!
)
echo.
pause
goto MENU

:PUSH
cls
echo ========================================
echo    PUSH YAP (GITHUB'A YÜKLE)
echo ========================================
echo.

if not exist ".git" (
    echo [UYARI] Önce Git repository başlatmalısınız!
    pause
    goto MENU
)

git remote -v | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    echo [UYARI] Önce remote repository bağlamalısınız!
    pause
    goto MENU
)

echo Mevcut branch:
git branch --show-current
echo.

set /p branch="Push yapılacak branch (Enter = main/master): "
if "!branch!"=="" (
    git branch --show-current > temp_branch.txt
    set /p branch=<temp_branch.txt
    del temp_branch.txt
    if "!branch!"=="" set branch=main
)

echo.
echo GitHub'a push yapılıyor...
git push -u origin !branch!

if %errorlevel%==0 (
    echo [✓] Push başarıyla tamamlandı!
    echo.
    echo Repository URL'nizi kontrol edin:
    git remote get-url origin
) else (
    echo [✗] Hata: Push yapılamadı!
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı yanlış olabilir
    echo - İnternet bağlantısı kontrol edin
)
echo.
pause
goto MENU

:STATUS
cls
echo ========================================
echo    GIT STATUS KONTROLÜ
echo ========================================
echo.

if not exist ".git" (
    echo [UYARI] Git repository başlatılmamış!
    pause
    goto MENU
)

echo === REPOSITORY BİLGİLERİ ===
echo.
git remote -v
echo.
echo === BRANCH BİLGİSİ ===
echo.
git branch --show-current
echo.
echo === SON COMMIT ===
echo.
git log -1 --pretty=format:"%h - %an, %ar : %s"
echo.
echo.
echo === DEĞİŞİKLİKLER ===
echo.
git status
echo.
pause
goto MENU

:ALL
cls
echo ========================================
echo    TÜM İŞLEMLERİ YAP
echo ========================================
echo.

REM 1. Git Init
if not exist ".git" (
    echo [1/4] Git repository başlatılıyor...
    git init
    if %errorlevel%==0 (
        echo [✓] Git repository başlatıldı!
    ) else (
        echo [✗] Git repository başlatılamadı!
        pause
        goto MENU
    )
) else (
    echo [1/4] Git repository zaten mevcut.
)

echo.

REM 2. Remote Add
git remote -v | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    echo [2/4] Remote repository bağlanıyor...
    set /p repo_url="GitHub Repository URL'sini girin: "
    if not "!repo_url!"=="" (
        git remote add origin "!repo_url!"
        if %errorlevel%==0 (
            echo [✓] Remote repository bağlandı!
        ) else (
            echo [✗] Remote repository bağlanamadı!
            pause
            goto MENU
        )
    ) else (
        echo [✗] URL boş olamaz!
        pause
        goto MENU
    )
) else (
    echo [2/4] Remote repository zaten bağlı.
    git remote -v
)

echo.

REM 3. Add ve Commit
echo [3/4] Dosyalar ekleniyor ve commit yapılıyor...
git add .

if %errorlevel%==0 (
    set commit_msg=Initial commit: Cypher Hero Game
    git commit -m "!commit_msg!"
    
    if %errorlevel%==0 (
        echo [✓] Commit yapıldı!
    ) else (
        echo [!] Commit yapılamadı (değişiklik yok olabilir).
    )
) else (
    echo [✗] Dosyalar eklenemedi!
    pause
    goto MENU
)

echo.

REM 4. Push
echo [4/4] GitHub'a push yapılıyor...
git branch --show-current > temp_branch.txt
set /p current_branch=<temp_branch.txt
del temp_branch.txt

if "!current_branch!"=="" set current_branch=main

git push -u origin !current_branch!

if %errorlevel%==0 (
    echo [✓] Push başarıyla tamamlandı!
    echo.
    echo ========================================
    echo    TÜM İŞLEMLER TAMAMLANDI!
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
) else (
    echo [✗] Push yapılamadı!
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı kontrol edin
    echo - Manuel olarak push yapmayı deneyin
)

echo.
pause
goto MENU

:EXIT
cls
echo Git yönetim aracından çıkılıyor...
timeout /t 1 >nul
exit

