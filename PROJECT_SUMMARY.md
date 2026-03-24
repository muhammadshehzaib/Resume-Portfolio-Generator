# Resume-to-Portfolio Generator — Project Summary

## 🎯 What This Project Does

A **web application** that:
1. **Accepts PDF resumes** from users
2. **Uses AI** to extract structured resume data (name, experience, skills, education, projects, certifications)
3. **Calculates ATS compatibility score** (0-100) with improvement suggestions
4. **Generates 3 beautiful portfolio websites** (Minimal, Modern, Creative)
5. **Creates a shareable link** anyone can view without logging in
6. **Lets users edit their portfolio** anytime (same link always has the latest data)

---

## 🔑 Key Features

### ✅ Core Features (Implemented)

1. **Resume Upload**
   - Drag-and-drop PDF upload
   - File validation (PDF only, max 10MB)
   - Text-based PDF required

2. **AI-Powered Extraction**
   - Smart parsing using Grok AI API
   - Extracts: name, contact info, experience, education, skills, projects, certifications
   - Structured JSON output

3. **ATS Scoring**
   - Evaluates resume against ATS criteria
   - Score: 0-100
   - Provides 3-7 actionable improvement suggestions

4. **Portfolio Generation**
   - 3 professional templates (Minimal, Modern, Creative)
   - Switch templates anytime
   - Responsive design

5. **Shareable Links**
   - Unique UUID per portfolio
   - No login required to view
   - Works on any network, any device
   - Example: `https://myportfolio.com/portfolio/abc123`

6. **Edit Portfolio** ⭐
   - Edit any field after generation
   - Add/remove experiences, education, projects
   - Changes saved instantly
   - Same link always shows latest data
   - Recruiters see updated version automatically

### ✨ 8 Premium Customization Features (March 2024, Updated March 2026)

1. **Profile Photo Upload** 🖼️
   - Upload professional headshot (JPEG, PNG, WebP)
   - Max 5MB, auto-displayed in all templates
   - Circular crop, high-quality display

2. **Custom Colors** 🎨
   - Personalize primary accent & background colors
   - Color picker + hex code input
   - Applied to section headings, accents, sidebar
   - Live preview in settings panel

3. **Drag-to-Reorder Sections** 📊
   - Customize section display order
   - Reorder: Experience, Education, Projects, Skills, Certifications
   - Save independently from content edits
   - Default order: Experience → Education → Projects → Skills → Certifications

4. **Dark/Light Mode Toggle** 🌙
   - Per-portfolio theme setting
   - Persisted to database
   - Applies to Minimal & Modern templates
   - Creative template always dark

5. **Preview Mode** 👁️
   - Hide all editing controls
   - See recruiter-only view
   - Floating "Exit Preview" button
   - Test clean appearance before sharing

6. **Available for Hire Badge** 💼
   - Green badge signals job availability
   - Toggle on/off anytime
   - Displays below name (Minimal), in sidebar (Modern), in hero (Creative)
   - Helps recruiters prioritize candidates

7. **Custom Portfolio Slug** 🔗
   - Create memorable URLs like `/p/johndoe`
   - Validation: 3-50 chars, lowercase + numbers + hyphens
   - Unique per portfolio (no duplicates)
   - Old UUID URL still works (redirect optional)
   - Public `/p/{slug}` endpoint for easy sharing

8. **QR Code Generator** 📱
   - Generate scannable QR codes for portfolio sharing
   - One-click download as PNG image
   - Works with both slug-based and UUID-based URLs
   - Perfect for business cards, printed resumes, networking events
   - Professional modal interface with URL display

### ✨ Analytics & Social Features

