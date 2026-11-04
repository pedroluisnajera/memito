@echo off
cd /d "%~dp0"
echo.
echo ===== Build Memito.apk in Expo's cloud =====
echo Run setup.bat first if you haven't. You need a free account at https://expo.dev/signup
echo.
if not exist node_modules (
  echo Please run setup.bat first.
  pause
  exit /b 1
)
call npx eas-cli@latest login
if errorlevel 1 goto fail
echo.
echo Questions you may see:  "Create an EAS project?" = Y   "Generate a new Android Keystore?" = Y
echo.
call npx eas-cli@latest build -p android --profile preview
if errorlevel 1 goto fail
echo.
echo ===== Done! Open the link above on your phone (or scan the QR) to download Memito.apk =====
pause
exit /b 0

:fail
echo.
echo Something went wrong. Copy the red text above and send it to Claude.
pause
exit /b 1
