#!/bin/bash
set -e

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║     BUBFILM - AUTO INSTALL SCRIPT     ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────
# STEP 1: Load NVM (kalau udah pernah install)
# ─────────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# ─────────────────────────────────────────
# STEP 2: Install Node.js v20 via NVM (kalau belum ada)
# ─────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo "📦 [1/6] Menginstall Node.js v20 LTS via NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load NVM yang baru diinstall
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    nvm install 20
    nvm use 20
    nvm alias default 20
    echo "✅ Node.js $(node -v) berhasil diinstall!"
else
    echo "✅ [1/6] Node.js $(node -v) sudah ada, skip."
fi

# ─────────────────────────────────────────
# STEP 3: Bikin file .env.local (WAJIB sebelum build)
# ─────────────────────────────────────────
echo ""
echo "📝 [2/6] Membuat file .env.local..."

if [ ! -f .env.local ]; then
    cat << 'EOF' > .env.local
NEXT_PUBLIC_TMDB_API_KEY=aa319f98646bee683e90a75436fbae11
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
NEXT_PUBLIC_VIDEASY_BASE=https://player.videasy.net
NEXT_PUBLIC_SPORTS_API_URL=https://api.watchfooty.st

# Admin Panel
ADMIN_PATH=ketua
NEXT_PUBLIC_ADMIN_PATH=ketua
ADMIN_USERNAME=admin
ADMIN_PASSWORD=bubfilm2025

# Set ke "true" hanya jika pakai HTTPS/SSL
COOKIE_SECURE=false
EOF
    echo "✅ .env.local berhasil dibuat!"
else
    echo "✅ .env.local sudah ada, skip."
fi

# ─────────────────────────────────────────
# STEP 4: Buat folder data (penting buat config admin)
# ─────────────────────────────────────────
echo ""
echo "📁 [3/6] Memastikan folder data tersedia..."
mkdir -p data
echo "✅ Folder data siap."

# ─────────────────────────────────────────
# STEP 5: Install dependencies
# ─────────────────────────────────────────
echo ""
echo "📦 [4/6] Menginstall dependencies (npm install)..."
npm install
echo "✅ Dependencies berhasil diinstall!"

# ─────────────────────────────────────────
# STEP 6: Build Next.js (dengan batas RAM 768MB buat VPS 1GB)
# ─────────────────────────────────────────
echo ""
echo "🔨 [5/6] Nge-build aplikasi (sabar ini agak lama)..."
export NODE_OPTIONS="--max-old-space-size=768"
npm run build
echo "✅ Build selesai!"

# ─────────────────────────────────────────
# STEP 7: Jalankan di PM2 Port 3000
# ─────────────────────────────────────────
echo ""
echo "🚀 [6/6] Menjalankan server di PM2 Port 3000..."

# Install PM2 kalau belum ada
if ! command -v pm2 &> /dev/null; then
    echo "⚙️  Menginstall PM2..."
    npm install -g pm2
fi

# Stop dan hapus instance lama kalau ada
pm2 delete bubfilm 2>/dev/null || true

# Jalankan di port 3000
NODE_PATH="$(which node)"
PM2_NODE_OPTIONS="--max-old-space-size=512"
PORT=3000 pm2 start npm \
    --name "bubfilm" \
    --node-args="--max-old-space-size=512" \
    -- start

# Tunggu 3 detik biar server kebuka
sleep 3

# ─────────────────────────────────────────
# STEP 8: Setup auto-start saat VPS reboot
# ─────────────────────────────────────────
echo ""
echo "💾 Menyimpan state PM2 (auto-start saat VPS reboot)..."
pm2 save

# Tambahkan PATH NVM ke bashrc biar pm2 bisa dipanggil langsung
grep -qxF 'export NVM_DIR="$HOME/.nvm"' ~/.bashrc || echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
grep -qxF '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' ~/.bashrc || echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║          SELESAI! WEB NYALA!          ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "🌐 Web berjalan di:    http://localhost:3000"
echo ""
echo "📌 Perintah penting:"
echo "   pm2 logs bubfilm    → lihat log real-time"
echo "   pm2 monit           → monitor RAM & CPU"
echo "   pm2 restart bubfilm → restart server"
echo "   pm2 stop bubfilm    → stop server"
echo ""
echo "⚡ PENTING: Ketik perintah di bawah ini agar 'pm2' bisa langsung dipakai:"
echo "   source ~/.bashrc"
echo ""