**View Count Analytics** 📊
- Tracks how many times your portfolio has been viewed
- Increments on every GET request from recruiters
- Displayed in header bar (left side, next to "← New portfolio")
- Motivates users to continue sharing
- Owner-only visibility (recruiters don't see it)

**Open Graph Social Sharing** 🔗
- Rich preview cards on LinkedIn, Twitter, WhatsApp, Facebook
- Shows your name, professional summary, and profile photo
- Links with previews get 3× more clicks
- Generated dynamically from your portfolio data

---

## 📦 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite + SQLAlchemy ORM
- **AI**: Grok API (xAI) - free tier
- **PDF Parsing**: pdfplumber
- **Port**: 8000

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Port**: 3000

### APIs

**Core Endpoints:**
- POST `/api/upload` — Upload resume, returns portfolio UUID + ATS score
- GET `/api/portfolio/{id}` — Retrieve portfolio by ID
- PATCH `/api/portfolio/{id}` — Update portfolio (resume data: name, experience, education, skills, projects, certifications)

**Premium Feature Endpoints:**
- POST `/api/portfolio/{id}/photo` — Upload profile photo (Feature 1)
- PATCH `/api/portfolio/{id}/settings` — Update colors, slug, dark mode, section order, available for hire badge (Features 2, 3, 4, 6, 7)
- GET `/api/p/{slug}` — Retrieve portfolio by custom slug (Feature 7)

---

## 🗂️ Project Structure

```
testing02/
├── backend/
│   ├── app/
│   │   ├── main.py                      # FastAPI app
│   │   ├── config.py                    # Settings
│   │   ├── database.py                  # SQLAlchemy setup
│   │   ├── models/
│   │   │   └── portfolio.py             # ORM model
│   │   ├── schemas/
│   │   │   └── portfolio.py             # Pydantic schemas
│   │   ├── routers/
│   │   │   └── portfolio.py             # POST/GET/PATCH endpoints
│   │   ├── services/
│   │   │   ├── pdf_parser.py            # PDF extraction
│   │   │   ├── ai_extractor.py          # AI parsing
│   │   │   └── ats_scorer.py            # ATS scoring
│   │   └── utils/
│   │       └── prompts.py               # Claude prompt templates
│   ├── requirements.txt
│   ├── .env                             # XAI_API_KEY, DATABASE_URL
│   └── portfolios.db                    # SQLite database (auto-created)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                     # Home/upload page
│   │   ├── portfolio/[id]/page.tsx      # Portfolio viewer (with all 7 features) ⭐
│   │   ├── p/[slug]/page.tsx            # Public slug portfolio page ⭐ NEW
│   │   ├── layout.tsx                   # Root layout
│   │   └── globals.css                  # Tailwind setup
│   ├── components/
│   │   ├── upload/
│   │   │   ├── DropZone.tsx             # Drag-drop upload
│   │   │   └── UploadProgress.tsx       # Upload status
│   │   └── portfolio/
│   │       ├── EditMode.tsx             # Edit form + photo upload + section reorder ⭐
│   │       ├── SettingsPanel.tsx        # Colors, slug settings ⭐ NEW
│   │       ├── TemplateSwitcher.tsx     # Template toggle
│   │       ├── ShareButton.tsx          # Copy link + slug support ⭐
│   │       ├── AtsScoreCard.tsx         # ATS score display
│   │       └── templates/
│   │           ├── MinimalTemplate.tsx  # Clean + photo + colors + order + dark ⭐
│   │           ├── ModernTemplate.tsx   # Professional + photo + colors + order + dark ⭐
│   │           └── CreativeTemplate.tsx # Bold/colorful + photo + colors + order ⭐
│   ├── lib/
│   │   ├── types.ts                     # TypeScript interfaces
│   │   └── api.ts                       # API client functions
│   ├── .env.local                       # API URLs
│   └── package.json
│
├── Documentation/
│   ├── README.md                        # Project overview
│   ├── QUICK_START.md                   # 5-minute setup
│   ├── EDITING_GUIDE.md                 # How to edit portfolios
│   ├── POSTMAN_GUIDE.md                 # API testing guide
│   ├── DEPLOYMENT.md                    # Deploy to production
│   └── PROJECT_SUMMARY.md               # This file
│
└── postman_collection.json              # Import to Postman
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python3 -m pip install -r requirements.txt
echo "XAI_API_KEY=your-grok-key" > .env
echo "DATABASE_URL=sqlite:///./portfolios.db" >> .env
python3 -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install  # (already done)
npm run dev
```

### 3. Use It
- Visit http://localhost:3000
- Upload PDF resume
- Click "Edit" to modify
- Click "Copy Link" to share
- Done!

---

## 🧪 Testing

### Option 1: Web UI
1. Visit http://localhost:3000
2. Upload resume
3. View portfolio
4. Edit content
5. Share link

### Option 2: Postman (API Testing)
1. Import `postman_collection.json` to Postman
2. Requests auto-populate with example data
3. Variables auto-set after upload
4. Test all endpoints

### Option 3: cURL
```bash
# Upload
curl -X POST http://localhost:8000/api/upload \
  -F "file=@resume.pdf"

# Get portfolio
curl http://localhost:8000/api/portfolio/{uuid}

# Update portfolio
curl -X PATCH http://localhost:8000/api/portfolio/{uuid} \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", ...}'
```

---

## 📋 Data Model

### Portfolio Table
```
id           VARCHAR     Primary key (UUID v4)
raw_text     TEXT        Original resume text
parsed_data  TEXT        JSON: ParsedResume object
ats_score    INTEGER     0-100 score
ats_feedback TEXT        JSON: Array of suggestions
template     VARCHAR     Default: "minimal"
created_at   DATETIME    Timestamp
```

### ParsedResume Structure
```json
{
  "name": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "location": "string"
  },
  "summary": "string",
  "experiences": [
    {
      "company": "string",
      "title": "string",
      "start_date": "string",
      "end_date": "string | null",
      "description": ["string", ...]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduation_year": "string",
      "gpa": "string"
    }
  ],
  "skills": ["string", ...],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string", ...],
      "url": "string"
    }
  ],
  "certifications": ["string", ...]
}
```

---

## 🎨 Portfolio Templates

### Minimal
- Clean, editorial style
- Serif headings
- White background with slate accents
- Single column, centered
- Professional, timeless

### Modern
- Two-column sidebar layout
- Dark sidebar (gray-900), light main (gray-50)
- Blue accents (#blue-500)
- Pill badges for skills
- Contemporary SaaS feel

### Creative
- Bold, dark theme (zinc-950)
- Gradient hero section (violet → cyan)
- Asymmetric layout
- Timeline for experience
- Tech/creative industry vibes

---

## 🔗 Shareable Link System

### How It Works

1. **Upload Resume**
   - AI extracts data
   - Portfolio saved to SQLite with UUID
   - UUID returned to frontend

2. **Get Shareable Link**
   - Format: `https://myportfolio.com/portfolio/{uuid}`
   - No login needed to view
   - Works on any network

3. **Edit Portfolio**
   - Click Edit button on portfolio page
   - Modify any fields
   - Click Save
   - Same UUID, same link, updated data

4. **Share with Recruiters**
   - Send link via email, LinkedIn, etc.
   - Recruiters click link
   - See latest portfolio version
   - Switch templates
   - View ATS score

---

## 📊 User Flow

```
User
  ↓
Upload Resume (PDF)
  ↓
AI Extracts Data + Calculates ATS Score
  ↓
Portfolio Generated (3 templates available)
  ↓
User Can:
  ├→ View Portfolio (switch templates)
  ├→ Edit Content (name, experience, skills, etc.)
  ├→ Copy Shareable Link
  └→ Share with Recruiters/Clients

Recruiter/Client
  ↓
Clicks Shareable Link
  ↓
Views Portfolio (no login needed)
  ↓
Can:
  ├→ See AI-extracted info
  ├→ View ATS score & feedback
  ├→ Switch templates
  └→ See updates in real-time
```

---

## 🌐 Deployment

### Local (Current)
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Database: SQLite file
- Links: Only work on same network

### Production
- Backend: Deploy to Railway/Render
- Frontend: Deploy to Vercel
- Database: PostgreSQL on Railway
- Links: Work globally with custom domain
- Example: `https://myportfolio.com/portfolio/abc123`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guide.

---

## 📈 Future Enhancements

- [ ] User authentication (save multiple portfolios)
- [ ] Download portfolio as PDF
- [ ] Customize template colors/fonts
- [ ] More portfolio templates (6+)
- [ ] Support DOCX/PPTX file uploads
- [ ] Re-upload resume to recalculate ATS
- [ ] Mobile app (iOS/Android)
- [ ] Analytics dashboard
- [ ] Email templates for sharing
- [ ] Integration with job boards

---

## 🔐 Security

✅ **Implemented:**
- File type validation (PDF only)
- File size limit (10MB max)
- CORS configured for frontend only
- SQLite database (local)
- No user authentication (anonymous portfolios)
- No password storage

⚠️ **Considerations for Production:**
- Add rate limiting
- Add user authentication
- Use PostgreSQL instead of SQLite
- Enable HTTPS
- Add request logging
- Monitor API usage
- Regular backups

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Full project overview, features, setup |
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) | API testing with Postman |
| [EDITING_GUIDE.md](./EDITING_GUIDE.md) | How to edit portfolios |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | This file |

---

## 🎓 Learning Resources

### Backend (FastAPI + Python)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Pydantic](https://docs.pydantic.dev/)

### Frontend (Next.js + React)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### AI APIs
- [Grok API (xAI)](https://console.x.ai/)
- [Anthropic Claude API](https://console.anthropic.com/)

---

## 💡 Key Takeaways

✅ **What This Project Demonstrates:**
- Full-stack web development (Python + JavaScript)
- AI integration (prompt engineering, API calls)
- Database design (SQLAlchemy ORM)
- REST API design (CRUD operations)
- React component architecture
- Responsive design with Tailwind CSS
- File handling (PDF parsing)
- Real-time editing (PATCH endpoints)
- Shareable URLs (UUIDs, no auth)

---

## 📞 Support

**Issues?** Check the troubleshooting sections in:
- [QUICK_START.md](./QUICK_START.md)
- [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)
- [EDITING_GUIDE.md](./EDITING_GUIDE.md)

---

## 📄 License

This project is open-source and available for personal and commercial use.

---

**🚀 Ready to build amazing portfolios!**

Start with [QUICK_START.md](./QUICK_START.md) or [README.md](./README.md)
