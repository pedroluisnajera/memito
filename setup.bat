@echo off
cd /d "%~dp0"
echo.
echo ===== Memito setup =====
echo This downloads the building blocks the app needs. It takes 2-5 minutes.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org and run this again.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto fail
call npx expo install expo-router react-native-screens react-native-safe-area-context expo-linking expo-constants expo-status-bar expo-notifications expo-location expo-image-picker @react-native-async-storage/async-storage @react-native-community/datetimepicker @expo/vector-icons expo-font react react-native
if errorlevel 1 goto fail
call npx expo install --fix
echo.
echo ===== Done! Now double-click start.bat =====
pause
exit /b 0

:fail
echo.
echo Something went wrong. Copy the red text above and send it to Claude.
pause
exit /b 1
