#!/bin/sh
# Kokand University — ishga tushirish
cd "$(dirname "$0")"
SITE_PROFILE=university PORT=${PORT:-3000} node server.js
