@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cls
echo ========================================
echo    PUSH SORUNU GİDERME ARACI
echo ========================================
echo.

REM Git repository kontrolü
if not exist ".git" (
    echo [✗] Git repository bulunamadı!
    echo.
    echo Önce Git repository başlatmalısınız:
    echo   git init
    pause
    exit
)

echo [1/6] Git durumu kontrol ediliyor...
echo.

REM Mevcut branch
git branch --show-current > temp_branch.txt 2>nul
set /p current_branch=<temp_branch.txt
del temp_branch.txt 2>nul

if "!current_branch!"=="" (
    echo [UYARI] Branch bulunamadı, 'main' oluşturuluyor...
    git checkout -b main 2>nul
    set current_branch=main
)

echo Mevcut branch: !current_branch!
echo.

REM Remote kontrolü
echo [2/6] Remote repository kontrol ediliyor...
echo.

git remote -v | findstr /C:"origin" >nul
if %errorlevel% neq 0 (
    echo [✗] Remote repository bağlı değil!
    echo.
    set /p repo_url="GitHub Repository URL'sini girin: "
    
    if "!repo_url!"=="" (
        echo [✗] URL boş olamaz!
        pause
        exit
    )
    
    git remote add origin "!repo_url!"
    if %errorlevel%==0 (
        echo [✓] Remote repository bağlandı!
    ) else (
        echo [✗] Remote repository bağlanamadı!
        pause
        exit
    )
) else (
    echo [✓] Remote repository bağlı:
    git remote -v
)

echo.
echo [3/6] Commit durumu kontrol ediliyor...
echo.

git status --short | findstr /V "^$" >nul
if %errorlevel%==0 (
    echo [UYARI] Commit edilmemiş değişiklikler var!
    echo.
    set /p commit_choice="Değişiklikleri commit etmek ister misiniz? (E/H): "
    
    if /i "!commit_choice!"=="E" (
        set /p commit_msg="Commit mesajı (Enter = otomatik): "
        if "!commit_msg!"=="" (
            REM Tarihi temiz formatla al
            for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
            if "!mydate!"=="" (
                for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set mydate=%%d-%%b-%%c
            )
            set commit_msg=Update: !mydate!
        )
        
        git add .
        REM Commit mesajını her zaman tırnak içine al
        git commit -m "!commit_msg!"
        
        if %errorlevel%==0 (
            echo [✓] Commit yapıldı!
        ) else (
            echo [✗] Commit yapılamadı!
        )
    )
) else (
    echo [✓] Tüm değişiklikler commit edilmiş.
)

echo.
echo [4/6] Branch uyumluluğu kontrol ediliyor...
echo.

REM GitHub'da hangi branch var kontrol et
git ls-remote --heads origin 2>nul | findstr /C:"main" >nul
set main_exists=%errorlevel%

if !main_exists!==0 (
    echo [✓] GitHub'da 'main' branch mevcut.
    set target_branch=main
) else (
    echo [!] GitHub'da 'main' branch bulunamadı (ilk push olabilir).
    set target_branch=main
)

echo.
echo [5/6] Push stratejisi belirleniyor...
echo.

REM Eğer branch farklıysa, uyumlu hale getir
if not "!current_branch!"=="!target_branch!" (
    echo [UYARI] Branch uyumsuzluğu tespit edildi!
    echo   Mevcut: !current_branch!
    echo   Hedef: !target_branch!
    echo.
    set /p rename_choice="Branch'i '!target_branch!' olarak yeniden adlandırmak ister misiniz? (E/H): "
    
    if /i "!rename_choice!"=="E" (
        git branch -m !target_branch!
        set current_branch=!target_branch!
        echo [✓] Branch yeniden adlandırıldı!
    )
)

echo.
echo [6/6] Push yapılıyor...
echo.

echo Branch: !current_branch!
echo Remote: origin
echo.

REM İlk push için özel komut
git ls-remote --heads origin !current_branch! 2>nul | findstr /C:"!current_branch!" >nul
if %errorlevel% neq 0 (
    echo [BİLGİ] İlk push yapılıyor (branch GitHub'da yok)...
    echo.
    git push -u origin !current_branch!
) else (
    echo [BİLGİ] Mevcut branch'e push yapılıyor...
    echo.
    git push origin !current_branch!
)

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo    ✓ BAŞARILI! PUSH TAMAMLANDI
    echo ========================================
    echo.
    echo Repository URL:
    git remote get-url origin
    echo.
    echo GitHub'da değişikliklerinizi kontrol edebilirsiniz!
) else (
    echo.
    echo ========================================
    echo    ✗ PUSH YAPILAMADI
    echo ========================================
    echo.
    echo Olası çözümler:
    echo.
    echo 1. GITHUB KİMLİK DOĞRULAMASI:
    echo    - GitHub Desktop kullanın VEYA
    echo    - Personal Access Token oluşturun:
    echo      https://github.com/settings/tokens
    echo.
    echo 2. BRANCH ADI KONTROLÜ:
    echo    Mevcut branch: !current_branch!
    echo    GitHub'da 'main' branch olmalı
    echo.
    echo 3. MANUEL PUSH DENEYİN:
    echo    git push -u origin !current_branch!
    echo.
    echo 4. FORCE PUSH (DİKKATLİ KULLANIN):
    echo    git push -u origin !current_branch! --force
    echo    [UYARI] Bu komut GitHub'daki değişiklikleri siler!
    echo.
    echo 5. SSH KULLANIN:
    echo    git remote set-url origin git@github.com:kullaniciadi/repo.git
    echo.
)

echo.
pause

