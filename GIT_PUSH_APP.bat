@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:MAIN_MENU
cls
echo ========================================
echo    GIT PUSH UYGULAMASI
echo ========================================
echo.
echo [1] Yeni Repository'ye Push Yap
echo [2] Mevcut Repository'ye Push Yap
echo [3] Git Repository Başlat
echo [4] Remote Repository Bağla
echo [5] Commit Yap
echo [6] Status Kontrol Et
echo [7] Tüm İşlemleri Yap (Otomatik)
echo [8] Çıkış
echo.
set /p choice="Seçiminiz (1-8): "

if "%choice%"=="1" goto NEW_REPO_PUSH
if "%choice%"=="2" goto EXISTING_PUSH
if "%choice%"=="3" goto INIT_REPO
if "%choice%"=="4" goto ADD_REMOTE
if "%choice%"=="5" goto COMMIT
if "%choice%"=="6" goto STATUS
if "%choice%"=="7" goto AUTO_ALL
if "%choice%"=="8" goto EXIT
goto MAIN_MENU

:NEW_REPO_PUSH
cls
echo ========================================
echo    YENİ REPOSITORY'YE PUSH
echo ========================================
echo.

REM Git repository kontrolü
if not exist ".git" (
    echo [1/5] Git repository başlatılıyor...
    git init
    if !errorlevel! neq 0 (
        echo [✗] Git repository başlatılamadı!
        pause
        goto MAIN_MENU
    )
    echo [✓] Git repository başlatıldı!
) else (
    echo [1/5] Git repository zaten mevcut.
)

echo.
echo [2/5] Dosyalar ekleniyor...
git add .

if !errorlevel! neq 0 (
    echo [✗] Dosyalar eklenemedi!
    pause
    goto MAIN_MENU
)
echo [✓] Dosyalar eklendi!

echo.
echo [3/5] Commit yapılıyor...
set /p commit_msg="Commit mesajı (Enter = otomatik): "

if "!commit_msg!"=="" (
    set commit_msg=Initial commit: %date% %time%
)

git commit -m "!commit_msg!"

if !errorlevel! neq 0 (
    echo [!] Commit yapılamadı (değişiklik yok olabilir).
) else (
    echo [✓] Commit yapıldı!
)

echo.
echo [4/5] Remote repository...
git remote -v | findstr /C:"origin" >nul
if !errorlevel! neq 0 (
    set /p repo_url="GitHub Repository URL'sini girin: "
    
    if "!repo_url!"=="" (
        echo [✗] URL boş olamaz!
        pause
        goto MAIN_MENU
    )
    
    git remote remove origin 2>nul
    git remote add origin "!repo_url!"
    
    if !errorlevel! neq 0 (
        echo [✗] Remote repository eklenemedi!
        pause
        goto MAIN_MENU
    )
    echo [✓] Remote repository eklendi!
) else (
    echo [✓] Remote repository zaten bağlı.
    git remote -v
)

echo.
echo [5/5] Branch ayarlanıyor ve push yapılıyor...
git branch -M main 2>nul
echo [✓] Branch 'main' olarak ayarlandı!

echo.
echo GitHub'a push yapılıyor...
git push -u origin main

if !errorlevel!==0 (
    echo.
    echo ========================================
    echo    ✓ BAŞARILI! PUSH TAMAMLANDI
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
) else (
    echo.
    echo ========================================
    echo    ✗ PUSH YAPILAMADI
    echo ========================================
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı kontrol edin
    echo - Manuel push deneyin: git push -u origin main
)

pause
goto MAIN_MENU

:EXISTING_PUSH
cls
echo ========================================
echo    MEVCUT REPOSITORY'YE PUSH
echo ========================================
echo.

if not exist ".git" (
    echo [✗] Git repository bulunamadı!
    pause
    goto MAIN_MENU
)

REM Değişiklikleri kontrol et
git status --short | findstr /V "^$" >nul
if !errorlevel!==0 (
    echo [UYARI] Commit edilmemiş değişiklikler var!
    echo.
    set /p commit_choice="Commit yapmak ister misiniz? (E/H): "
    
    if /i "!commit_choice!"=="E" (
        set /p commit_msg="Commit mesajı: "
        if "!commit_msg!"=="" set commit_msg=Update: %date%
        
        git add .
        git commit -m "!commit_msg!"
        
        if !errorlevel!==0 (
            echo [✓] Commit yapıldı!
        )
    )
)

REM Mevcut branch
git branch --show-current > temp_branch.txt 2>nul
set /p current_branch=<temp_branch.txt
del temp_branch.txt 2>nul

if "!current_branch!"=="" set current_branch=main

echo.
echo Branch: !current_branch!
echo Push yapılıyor...
git push origin !current_branch!

