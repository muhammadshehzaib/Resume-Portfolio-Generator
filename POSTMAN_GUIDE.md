# Postman API Testing Guide

This guide explains how to import and use the Postman collection to test the Resume Portfolio API.

---

## Installation

### Step 1: Download Postman

Download from: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

### Step 2: Import Collection

1. Open Postman
2. Click **"Import"** (top left)
3. Select the **`postman_collection.json`** file from this project
4. Click **"Import"**

✅ Done! You'll see the API collection with all endpoints ready to test.

---

## Setup Environment Variables

The collection uses variables to make testing easier.

### Default Variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `BASE_URL` | `http://localhost:8000` | API server URL |
| `portfolio_id` | (auto-set) | Portfolio UUID (set after upload) |
| `portfolio_score` | (auto-set) | ATS score (set after upload) |

### Change BASE_URL (if needed):

1. Click the **"Variables"** tab in the collection
2. Change `BASE_URL` to your deployed URL:
   - Local: `http://localhost:8000`
   - Production: `https://api.myportfolio.com`

---

## API Endpoints

### 1️⃣ Health Check

**Method:** `GET`
**URL:** `{{BASE_URL}}/health`

**Purpose:** Verify API is running

**Expected Response:**
```json
{
  "status": "ok"
}
```

---

### 2️⃣ Upload Resume & Generate Portfolio

**Method:** `POST`
**URL:** `{{BASE_URL}}/api/upload`

**Body:** Form-data with file

**Steps:**
1. Select "Upload Resume & Generate Portfolio" request
2. Go to the **Body** tab
3. Select the PDF file to upload
4. Click **Send**

**Expected Response:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "parsed_data": {
    "name": "John Doe",
    "contact": {
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "website": null,
      "location": "San Francisco, CA"
    },
    "summary": "Experienced software engineer with 5+ years...",
    "experiences": [...],
    "education": [...],
    "skills": ["Python", "JavaScript", "React", ...],
    "projects": [...],
    "certifications": [...]
  },
  "ats_score": 85,
  "ats_feedback": [
    "Add measurable metrics to your work experience",
    "Use standard section headings like 'Work Experience'",
    ...
  ],
  "template": "minimal",
  "created_at": "2024-03-20T10:30:45.123456"
}
```

**💡 Note:** The `portfolio_id` is automatically saved to your environment for use in other requests!

---

### 3️⃣ Get Portfolio by ID

**Method:** `GET`
**URL:** `{{BASE_URL}}/api/portfolio/{{portfolio_id}}`

**Steps:**
1. Make sure you've run "Upload Resume" first (to get portfolio_id)
2. Select "Get Portfolio by ID" request
3. Click **Send**

**Expected Response:** Same as upload response (full portfolio data)

---

### 4️⃣ Update Portfolio (Edit)

**Method:** `PATCH`
**URL:** `{{BASE_URL}}/api/portfolio/{{portfolio_id}}`

**Body:** JSON with updated ParsedResume object

**Steps:**
1. Select "Update Portfolio (Edit)" request
2. Go to the **Body** tab
3. Edit the JSON with your changes:
   - Change name
   - Add/remove experiences
   - Update skills
   - Modify education
   - Add projects
   - Update certifications
4. Click **Send**

**Example Changes:**
```json
{
  "name": "Jane Doe",  // Changed name
  "skills": ["Python", "Go", "Rust"],  // Updated skills
  "experiences": [
    {
      "company": "New Company",
      "title": "Lead Engineer",
      ...
    }
  ]
}
```

**Expected Response:** Updated portfolio with same ID

---

## Testing Workflow

### Complete Flow:

```
1. Run Health Check
   ↓ Verify API is running
2. Upload Resume
   ↓ Gets portfolio_id automatically
3. Get Portfolio
   ↓ View extracted data
4. Update Portfolio
   ↓ Edit some information
5. Get Portfolio Again
   ↓ Verify changes were saved
