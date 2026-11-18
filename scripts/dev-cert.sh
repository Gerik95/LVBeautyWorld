#!/bin/sh
# Self-signed certificate for `npm run dev`, like @vitejs/plugin-basic-ssl.
# Phones send motion (shake) only over HTTPS, so the dev server needs it.
set -e
dir=".cert"
[ -f "$dir/cert.pem" ] && [ -f "$dir/key.pem" ] && exit 0
mkdir -p "$dir"
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 825 \
  -keyout "$dir/key.pem" -out "$dir/cert.pem" \
  -subj "/CN=lvbw-dev" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" >/dev/null 2>&1
echo "Created a self-signed dev certificate in $dir/"