if !errorlevel!==0 (
    echo [✓] Push başarılı!
) else (
    echo [✗] Push yapılamadı!
    echo.
    echo İlk push için: git push -u origin !current_branch!
)

pause
goto MAIN_MENU

:INIT_REPO
cls
echo ========================================
echo    GIT REPOSITORY BAŞLAT
echo ========================================
echo.

if exist ".git" (
    echo [UYARI] Git repository zaten mevcut!
    pause
    goto MAIN_MENU
)

git init
if !errorlevel!==0 (
    echo [✓] Git repository başlatıldı!
) else (
    echo [✗] Git repository başlatılamadı!
)

pause
goto MAIN_MENU

:ADD_REMOTE
cls
echo ========================================
echo    REMOTE REPOSITORY BAĞLA
echo ========================================
echo.

if not exist ".git" (
    echo [✗] Önce Git repository başlatmalısınız!
    pause
    goto MAIN_MENU
)

git remote -v
echo.

set /p repo_url="GitHub Repository URL'sini girin: "

if "!repo_url!"=="" (
    echo [✗] URL boş olamaz!
    pause
    goto MAIN_MENU
)

git remote remove origin 2>nul
git remote add origin "!repo_url!"

if !errorlevel!==0 (
    echo [✓] Remote repository bağlandı!
    echo.
    git remote -v
) else (
    echo [✗] Remote repository bağlanamadı!
)

pause
goto MAIN_MENU

:COMMIT
cls
echo ========================================
echo    COMMIT YAP
echo ========================================
echo.

if not exist ".git" (
    echo [✗] Git repository bulunamadı!
    pause
    goto MAIN_MENU
)

echo Mevcut değişiklikler:
git status --short
echo.

set /p commit_msg="Commit mesajı: "

if "!commit_msg!"=="" (
    echo [✗] Commit mesajı boş olamaz!
    pause
    goto MAIN_MENU
)

git add .
git commit -m "!commit_msg!"

if !errorlevel!==0 (
    echo [✓] Commit yapıldı!
) else (
    echo [✗] Commit yapılamadı!
)

pause
goto MAIN_MENU

:STATUS
cls
echo ========================================
echo    GIT STATUS
echo ========================================
echo.

if not exist ".git" (
    echo [✗] Git repository bulunamadı!
    pause
    goto MAIN_MENU
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

pause
goto MAIN_MENU

:AUTO_ALL
cls
echo ========================================
echo    TÜM İŞLEMLERİ OTOMATIK YAP
echo ========================================
echo.

REM 1. Git Init
if not exist ".git" (
    echo [1/4] Git repository başlatılıyor...
    git init
    if !errorlevel! neq 0 (
        echo [✗] Git repository başlatılamadı!
        pause
        goto MAIN_MENU
    )
    echo [✓] Git repository başlatıldı!
) else (
    echo [1/4] Git repository zaten mevcut.
)

REM 2. Remote Add
git remote -v | findstr /C:"origin" >nul
if !errorlevel! neq 0 (
    echo.
    echo [2/4] Remote repository bağlanıyor...
    set /p repo_url="GitHub Repository URL'sini girin: "
    
    if "!repo_url!"=="" (
        echo [✗] URL boş olamaz!
        pause
        goto MAIN_MENU
    )
    
    git remote add origin "!repo_url!"
    if !errorlevel! neq 0 (
        echo [✗] Remote repository bağlanamadı!
        pause
        goto MAIN_MENU
    )
    echo [✓] Remote repository bağlandı!
) else (
    echo [2/4] Remote repository zaten bağlı.
)

REM 3. Add ve Commit
echo.
echo [3/4] Dosyalar ekleniyor ve commit yapılıyor...
git add .

if !errorlevel!==0 (
    set commit_msg=Initial commit: %date% %time%
    git commit -m "!commit_msg!"
    
    if !errorlevel!==0 (
        echo [✓] Commit yapıldı!
    ) else (
        echo [!] Commit yapılamadı (değişiklik yok olabilir).
    )
) else (
    echo [✗] Dosyalar eklenemedi!
    pause
    goto MAIN_MENU
)

REM 4. Push
echo.
echo [4/4] GitHub'a push yapılıyor...
git branch -M main 2>nul
git push -u origin main

if !errorlevel!==0 (
    echo.
    echo ========================================
    echo    ✓ TÜM İŞLEMLER TAMAMLANDI!
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
) else (
    echo.
    echo ========================================
    echo    ✗ PUSH YAPILAMADI
    echo ========================================
    echo.
    echo Olası nedenler:
    echo - GitHub kimlik doğrulaması gerekebilir
    echo - Branch adı kontrol edin
)

pause
goto MAIN_MENU

:EXIT
cls
echo Git Push Uygulamasından çıkılıyor...
timeout /t 1 >nul
exit