```

---

## Step-by-Step Example

### Test 1: Upload Resume

1. Open Postman → Collections → Resume Portfolio API
2. Click **"Upload Resume & Generate Portfolio"**
3. Body tab → Select your PDF resume
4. Click **"Send"**
5. ✅ See response with portfolio_id and ATS score
6. portfolio_id is **auto-saved** to environment

### Test 2: Get That Portfolio

1. Click **"Get Portfolio by ID"**
2. Click **"Send"**
3. ✅ See your portfolio data (uses auto-saved portfolio_id)

### Test 3: Edit Portfolio

1. Click **"Update Portfolio (Edit)"**
2. Go to Body tab
3. Change the JSON (e.g., update name or add a skill)
4. Click **"Send"**
5. ✅ See updated portfolio

### Test 4: Verify Changes

1. Click **"Get Portfolio by ID"** again
2. Click **"Send"**
3. ✅ See your changes reflected!

---

## Common Tasks

### 🔄 Switch API Server

1. Click **Variables** tab (at collection level)
2. Change `BASE_URL`:
   ```
   Local:       http://localhost:8000
   Production:  https://api.myportfolio.com
   ```
3. All requests automatically use the new URL

### 📝 Customize Update Request

Before clicking Send on "Update Portfolio":

1. Click **Body** tab
2. Modify the JSON:
   - Change `"name"` to new name
   - Add/remove items in `"experiences"` array
   - Update `"skills"` list
   - etc.

### 💾 Save Response as Preset

After getting a response:
1. Click the response
2. Click **Save as Example**
3. Name it (e.g., "Successful Portfolio Response")
4. Later, you can click it to see expected format

### 🧪 Test Error Cases

**Upload with wrong file type:**
- Try uploading a .txt or .docx instead of PDF
- Expected: 400 error

**Get non-existent portfolio:**
- Change portfolio_id to `invalid-uuid`
- Click Send
- Expected: 404 error

**Upload oversized file:**
- Try uploading PDF > 10MB
- Expected: 400 error

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid file, wrong format) |
| 404 | Not found (portfolio doesn't exist) |
| 422 | Unprocessable entity (image-only PDF) |
| 500 | Server error (AI processing failed) |

---

## Troubleshooting

### ❌ "Cannot GET /health"

**Problem:** API not running

**Solution:**
```bash
cd backend
python3 -m uvicorn app.main:app --reload --port 8000
```

### ❌ "Connection refused"

**Problem:** Wrong BASE_URL or server not running

**Solution:** Check Variables → BASE_URL matches your server

### ❌ "Portfolio not found"

**Problem:** portfolio_id is wrong or expired

**Solution:** Upload a new resume to get a fresh portfolio_id

### ❌ "File exceeds 10 MB"

**Problem:** Your PDF is too large

**Solution:** Use a smaller resume PDF (under 10MB)

### ❌ "PDF is image-only"

**Problem:** Your PDF is scanned images, not text

**Solution:** Use a text-based PDF resume

---

## Example Payloads

### Minimal Update (Just Name)

```json
{
  "name": "New Name",
  "contact": {},
  "experiences": [],
  "education": [],
  "skills": [],
  "projects": [],
  "certifications": []
}
```

### Add New Experience

```json
{
  "name": "John Doe",
  "contact": { ... },
  "experiences": [
    {
      "company": "New Company",
      "title": "Senior Engineer",
      "start_date": "2023-01",
      "end_date": null,
      "description": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...]
}
```

---

## Tips & Tricks

💡 **Auto-fill portfolio_id:** After upload, portfolio_id is automatically saved. Just use `{{portfolio_id}}` in other requests.

💡 **Copy response to body:** Click response → copy → paste into next request's body to reuse structure.

💡 **Pretty-print JSON:** Click **{ }** icon in response area.

💡 **Save collections:** Click ... menu → Export → save for backup.

💡 **Share collection:** Export collection, share JSON file with team.

---

## Next Steps

1. ✅ Import collection into Postman
2. ✅ Start backend server
3. ✅ Run Health Check
4. ✅ Upload a test resume
5. ✅ Get portfolio data
6. ✅ Edit portfolio
7. 🎉 You're ready to test!
