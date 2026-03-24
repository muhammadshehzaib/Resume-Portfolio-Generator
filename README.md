# Resume to Portfolio Generator

Upload your resume, AI extracts structured info, and generates a beautiful portfolio website with multiple templates.

## Core Features

- **AI-Powered Extraction**: Intelligent resume parsing using Grok API
- **ATS Scoring**: Get compatibility score and improvement suggestions
- **Portfolio Templates**: 3 design options (Minimal, Modern, Creative)
- **Shareable Link**: Unique URL for each portfolio (no auth required)
- **Edit Portfolio**: Update any information after generation - same link always works!
- **Social Media Preview** ⭐ — When you share your link on LinkedIn/Twitter, shows rich preview card with your name, bio, and photo (3× more clicks!)
- **View Count Analytics** ⭐ — See how many recruiters have viewed your portfolio

## 8 Premium Customization Features ✨

1. **🖼️ Profile Photo Upload** - Add professional headshot to portfolio
2. **🎨 Custom Colors** - Personalize accent & background colors
3. **📊 Drag-to-Reorder Sections** - Customize section display order
4. **🌙 Dark/Light Mode** - Toggle theme preference per portfolio
5. **👁️ Preview Mode** - See recruiter-only view without editing controls
6. **💼 Available for Hire Badge** - Signal job availability to recruiters
7. **🔗 Custom Portfolio Slug** - Create memorable URLs like `/p/johndoe`
8. **📱 QR Code Generator** - Generate downloadable QR codes for business cards & resumes

👉 [Feature Details & Editing Guide](./EDITING_GUIDE.md)

## Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- Grok API key from [console.x.ai](https://console.x.ai)

### Backend Setup

```bash
cd backend
python3 -m pip install -r requirements.txt
```

Add your Grok API key to `.env`:
```
XAI_API_KEY=your-grok-key-here
DATABASE_URL=sqlite:///./portfolios.db
```

Start the backend:
```bash
python3 -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
testing02/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── models/          # ORM models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # PDF parsing, AI extraction, ATS scoring
│   │   └── utils/           # Prompt templates
│   └── requirements.txt
└── frontend/
    ├── app/                 # Next.js App Router
    ├── components/          # React components
    ├── lib/                 # API client, types
    └── package.json
```

## API Endpoints

### Core Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF, extract info, return portfolio UUID |
| GET | `/api/portfolio/{id}` | Retrieve portfolio by ID |
| PATCH | `/api/portfolio/{id}` | Update portfolio content (name, experience, education, etc.) |

### Premium Features (New)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/portfolio/{id}/photo` | Upload profile photo (JPEG, PNG, WebP; max 5MB) |
| PATCH | `/api/portfolio/{id}/settings` | Update colors, slug, dark mode, section order, available for hire badge |
| GET | `/api/p/{slug}` | Retrieve portfolio by custom slug (e.g., `/api/p/johndoe`) |

## Workflow

1. User uploads PDF resume
2. Backend parses PDF with `pdfplumber`
3. AI extracts structured data (name, experience, skills, etc.)
4. AI scores ATS compatibility (0-100)
5. Portfolio saved to SQLite with unique UUID
6. Frontend shows portfolio with 3 switchable templates
7. User can **edit any information** right on the portfolio page
8. Changes are saved instantly - same shareable link always has the latest data
9. User can copy shareable link and share with recruiters/clients (they see the latest version)

## Testing

1. Start backend at `http://localhost:8000`
2. Start frontend at `http://localhost:3000`
3. Upload a PDF resume
4. View the generated portfolio
5. Try different templates
6. **Click "Edit" to modify portfolio content** (add/remove experience, skills, projects, etc.)
7. Click "Copy Link" to get shareable URL
8. Paste link in new tab to verify sharing works
9. Edit the portfolio and see changes appear in the shared link

## Deployment (Share Globally)

To make your shareable links work **on any network** with a **custom domain**:

1. Buy a domain (e.g., `myportfolio.com`)
2. Deploy backend to Railway/Render
3. Deploy frontend to Vercel
4. Update environment variables with your custom domain
5. Share links globally!

**Example Shareable Link After Deployment:**
```
https://myportfolio.com/portfolio/abc123def456
```

👉 [Full Deployment Guide](./DEPLOYMENT.md)

---

## Shareable Link Details

**How it works:**
- Each portfolio gets a **unique UUID** (random, unguessable)
- No login needed to view
- Works on **any network**, **any device**
- Anyone with the link can view and switch templates

**Local (current):**
```
http://localhost:3000/portfolio/abc123
```

**Global (after deployment):**
```
https://myportfolio.com/portfolio/abc123
https://yourcompany.com/portfolio/def456
```

---

## Next Steps

- Deploy to Railway (backend) + Vercel (frontend)
- Buy a custom domain
- Share with recruiters, clients, friends
- Add authentication (optional, to save multiple portfolios)
- Add more templates
- Support other file formats (DOCX, etc.)
