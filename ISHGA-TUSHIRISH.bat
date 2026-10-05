@echo off
title Kokand University
cd /d "%~dp0"
set SITE_PROFILE=university
if "%PORT%"=="" set PORT=3000
node server.js
pause
