# Quick Start Guide

Get the Resume Portfolio Generator running in **5 minutes**.

---

## Prerequisites

- Python 3.9+
- Node.js 18+
- Grok API key from [console.x.ai](https://console.x.ai)

---

## 1. Setup Backend

```bash
cd backend

# Install dependencies
python3 -m pip install -r requirements.txt

# Add your Grok API key to .env
echo "XAI_API_KEY=your-key-here" >> .env
echo "DATABASE_URL=sqlite:///./portfolios.db" >> .env

# Start server
python3 -m uvicorn app.main:app --reload --port 8000
```

✅ Backend running at `http://localhost:8000`

---

## 2. Setup Frontend

```bash
cd frontend

# Install dependencies (already done, but if needed)
npm install

# Start dev server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

## 3. Test the App

1. Open **http://localhost:3000** in your browser
2. Click the upload area and select a PDF resume
3. Wait for AI to extract info (30-60 seconds)
4. See your portfolio with 3 templates!
5. Click **"Edit"** to modify content
6. Click **"Copy Link"** to get shareable URL
7. Click the link in new tab to verify sharing works

---

## 4. Test API with Postman (Optional)

### Import Collection:

1. Open **Postman**
2. Click **Import**
3. Select **`postman_collection.json`** from this folder
4. Click **Import**

### Run Requests:

1. **Health Check** → See "ok"
2. **Upload Resume** → Upload a PDF
3. **Get Portfolio** → View extracted data (uses auto-set portfolio_id)
4. **Update Portfolio** → Edit the JSON and save

👉 See [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) for detailed instructions

---

## File Structure

```
testing02/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── main.py      # FastAPI app
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # API endpoints
│   │   └── services/    # PDF parsing, AI extraction
│   ├── requirements.txt
│   └── .env
├── frontend/            # Next.js React frontend
│   ├── app/             # Pages
│   ├── components/      # React components
│   ├── lib/             # API client, types
│   └── package.json
├── README.md            # Full project overview
├── EDITING_GUIDE.md     # How to edit portfolios
├── POSTMAN_GUIDE.md     # How to test APIs
├── DEPLOYMENT.md        # How to deploy
└── postman_collection.json  # Import to Postman
```

---

## Key Features

**Core:**
✅ **Upload Resume** → PDF to portfolio in seconds
✅ **AI Extraction** → Smart parsing of resume data
✅ **ATS Scoring** → 0-100 score + improvement tips
✅ **3 Templates** → Minimal, Modern, Creative
✅ **Edit Portfolio** → Change any info anytime
✅ **Shareable Link** → `https://myportfolio.com/portfolio/abc123`
✅ **No Login** → Anyone can view with link

**8 Premium Features + Analytics:**
✅ **Profile Photo** → Add professional headshot
✅ **Custom Colors** → Personalize accent colors
✅ **Reorder Sections** → Custom section order
✅ **Dark/Light Mode** → Theme toggle
✅ **Preview Mode** → Recruiter-only view
✅ **Available Badge** → Signal job availability
✅ **Custom Slug** → Memorable URLs like `/p/johndoe`
✅ **QR Code** → Generate scannable codes for business cards
✅ **View Count** → See how many recruiters viewed your portfolio

---

## Troubleshooting

### Backend won't start?

```bash
# Make sure port 8000 is free
lsof -i :8000

# Or run on different port
python3 -m uvicorn app.main:app --port 8001
```

### Frontend won't start?

```bash
# Make sure port 3000 is free
lsof -i :3000

# Check Node version
node --version  # Should be 18+
```

### "Cannot parse PDF" error?

- Make sure PDF is text-based (not scanned image)
- File size < 10MB
- Try with a different resume

### "API not found" error?

- Make sure backend is running (`http://localhost:8000`)
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled (it is by default)

---

## Next Steps

- 📖 Read [README.md](./README.md) for full overview
- 🔧 Check [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) to test APIs
- ✏️ Read [EDITING_GUIDE.md](./EDITING_GUIDE.md) to understand editing
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy globally

---

## API Endpoints

**Core:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check API status |
| `/api/upload` | POST | Upload resume, get portfolio |
| `/api/portfolio/{id}` | GET | Get portfolio by UUID |
| `/api/portfolio/{id}` | PATCH | Edit portfolio content |

**Premium Features:**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/portfolio/{id}/photo` | POST | Upload profile photo |
| `/api/portfolio/{id}/settings` | PATCH | Update colors, slug, dark mode, section order, badge |
| `/api/p/{slug}` | GET | Get portfolio by custom slug |

---

## Environment Variables

**Backend (.env):**
```
XAI_API_KEY=your-grok-key
DATABASE_URL=sqlite:///./portfolios.db
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
```

---

## Commands Reference

```bash
# Backend
cd backend && python3 -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Test backend imports
cd backend && python3 -c "from app.main import app; print('✓ OK')"
```

---

🎉 **You're all set! Start building portfolios!**
