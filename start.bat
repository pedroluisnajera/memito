@echo off
cd /d "%~dp0"
echo Starting Memito... scan the QR code with the Expo Go app on your phone.
echo (Phone and PC must be on the same Wi-Fi. Press Ctrl+C to stop.)
call npx expo start
pause
