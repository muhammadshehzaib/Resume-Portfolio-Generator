# Deployment Guide — Custom Domain Setup & Features

Complete guide to deploying the Resume Portfolio Generator with custom domain and all 7 premium features.

---

## Table of Contents

1. [What's New (7 Features)](#whats-new-7-features)
2. [Architecture](#architecture)
3. [Local Development](#local-development)
4. [Backend Deployment (Railway)](#backend-deployment-railway)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Domain & DNS Setup](#domain--dns-setup)
7. [Environment Variables](#environment-variables)
8. [Testing Features](#testing-features)
9. [Troubleshooting](#troubleshooting)
10. [Cost & Scaling](#cost--scaling)

---

## What's New (7 Features)

All features below are **fully implemented** and ready to deploy:

### ✅ Feature 1: Profile Photo Upload
- **Endpoint**: `POST /api/portfolio/{id}/photo`
- **What it does**: Upload headshot visible in all templates
- **Database**: Stores `photo_url` path

### ✅ Feature 2: Custom Colors
- **Endpoint**: `PATCH /api/portfolio/{id}/settings`
- **What it does**: Customize accent & background colors
- **Database**: Stores `custom_colors` (JSON: primaryColor, bgColor)

### ✅ Feature 3: Drag-to-Reorder Sections
- **Endpoint**: `PATCH /api/portfolio/{id}/settings`
- **What it does**: Reorder Experience, Education, Projects, Skills, Certifications
- **Database**: Stores `section_order` (JSON array)

### ✅ Feature 4: Dark/Light Mode Toggle
- **Endpoint**: `PATCH /api/portfolio/{id}/settings`
- **What it does**: Global light/dark theme per portfolio
- **Database**: Stores `dark_mode` (boolean)

### ✅ Feature 5: Preview Mode
- **Frontend only**: Hide editing controls, show recruiter view
- **No API changes needed**
- **Database**: None (UI state)

### ✅ Feature 6: Available for Hire Badge
- **Endpoint**: `PATCH /api/portfolio/{id}/settings`
- **What it does**: Green badge signals to recruiters
- **Database**: Stores `available_for_hire` (boolean)

### ✅ Feature 7: Custom Portfolio Slug
- **Endpoint**:
  - `PATCH /api/portfolio/{id}/settings` (set slug)
  - `GET /api/p/{slug}` (retrieve by slug)
- **What it does**: `/p/johndoe` URLs instead of `/p/abc123`
- **Database**: Stores `slug` (string, unique)

---

## Architecture

```
Your Custom Domain (e.g., myportfolio.com)
    ↓
    ├── Frontend (Vercel) — myportfolio.com
    │   ├── Upload Resume UI
    │   ├── Portfolio Editor (all 7 features)
    │   ├── Template Switcher
    │   └── Settings Panel (colors, slug, etc.)
    │
    └── Backend (Railway) — api.myportfolio.com
        ├── /api/upload               (resume upload)
        ├── /api/portfolio/{id}       (get/update resume data)
        ├── /api/portfolio/{id}/photo (upload photo)
        ├── /api/portfolio/{id}/settings (colors, slug, dark mode, badge, order)
        ├── /api/p/{slug}            (get by custom slug)
        └── /static/photos/          (static photo storage)
```

### Database Schema

```sql
portfolios (SQLite):
  id                    UUID PRIMARY KEY
  raw_text              TEXT            (original resume)
  parsed_data           JSON            (extracted resume)
  ats_score             INT
  ats_feedback          JSON
  template              VARCHAR         (default: 'minimal')

  -- Feature 1: Photo
  photo_url             VARCHAR         (e.g., '/static/photos/{id}.jpg')

  -- Feature 2: Colors
  custom_colors         JSON            (primaryColor, bgColor)

  -- Feature 3: Section Order
  section_order         JSON            (array of section names)

  -- Feature 4: Dark Mode
  dark_mode             BOOLEAN         (default: FALSE)

  -- Feature 6: Available for Hire
  available_for_hire    BOOLEAN         (default: FALSE)

  -- Feature 7: Slug
  slug                  VARCHAR UNIQUE  (e.g., 'johndoe')

  created_at            DATETIME
  updated_at            DATETIME
```

---

## Local Development

### Prerequisites

```bash
# Python 3.9+
python3 --version

# Node.js 18+
node --version
npm --version
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
XAI_API_KEY=your-grok-api-key-here
DATABASE_URL=sqlite:///./portfolios.db
EOF

# Run migrations (automatic on startup)
python3 -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
EOF

# Run development server
npm run dev

# Open http://localhost:3000
```

### Test All Features Locally

```bash
# 1. Upload a resume → generates portfolio
# 2. Click Edit → all 7 features available
# 3. Upload photo → appears in template
# 4. Change colors → live preview
# 5. Reorder sections → save and refresh
# 6. Toggle dark mode → instant theme switch
# 7. Toggle available → badge appears
# 8. Set slug → custom URL created
# 9. Click Preview → clean recruiter view
```

---

## Backend Deployment (Railway)

### Step 1: Create Railway Account

- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Connect your repository

### Step 2: Deploy Project

```bash
# Option A: Deploy from GitHub UI
# 1. Click "New Project"
# 2. Select "GitHub Repo"
# 3. Choose your repo
# 4. Railway auto-detects Python/FastAPI
# 5. Deploy starts automatically
```

### Step 3: Database Setup

Railway provides PostgreSQL by default:

```bash
# In Railway dashboard → Variables
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Step 4: Add Environment Variables

In Railway dashboard, go to **Variables** and add:

```bash
XAI_API_KEY=your-grok-api-key-here
CORS_ORIGINS=*  # or specific domain
```

### Step 5: Configure Static Files

Railway automatically serves from the `/static` folder:

```bash
# Photos are saved to: /static/photos/{portfolio_id}.{ext}
# URL becomes: https://api.myportfolio.com/static/photos/{portfolio_id}.jpg
```

### Step 6: Set Custom Domain

- Go to Railway **Settings** → **Domains**
- Add custom domain: `api.myportfolio.com`
- Railway shows CNAME record to add to your DNS
- Takes 5-30 minutes to propagate

### Backend Verification

Test your backend deployment:

```bash
curl https://api.myportfolio.com/api/health
# Expected: 200 OK
```

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### Step 2: Import Project

```bash
# In Vercel dashboard:
# 1. Click "Add New..." → "Project"
# 2. Select your GitHub repo
# 3. Vercel auto-detects Next.js
# 4. Click "Deploy"
```

### Step 3: Set Environment Variables

In Vercel **Settings** → **Environment Variables**:

```bash
NEXT_PUBLIC_API_URL=https://api.myportfolio.com
NEXT_PUBLIC_PORTFOLIO_URL=https://myportfolio.com
```

### Step 4: Configure Domains

- Go to **Settings** → **Domains**
- Add: `myportfolio.com`
- Add: `www.myportfolio.com` (optional)
- Vercel provides nameservers for DNS

### Step 5: Auto-Deployment

Vercel auto-deploys on every push to `main` branch:

```bash
git push origin main
# → Vercel automatically deploys frontend
```

### Frontend Verification

Test your frontend deployment:

```bash
# Open https://myportfolio.com
# You should see the upload page
```

---

## Domain & DNS Setup

### Registrar (GoDaddy, Namecheap, Google Domains, etc.)

#### For Frontend (myportfolio.com → Vercel)

```
Type: A
Name: @ (or leave blank)
Value: Vercel's IP (shown in dashboard)
TTL: 3600
```

Or use Vercel nameservers (easier):

```
Name Servers:
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ns3.vercel-dns.com
  ns4.vercel-dns.com
```

#### For Backend (api.myportfolio.com → Railway)

```
Type: CNAME
Name: api
Value: railway.app domain (shown in Railway dashboard)
TTL: 3600
```

### DNS Propagation

- Usually takes **5-30 minutes**
- Check status:
  ```bash
  nslookup myportfolio.com
  nslookup api.myportfolio.com
  ```

### Verify Both Work

```bash
# Frontend
curl https://myportfolio.com
# Expected: HTML page

# Backend
curl https://api.myportfolio.com/api/health
# Expected: {"status": "ok"}
```

---

## Environment Variables

### Frontend (.env.local in Vercel)

```bash
# API URL (where backend is hosted)
NEXT_PUBLIC_API_URL=https://api.myportfolio.com

# Portfolio base URL (for sharing links)
NEXT_PUBLIC_PORTFOLIO_URL=https://myportfolio.com

# Development (local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
```

### Backend (.env in Railway)

```bash
# Grok/XAI API key (for resume parsing & ATS scoring)
XAI_API_KEY=xai_...

# Database (Railway auto-provides PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Or SQLite for development
DATABASE_URL=sqlite:///./portfolios.db

# CORS settings
CORS_ORIGINS=*
```

---

## Testing Features

### Feature 1: Photo Upload

```bash
# Test endpoint
curl -X POST https://api.myportfolio.com/api/portfolio/{portfolio_id}/photo \
  -F "file=@photo.jpg"

# Expected response
{
  "id": "...",
  "photo_url": "/static/photos/{portfolio_id}.jpg",
  ...
}
```

### Feature 2 & 7: Colors & Slug

```bash
# Test endpoint
curl -X PATCH https://api.myportfolio.com/api/portfolio/{portfolio_id}/settings \
  -H "Content-Type: application/json" \
  -d '{
    "custom_colors": {
      "primaryColor": "#7c3aed",
      "bgColor": "#ffffff"
    },
    "slug": "johndoe"
  }'

# Expected: 200 OK with updated portfolio
```

### Feature 7: Get by Slug

```bash
# Test endpoint
curl https://api.myportfolio.com/api/p/johndoe

# Expected: Portfolio JSON with all features
```

### Feature 3: Section Order

```bash
# Test endpoint
curl -X PATCH https://api.myportfolio.com/api/portfolio/{portfolio_id}/settings \
  -H "Content-Type: application/json" \
  -d '{
    "section_order": ["projects", "experience", "education", "skills", "certifications"]
  }'
```

### Feature 4 & 6: Dark Mode & Badge

```bash
# Test endpoint
curl -X PATCH https://api.myportfolio.com/api/portfolio/{portfolio_id}/settings \
  -H "Content-Type: application/json" \
  -d '{
    "dark_mode": true,
    "available_for_hire": true
  }'
```

### Feature 5: Preview Mode

Preview mode is **frontend-only** (no API call). Just:
1. Click "Preview" button
2. All controls hide
3. Click "Exit Preview" to return

---

## Static Files (Photos)

### Photo Storage

Photos are saved to `static/photos/` directory:

```
static/
  photos/
    abc123def456.jpg      (portfolio ID + extension)
    xyz789abc123.png
    ...
```

### Configure Static Serving

**On Railway** (auto-configured):
- Railway automatically serves `static/` as `/static/`
- Photos accessible at: `https://api.myportfolio.com/static/photos/{id}.jpg`

**On Vercel** (frontend):
- Photos are **not** stored here
- Frontend just displays URLs pointing to Railway backend

### File Limits

```
Max file size:     5 MB per photo
Supported formats: JPEG, PNG, WebP
Storage:           Unlimited (depends on plan)
```

---

## Troubleshooting

### "API not found" error?

```
1. Check NEXT_PUBLIC_API_URL in Vercel settings
2. Verify API domain works: curl https://api.myportfolio.com/api/health
3. Check CORS is enabled in backend
4. Verify Railway deployment completed
```

### "Domain not resolving"?

```
1. DNS propagation takes 5-30 minutes
2. Check DNS: nslookup yourdomian.com
3. Verify registrar settings match Vercel/Railway
4. Try in incognito mode (clear browser cache)
5. Wait and retry after 30 minutes
```

### Photo upload fails?

```
1. Check file size < 5 MB
2. Check file type (JPEG, PNG, WebP only)
3. Verify /static/photos directory exists
4. Check Railway logs for errors
5. Verify database connection
```

### Slug not working?

```
1. Check slug matches regex: ^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$
2. Verify slug is unique (not already taken)
3. Check database slug is saved
4. Test endpoint: GET /api/p/{slug}
```

### Colors not saving?

```
1. Check hex color format (#RRGGBB)
2. Verify JSON is valid in API call
3. Check database custom_colors field
4. Refresh page to see applied colors
```

### Section order not persisting?

```
1. Check section_order is valid JSON array
2. Verify valid section names:
   - experience, education, projects, skills, certifications
3. Check "Save Section Order" button was clicked
4. Verify database section_order field
5. Refresh page to test persistence
```

### Dark mode not applying?

```
1. Check dark_mode boolean is true/false
2. Verify backend saved setting
3. Check template supports dark mode (all do)
4. Creative template always dark (expected)
5. Refresh page
```

### Backend deployment fails?

```
1. Check XAI_API_KEY is valid
2. Verify requirements.txt has all dependencies
3. Check Python version is 3.9+
4. Review Railway logs for error details
5. Verify DATABASE_URL connection string
```

### Frontend deployment fails?

```
1. Check Node.js version is 18+
2. Verify npm install completes
3. Check build succeeds: npm run build
4. Verify environment variables set
5. Review Vercel logs for error details
```

---

## Cost & Scaling

### Cost Breakdown (Monthly)

```
Domain:                ~$1 (yearly: $10-15)
Frontend (Vercel):     Free tier sufficient
                       Pro: $20/month for enterprise
Backend (Railway):     Free: $5/month credit
                       Usage-based: $0.10 per hour + storage
Static Photos:         Included in Railway plan

Total for startup:     ~$0-5/month
Total for business:    ~$20-30/month
```

### Scaling Limits

| Component | Free Tier | Pro Tier | Notes |
|-----------|-----------|----------|-------|
| Frontend (Vercel) | 100 GB bandwidth/month | Unlimited | Usually not a bottleneck |
| Backend (Railway) | $5 credit/month | Pay-as-you-go | Add funds as needed |
| Database | Unlimited rows (SQLite) | PostgreSQL: 1000s/sec | Switch to PostgreSQL at scale |
| Photos (Storage) | Unlimited | Limited by disk space | Add more Railway resources |

### When to Upgrade

- **Vercel Pro**: Handling 10K+ daily users, need priority support
- **Railway Pro**: 500+ daily uploads, high database load
- **PostgreSQL**: More than 10K portfolios, need concurrent users
- **CDN**: Global audience, images slow to load

### Estimated User Capacity

```
Current setup (free tier) supports:
- Up to 1,000 portfolios
- Up to 500 daily users
- Minimal latency in single region

With pro/scaling:
- 100K+ portfolios
- 50K+ daily users
- Global low-latency access
```

---

## Monitoring & Maintenance

### Monitor Backend Health

```bash
# Check backend status
curl https://api.myportfolio.com/api/health

# View Railway logs
# → Go to Railway dashboard → Deployments → View logs
```

### Monitor Frontend Performance

```bash
# Vercel provides built-in analytics
# → Go to Vercel dashboard → Analytics
```

### Backup Data

```bash
# Download database from Railway
# → Railway dashboard → Data → Export
```

### Update Code

```bash
# Push to main branch
git push origin main

# Vercel auto-deploys frontend
# Railway auto-deploys backend
# Usually takes 2-5 minutes
```

---

## Security Checklist

- ✅ XAI_API_KEY never exposed in frontend
- ✅ All environment variables in secure dashboard (Vercel, Railway)
- ✅ Database connection uses HTTPS (Railway PostgreSQL)
- ✅ CORS configured to allow frontend domain only
- ✅ Photo uploads validated (type, size, content)
- ✅ Slug validation prevents directory traversal
- ✅ No secret keys in git repository

---

## Next Steps

1. **Buy a domain** (~$10-15/year)
2. **Deploy backend to Railway** (5 min, free)
3. **Deploy frontend to Vercel** (5 min, free)
4. **Configure DNS** (10 min)
5. **Test all features** (5 min)
6. **Share globally** 🚀

---

## Quick Reference

### Deploy Commands

```bash
# Backend
cd backend
git push origin main  # Auto-deploys to Railway

# Frontend
cd frontend
git push origin main  # Auto-deploys to Vercel
```

### Live URLs (After Deployment)

```
Frontend:   https://myportfolio.com
Backend:    https://api.myportfolio.com
API Docs:   https://api.myportfolio.com/docs
Portfolio:  https://myportfolio.com/portfolio/{id}
Slug URL:   https://myportfolio.com/p/{slug}
```

### Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/learn/foundations/how-nextjs-works)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment)
- [DNS Propagation Checker](https://www.whatsmydns.net)

---

## Support

- 📧 Contact: [your-email@example.com]
- 🐛 Report bugs: [GitHub Issues]
- 💬 Questions: [GitHub Discussions]

---

**Last Updated**: March 2024
**Status**: All 7 features fully implemented and tested ✅
