# Deploying ResumeOS to the Contabo VPS

Runs the FastAPI backend + Next.js frontend in Docker, bound to localhost, behind
the existing nginx on a **single subdomain** (same origin → no CORS, one cert):

```
resume.shehzaib.com
  ├── /api/...  -> backend  (FastAPI, 127.0.0.1:8000)   [SQLite persisted in a volume]
  └── /         -> frontend (Next.js, 127.0.0.1:3005)
```

Uses the **production** compose file (`docker-compose.prod.yml`) — the default
`docker-compose.yml` is dev-only (hot reload) and must not be used here.

You can reuse your existing **Cloudinary** creds and **Gemini** key (no new accounts).

---

## 1. DNS (Namecheap → shehzaib.com → Advanced DNS)

| Type | Host | Value |
|------|--------|-----------------|
| A | `resume` | `109.123.244.167` |

Verify: `dig +short resume.shehzaib.com` → `109.123.244.167`.

## 2. Check ports are free
```bash
ss -tlnp | grep -E ':(8000|3005) ' || echo "8000 and 3005 are FREE"
```
(If taken, change `BACKEND_PORT` / `FRONTEND_PORT` in `.env` and the nginx `proxy_pass` ports.)

## 3. Clone
```bash
mkdir -p /opt/resume && cd /opt/resume
git clone https://github.com/muhammadshehzaib/Resume-Portfolio-Generator.git .
```

## 4. Configure `.env`
Create it (replace the `YOUR_*` placeholders with your Gemini key + Cloudinary creds):
```bash
cd /opt/resume
cat > .env <<'EOF'
PUBLIC_URL=https://resume.shehzaib.com
AI_PROVIDER=openai
AI_MODEL=gemini-2.0-flash
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_API_KEY=YOUR_GEMINI_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
BACKEND_PORT=8000
FRONTEND_PORT=3005
EOF
nano .env    # fill in the YOUR_* values
```

> `PUBLIC_URL` is baked into the frontend at build time. If you change it later,
> rebuild: `docker compose -f docker-compose.prod.yml up -d --build frontend`.

## 5. Build & start (backend pulls a ~2GB Playwright image — be patient)
```bash
cd /opt/resume
nohup docker compose -f docker-compose.prod.yml up -d --build > build.log 2>&1 &
tail -f build.log
```
Then verify:
```bash
docker compose -f docker-compose.prod.yml ps
curl -s http://127.0.0.1:8000/health; echo          # {"status":"ok"}
curl -sI http://127.0.0.1:3005 | head -1            # HTTP/1.1 200 OK
```

## 6. nginx (single server block)
```bash
cat > /etc/nginx/sites-available/resume.shehzaib.com <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name resume.shehzaib.com;

    client_max_body_size 25m;   # resume PDF uploads

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;    # AI extraction can take a while
    }

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
EOF

ln -s /etc/nginx/sites-available/resume.shehzaib.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## 7. HTTPS (snap certbot)
```bash
certbot --version || snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot 2>/dev/null
certbot --nginx -d resume.shehzaib.com
```
Choose redirect (HTTP→HTTPS), then open **https://resume.shehzaib.com** 🎉

## Update later
```bash
cd /opt/resume && git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes
- The SQLite DB lives in the `backend_data` volume, so it survives rebuilds.
  Back it up with: `docker compose -f docker-compose.prod.yml cp backend:/app/data/portfolios.db ./portfolios-backup.db`
- Profile photos go to Cloudinary; resume PDFs are parsed in memory (not stored).
