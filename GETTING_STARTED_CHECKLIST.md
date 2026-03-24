# Getting Started Checklist

Follow this checklist to get your Resume Portfolio Generator running in 5 minutes.

---

## ✅ Pre-Flight Checklist

- [ ] Python 3.9+ installed (`python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Grok API key obtained from [console.x.ai](https://console.x.ai)
- [ ] Access to terminal/command line

---

## ✅ Step 1: Backend Setup (2 minutes)

```bash
cd /Users/macbookpro/testing02/backend
```

- [ ] Install Python dependencies
  ```bash
  python3 -m pip install -r requirements.txt
  ```

- [ ] Create `.env` file with your Grok key
  ```bash
  echo "XAI_API_KEY=your-grok-key-here" > .env
  echo "DATABASE_URL=sqlite:///./portfolios.db" >> .env
  ```

- [ ] Start FastAPI server
  ```bash
  python3 -m uvicorn app.main:app --reload --port 8000
  ```

- [ ] ✅ Backend running at `http://localhost:8000`
  - See: "Uvicorn running on http://127.0.0.1:8000"
  - Test: `curl http://localhost:8000/health` should return `{"status":"ok"}`

---

## ✅ Step 2: Frontend Setup (2 minutes)

Open a **NEW terminal window**:

```bash
cd /Users/macbookpro/testing02/frontend
```

- [ ] Install dependencies (if needed)
  ```bash
  npm install
  ```

- [ ] Start Next.js dev server
  ```bash
  npm run dev
  ```

- [ ] ✅ Frontend running at `http://localhost:3000`
  - See: "Ready in Xs"
  - Test: Open http://localhost:3000 in browser

---

## ✅ Step 3: Test the Application (1 minute)

Browser:

- [ ] Open http://localhost:3000
- [ ] See home page with upload area ✓
- [ ] Drag or click to select a **PDF resume file**
- [ ] Wait 30-60 seconds for AI to process
- [ ] See portfolio with your info ✓

---

## ✅ Step 4: Test Features

On the portfolio page:

- [ ] **View portfolio data** (AI extracted your resume) ✓
- [ ] **View ATS score** (0-100 score + suggestions) ✓
- [ ] **Switch templates**: Click Minimal → Modern → Creative ✓
- [ ] **Edit portfolio**: Click "Edit" button ✓
  - [ ] Edit your name
  - [ ] Update skills
  - [ ] Add/remove experience
  - [ ] Click "Save Changes"
  - [ ] See changes apply
- [ ] **Share link**: Click "Copy Link" button ✓
  - [ ] Copy link to clipboard
  - [ ] Open link in new tab
  - [ ] Verify portfolio loads
  - [ ] Edit again and verify changes appear

---

## ✅ Step 5: Test with Postman (Optional)

For API testing:

- [ ] Download and open Postman
- [ ] Click "Import"
- [ ] Select `postman_collection.json`
- [ ] Click "Import"
- [ ] Run requests:
  - [ ] Health Check (GET /health)
  - [ ] Upload Resume (POST /api/upload)
  - [ ] Get Portfolio (GET /api/portfolio/{id})
  - [ ] Update Portfolio (PATCH /api/portfolio/{id})

---

## ✅ Troubleshooting

### Backend won't start?

- [ ] Check port 8000 is free: `lsof -i :8000`
- [ ] Verify Grok API key is correct in `.env`
- [ ] Try different port: `--port 8001`

### Frontend won't start?

- [ ] Check port 3000 is free: `lsof -i :3000`
- [ ] Verify Node version: `node --version` (should be 18+)
- [ ] Try: `npm install` again

### "Cannot upload resume"?

- [ ] Ensure file is PDF format
- [ ] Ensure file < 10MB
- [ ] Ensure PDF is text-based (not scanned image)
- [ ] Check backend is running: `curl http://localhost:8000/health`

### "Edit not working"?

- [ ] Refresh page and try again
- [ ] Check browser console for errors (F12)
- [ ] Verify backend is running

---

## ✅ Documentation to Read

After getting it running:

| Document | When to Read | Time |
|----------|--------------|------|
| [QUICK_START.md](QUICK_START.md) | If you get stuck | 5 min |
| [README.md](README.md) | To understand features | 10 min |
| [EDITING_GUIDE.md](EDITING_GUIDE.md) | To learn editing | 5 min |
| [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) | To test APIs | 10 min |
| [DEPLOYMENT.md](DEPLOYMENT.md) | To deploy globally | 20 min |

---

## ✅ File Locations

Keep these in mind:

```
/Users/macbookpro/testing02/
├── backend/
│   ├── .env                      (Add your Grok key here)
│   └── app/main.py              (Backend entry point)
├── frontend/
│   ├── .env.local               (Already configured)
│   └── app/page.tsx             (Upload page)
└── postman_collection.json       (For API testing)
```

---

## ✅ Environment Variables

**Backend (.env)** - CREATE THIS:
```
XAI_API_KEY=your-grok-key-here
DATABASE_URL=sqlite:///./portfolios.db
```

**Frontend (.env.local)** - ALREADY SET:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
```

---

## ✅ Common Commands

```bash
# Backend
cd backend
python3 -m uvicorn app.main:app --reload --port 8000
python3 -c "from app.main import app; print('✓ OK')"

# Frontend
cd frontend
npm run dev
npm run build
npm run start

# Check if ports are in use
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill process on port
kill -9 $(lsof -t -i :8000)
```

---

## ✅ Success Criteria

You'll know everything is working when:

- [ ] Backend running: `curl http://localhost:8000/health` returns `{"status":"ok"}`
- [ ] Frontend running: `http://localhost:3000` loads without errors
- [ ] Upload works: Can upload PDF and see portfolio
- [ ] Editing works: Can click Edit and change portfolio
- [ ] Sharing works: Can copy link and view in new tab
- [ ] Templates work: Can switch between all 3 templates
- [ ] Postman works: Can run all 4 API requests

---

## ✅ What to Do Next

### Local Testing (Now):
1. Upload several test resumes
2. Edit portfolios
3. Try all 3 templates
4. Test sharing with others on your network

### Deployment (Later):
1. Get a domain (~$10/year)
2. Deploy backend to Railway (free)
3. Deploy frontend to Vercel (free)
4. Update environment variables
5. Share globally!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps.

---

## ✅ Getting Help

If you get stuck:

1. **Check QUICK_START.md** - Common setup issues
2. **Check README.md** - Feature documentation
3. **Check terminal errors** - Read the error message carefully
4. **Google the error** - Usually someone else had it
5. **Check file permissions** - Can you read/write files?

---

## ✅ You're Ready! 🎉

Now:
1. Start the backend
2. Start the frontend
3. Open http://localhost:3000
4. Upload a resume
5. See your portfolio!

**Welcome to Resume Portfolio Generator!**

Questions? Check the documentation files.

---

Last Updated: March 20, 2026
