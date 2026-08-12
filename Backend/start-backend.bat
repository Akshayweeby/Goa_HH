@echo off
cd /d "%~dp0"
set "PYTHON=C:\Users\shrad\AppData\Local\Programs\Python\Python312\python.exe"
if not exist "%PYTHON%" (
  echo Python 3.12 was not found at %PYTHON%
  pause
  exit /b 1
)
"%PYTHON%" -m pip install -r requirements.txt
"%PYTHON%" manage.py migrate
"%PYTHON%" manage.py runserver 8000
pause
