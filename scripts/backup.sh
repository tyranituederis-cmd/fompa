#!/usr/bin/env bash
# ============================================================================
# Backup database FOMPA (PostgreSQL / Supabase)
# Penggunaan:  DATABASE_URL="postgresql://..." ./scripts/backup.sh
# Otomatisasi: tambahkan ke cron, contoh setiap hari 02.00:
#   0 2 * * * cd /path/project && DATABASE_URL="postgresql://..." ./scripts/backup.sh >> backups/backup.log 2>&1
# ============================================================================
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$DIR/backups}"
STAMP="$(date +%Y%m%d_%H%M%S)"
FILE="$BACKUP_DIR/fompa_$STAMP.dump"

mkdir -p "$BACKUP_DIR"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: variabel DATABASE_URL belum diatur" >&2
  exit 1
fi

echo "[$(date +%H:%M:%S)] Membuat backup → $FILE"
pg_dump --dbname="$DATABASE_URL" --format=custom --file="$FILE"

# Simpan 14 backup terakhir
ls -1t "$BACKUP_DIR"/fompa_*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "[$(date +%H:%M:%S)] Backup selesai ($(du -h "$FILE" | cut -f1))"
