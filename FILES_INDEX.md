# Project Files Index

Complete list of all files in the Resume Portfolio Generator project.

---

## 📄 Documentation (Read First!)

- **[QUICK_START.md](QUICK_START.md)** ⭐ START HERE
  - 5-minute setup guide
  - Quick commands to get running

- **[README.md](README.md)**
  - Full project overview
  - Features, setup, workflow, testing

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**
  - What this project does
  - Tech stack, structure, data model
  - Key features and user flow

- **[EDITING_GUIDE.md](EDITING_GUIDE.md)**
  - How portfolio editing works
  - Step-by-step examples
  - FAQs about editing

- **[POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)**
  - How to test APIs with Postman
  - Import collection, run requests
  - Testing workflows

- **[DEPLOYMENT.md](DEPLOYMENT.md)**
  - Deploy to production
  - Railway + Vercel setup
  - Custom domain configuration

- **[.env.example](.env.example)**
  - Example environment variables
  - Copy and customize

---

## Backend Files (Python/FastAPI)

### Core Application

- **[backend/app/main.py](backend/app/main.py)**
  - FastAPI application entry point
  - CORS configuration
  - Router registration
  - Health check endpoint

- **[backend/app/config.py](backend/app/config.py)**
  - Settings management
  - Environment variable loading
  - API key configuration

- **[backend/app/database.py](backend/app/database.py)**
  - SQLAlchemy setup
  - Database session factory
  - Get_db dependency

### Models & Schemas

- **[backend/app/models/portfolio.py](backend/app/models/portfolio.py)**
  - SQLAlchemy ORM model
  - Portfolio table definition
  - Columns: id, raw_text, parsed_data, ats_score, ats_feedback, template, created_at

- **[backend/app/schemas/portfolio.py](backend/app/schemas/portfolio.py)**
  - Pydantic request/response schemas
  - ParsedResume structure
  - Contact, Experience, Education, Project models

### API Routes

- **[backend/app/routers/portfolio.py](backend/app/routers/portfolio.py)**
  - POST `/api/upload` — Upload resume
  - GET `/api/portfolio/{uuid}` — Retrieve portfolio
  - PATCH `/api/portfolio/{uuid}` — Update portfolio (edit)
  - Response conversion helper

### Services

- **[backend/app/services/pdf_parser.py](backend/app/services/pdf_parser.py)**
  - PDF text extraction
  - Uses `pdfplumber`
  - Validates text-based PDFs
  - Error handling for image-only PDFs

- **[backend/app/services/ai_extractor.py](backend/app/services/ai_extractor.py)**
  - Calls Grok API for resume parsing
  - Extracts structured data
  - JSON parsing and validation
  - Returns ParsedResume object

- **[backend/app/services/ats_scorer.py](backend/app/services/ats_scorer.py)**
  - Calls Grok API for ATS scoring
  - Evaluates against 7 criteria
  - Returns score (0-100) + feedback
  - Actionable improvement suggestions

### Utilities

- **[backend/app/utils/prompts.py](backend/app/utils/prompts.py)**
  - Claude/Grok prompt templates
  - EXTRACTION_SYSTEM and EXTRACTION_USER_TEMPLATE
  - ATS_SYSTEM and ATS_USER_TEMPLATE
  - Single source of truth for AI prompts

### Configuration

- **[backend/requirements.txt](backend/requirements.txt)**
  - Python dependencies
  - FastAPI, SQLAlchemy, pdfplumber, openai, python-dotenv

- **[backend/.env](backend/.env)** (create this)
  - XAI_API_KEY: Your Grok API key
  - DATABASE_URL: SQLite path

---

## Frontend Files (Next.js/React)

### Pages

- **[frontend/app/page.tsx](frontend/app/page.tsx)**
  - Home page
  - Resume upload form
  - Feature highlights
  - Upload progress tracking

- **[frontend/app/portfolio/[id]/page.tsx](frontend/app/portfolio/[id]/page.tsx)**
  - Portfolio viewer page
  - Dynamic route with UUID
  - Fetches portfolio data
  - Template switcher
  - Edit button
  - Share button

- **[frontend/app/layout.tsx](frontend/app/layout.tsx)**
  - Root layout
  - Metadata configuration
  - Global layout structure

### Components - Upload

- **[frontend/components/upload/DropZone.tsx](frontend/components/upload/DropZone.tsx)**
  - Drag-and-drop file upload
  - Click to browse files
  - File validation (PDF only)
  - Visual feedback

- **[frontend/components/upload/UploadProgress.tsx](frontend/components/upload/UploadProgress.tsx)**
  - Upload status indicator
  - Processing steps
  - Error display
  - Success animation

### Components - Portfolio

- **[frontend/components/portfolio/EditMode.tsx](frontend/components/portfolio/EditMode.tsx)** ⭐ NEW
  - Full editing form modal
  - Edit all resume sections
  - Add/remove items (experiences, education, projects)
  - Save changes
  - Error handling

- **[frontend/components/portfolio/TemplateSwitcher.tsx](frontend/components/portfolio/TemplateSwitcher.tsx)**
  - 3 template buttons (Minimal, Modern, Creative)
  - Active template highlighting
  - Switch templates in real-time

- **[frontend/components/portfolio/ShareButton.tsx](frontend/components/portfolio/ShareButton.tsx)**
  - Copy shareable link button
  - Uses navigator.clipboard API
  - Success toast notification
  - Link format: `https://myportfolio.com/portfolio/{uuid}`

