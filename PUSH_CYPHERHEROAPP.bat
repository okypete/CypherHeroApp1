@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "TARGET_DIR=CypherHeroApp"

:MENU
cls
echo ========================================
echo    CYPHER HERO APP - GIT PUSH ARACI
echo ========================================
echo.
echo [1] Hızlı Push (Tüm İşlemler Otomatik)
echo [2] Git Repository Başlat
echo [3] Remote Repository Bağla
echo [4] Dosyaları Ekle ve Commit Yap
echo [5] Push Yap (GitHub'a Yükle)
echo [6] Status Kontrol Et
echo [7] Remote Repository Bilgisi
echo [8] Çıkış
echo.
set /p choice="Seçiminiz (1-8): "

if "%choice%"=="1" goto QUICK_PUSH
if "%choice%"=="2" goto INIT
if "%choice%"=="3" goto REMOTE
if "%choice%"=="4" goto ADD_COMMIT
if "%choice%"=="5" goto PUSH
if "%choice%"=="6" goto STATUS
if "%choice%"=="7" goto REMOTE_INFO
if "%choice%"=="8" goto EXIT
goto MENU

:QUICK_PUSH
cls
echo ========================================
echo    HIZLI PUSH (OTOMATIK)
echo ========================================
echo.

REM Klasör kontrolü
if not exist "%TARGET_DIR%" (
    echo [✗] HATA: CypherHeroApp klasörü bulunamadı!
    echo Mevcut dizin: %CD%
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

REM Git repository kontrolü
if not exist ".git" (
    echo [1/5] Git repository başlatılıyor...
    git init
    if !errorlevel! neq 0 (
        echo [✗] Hata: Git repository başlatılamadı!
        pause
        goto MENU
    )
    echo [✓] Git repository başlatıldı!
) else (
    echo [1/5] Git repository mevcut.
)

echo.

REM Remote kontrolü
git remote -v >nul 2>&1
if !errorlevel! neq 0 (
    echo [2/5] Remote repository bağlanıyor...
    set /p repo_url="GitHub Repository URL'sini girin: "
    
    if "!repo_url!"=="" (
        echo [✗] URL boş olamaz!
        pause
        goto MENU
    )
    
    git remote add origin "!repo_url!"
    if !errorlevel! neq 0 (
        echo [✗] Hata: Remote repository bağlanamadı!
        pause
        goto MENU
    )
    echo [✓] Remote repository bağlandı!
) else (
    echo [2/5] Remote repository mevcut.
    git remote -v
)

echo.

REM Dosyaları ekle
echo [3/5] Tüm dosyalar ekleniyor...
git add .
if !errorlevel! neq 0 (
    echo [✗] Hata: Dosyalar eklenemedi!
    pause
    goto MENU
)
echo [✓] Dosyalar eklendi!

echo.

REM Commit
echo [4/5] Commit yapılıyor...
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set mydate=%%d-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set mytime=%%a:%%b
set commit_msg=Update CypherHeroApp: !mydate! !mytime!

git commit -m "!commit_msg!"
if !errorlevel! neq 0 (
    echo [!] Commit yapılamadı (değişiklik yok olabilir).
) else (
    echo [✓] Commit yapıldı!
)

echo.

REM Branch bul
git branch --show-current > temp_branch.txt 2>nul
set /p current_branch=<temp_branch.txt
del temp_branch.txt 2>nul

if "!current_branch!"=="" (
    set current_branch=main
)

REM Push
echo [5/5] GitHub'a push yapılıyor...
echo Branch: !current_branch!
echo.

git push -u origin !current_branch!

if !errorlevel! neq 0 (
    echo.
    echo [✗] Hata: Push yapılamadı!
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı yanlış olabilir
    echo - İnternet bağlantısı kontrol edin
    echo.
) else (
    echo.
    echo ========================================
    echo    ✓ BAŞARILI!
    echo ========================================
    echo.
    echo CypherHeroApp başarıyla GitHub'a yüklendi!
    echo.
    echo Repository URL:
    git remote get-url origin
    echo Branch: !current_branch!
    echo.
)

cd /d "%~dp0"
pause
goto MENU

:INIT
cls
echo ========================================
echo    GIT REPOSITORY BAŞLAT
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

if exist ".git" (
    echo [UYARI] Git repository zaten başlatılmış!
    pause
    goto MENU
)

git init
if !errorlevel!==0 (
    echo [✓] Git repository başarıyla başlatıldı!
) else (
    echo [✗] Hata: Git repository başlatılamadı!
)

cd /d "%~dp0"
pause
goto MENU

:REMOTE
cls
echo ========================================
echo    REMOTE REPOSITORY BAĞLA
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

if not exist ".git" (
    echo [UYARI] Önce Git repository başlatmalısınız!
    pause
    goto MENU
)

echo Mevcut remote repository'ler:
git remote -v
echo.

set /p repo_url="GitHub Repository URL'sini girin: "

if "!repo_url!"=="" (
    echo [✗] URL boş olamaz!
    pause
    goto MENU
)

git remote remove origin 2>nul
git remote add origin "!repo_url!"

if !errorlevel!==0 (
    echo [✓] Remote repository başarıyla bağlandı!
    echo.
    git remote -v
) else (
    echo [✗] Hata: Remote repository bağlanamadı!
)

cd /d "%~dp0"
pause
goto MENU

:ADD_COMMIT
cls
echo ========================================
echo    DOSYALARI EKLE VE COMMIT YAP
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

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

if !errorlevel!==0 (
    echo [✓] Dosyalar eklendi!
    echo.
    echo Commit yapılıyor...
    git commit -m "!commit_msg!"
    
    if !errorlevel!==0 (
        echo [✓] Commit başarıyla yapıldı!
    ) else (
        echo [✗] Hata: Commit yapılamadı!
        echo [BİLGİ] Değişiklik yoksa commit yapılamaz.
    )
) else (
    echo [✗] Hata: Dosyalar eklenemedi!
)

cd /d "%~dp0"
pause
goto MENU

:PUSH
cls
echo ========================================
echo    PUSH YAP (GITHUB'A YÜKLE)
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

if not exist ".git" (
    echo [UYARI] Önce Git repository başlatmalısınız!
    pause
    goto MENU
)

git remote -v | findstr /C:"origin" >nul
if !errorlevel! neq 0 (
    echo [UYARI] Önce remote repository bağlamalısınız!
    pause
    goto MENU
)

echo Mevcut branch:
git branch --show-current
echo.

set /p branch="Push yapılacak branch (Enter = mevcut branch): "

if "!branch!"=="" (
    git branch --show-current > temp_branch.txt
    set /p branch=<temp_branch.txt
    del temp_branch.txt
    if "!branch!"=="" set branch=main
)

echo.
echo GitHub'a push yapılıyor...
git push -u origin !branch!

if !errorlevel!==0 (
    echo [✓] Push başarıyla tamamlandı!
    echo.
    echo Repository URL:
    git remote get-url origin
) else (
    echo [✗] Hata: Push yapılamadı!
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı yanlış olabilir
    echo - İnternet bağlantısı kontrol edin
)

cd /d "%~dp0"
pause
goto MENU

:STATUS
cls
echo ========================================
echo    GIT STATUS KONTROLÜ
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

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
git log -1 --pretty=format:"%h - %an, %ar : %s" 2>nul
echo.
echo.
echo === DEĞİŞİKLİKLER ===
echo.
git status
echo.

cd /d "%~dp0"
pause
goto MENU

:REMOTE_INFO
cls
echo ========================================
echo    REMOTE REPOSITORY BİLGİSİ
echo ========================================
echo.

if not exist "%TARGET_DIR%" (
    echo [✗] CypherHeroApp klasörü bulunamadı!
    pause
    goto MENU
)

cd /d "%TARGET_DIR%"

if not exist ".git" (
    echo [UYARI] Git repository başlatılmamış!
    pause
    goto MENU
)

git remote -v
if !errorlevel! neq 0 (
    echo [UYARI] Remote repository bağlı değil!
)

cd /d "%~dp0"
pause
goto MENU

:EXIT
cls
echo Git push aracından çıkılıyor...
timeout /t 1 >nul
exit