- **[frontend/components/portfolio/AtsScoreCard.tsx](frontend/components/portfolio/AtsScoreCard.tsx)**
  - Display ATS score (0-100)
  - Color-coded score bar
  - List improvement suggestions
  - Feedback items

### Components - Templates

- **[frontend/components/portfolio/templates/MinimalTemplate.tsx](frontend/components/portfolio/templates/MinimalTemplate.tsx)**
  - Clean, editorial design
  - Serif headings
  - Single column, centered
  - White + slate colors

- **[frontend/components/portfolio/templates/ModernTemplate.tsx](frontend/components/portfolio/templates/ModernTemplate.tsx)**
  - Two-column sidebar layout
  - Dark sidebar (gray-900)
  - Light content area (gray-50)
  - Blue pill badges

- **[frontend/components/portfolio/templates/CreativeTemplate.tsx](frontend/components/portfolio/templates/CreativeTemplate.tsx)**
  - Dark theme (zinc-950)
  - Gradient hero section
  - Timeline for experience
  - Asymmetric layout

### Libraries

- **[frontend/lib/types.ts](frontend/lib/types.ts)**
  - TypeScript interfaces
  - ParsedResume, PortfolioResponse, Contact, Experience, etc.
  - Shared types between frontend and backend

- **[frontend/lib/api.ts](frontend/lib/api.ts)**
  - API client functions
  - uploadResume(file)
  - getPortfolio(id)
  - updatePortfolio(id, data)
  - Error handling

### Configuration

- **[frontend/package.json](frontend/package.json)**
  - Dependencies: next, react, tailwindcss, typescript
  - Scripts: dev, build, start

- **[frontend/tsconfig.json](frontend/tsconfig.json)**
  - TypeScript configuration
  - Path aliases (@/*)
  - Compiler options

- **[frontend/tailwind.config.js](frontend/tailwind.config.js)**
  - Tailwind CSS setup
  - Content paths for component scanning

- **[frontend/postcss.config.js](frontend/postcss.config.js)**
  - PostCSS plugins
  - Tailwind, autoprefixer

- **[frontend/.env.local](frontend/.env.local)** (create this)
  - NEXT_PUBLIC_API_URL: Backend URL
  - NEXT_PUBLIC_PORTFOLIO_URL: Frontend URL

- **[frontend/app/globals.css](frontend/app/globals.css)**
  - Tailwind directives
  - Global styles

---

## Testing & API

- **[postman_collection.json](postman_collection.json)**
  - Postman API collection
  - 4 endpoints pre-configured
  - Environment variables
  - Auto-save portfolio_id after upload
  - Example payloads

---

## Directory Structure

```
testing02/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── portfolio.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── portfolio.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── portfolio.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── pdf_parser.py
│   │   │   ├── ai_extractor.py
│   │   │   └── ats_scorer.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── prompts.py
│   ├── requirements.txt
│   ├── .env (create this)
│   └── portfolios.db (auto-created)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── portfolio/[id]/page.tsx
│   ├── components/
│   │   ├── upload/
│   │   │   ├── DropZone.tsx
│   │   │   └── UploadProgress.tsx
│   │   └── portfolio/
│   │       ├── EditMode.tsx
│   │       ├── TemplateSwitcher.tsx
│   │       ├── ShareButton.tsx
│   │       ├── AtsScoreCard.tsx
│   │       └── templates/
│   │           ├── MinimalTemplate.tsx
│   │           ├── ModernTemplate.tsx
│   │           └── CreativeTemplate.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.local (create this)
│   └── package-lock.json
│
├── Documentation/
│   ├── README.md
│   ├── QUICK_START.md
│   ├── PROJECT_SUMMARY.md
│   ├── EDITING_GUIDE.md
│   ├── POSTMAN_GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── FILES_INDEX.md (this file)
│   └── .env.example
│
└── Testing/
    └── postman_collection.json
```

---

## File Statistics

- **Python files**: 11 (backend logic)
- **TypeScript/React files**: 14 (frontend components)
- **Configuration files**: 6 (env, config, package.json)
- **Documentation files**: 8 (guides, README)
- **API collection**: 1 (Postman)

**Total: 40 files**

---

## Which Files to Edit?

### To Add Features:
- Backend: `backend/app/routers/portfolio.py` (add endpoints)
- Frontend: `frontend/components/` (add components)

### To Change AI Behavior:
- `backend/app/utils/prompts.py` (modify prompts)

### To Add Database Fields:
- `backend/app/models/portfolio.py` (modify ORM)
- `backend/app/schemas/portfolio.py` (update Pydantic schema)
- `frontend/lib/types.ts` (sync TypeScript)

### To Change Portfolio Design:
- `frontend/components/portfolio/templates/` (edit templates)
- `frontend/app/globals.css` (global styles)

### To Add New Template:
1. Create `frontend/components/portfolio/templates/NewTemplate.tsx`
2. Add to `TemplateSwitcher.tsx` buttons
3. Add case in portfolio viewer page

---

## Getting Started

1. **Read**: [QUICK_START.md](QUICK_START.md)
2. **Setup**: Backend + Frontend
3. **Test**: Use web UI or Postman
4. **Deploy**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Happy coding! 🚀**
