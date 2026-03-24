"""
Comprehensive Test Suite for Resume-to-Portfolio Generator Backend APIs
Tests all endpoints with happy paths, error cases, and edge cases
Uses mocking for AI API calls to ensure tests are fast and deterministic
"""

import pytest
import json
import os
import tempfile
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.portfolio import Portfolio
from app.schemas.portfolio import ParsedResume


# ============================================================================
# TEST SETUP & FIXTURES
# ============================================================================

# Use file-based SQLite for testing (in-memory has issues with TestClient)
# Create a temporary directory for test database
test_db_dir = tempfile.mkdtemp()
TEST_DATABASE_URL = f"sqlite:///{test_db_dir}/test.db"

engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

# Create tables before test client
Base.metadata.create_all(bind=engine)
client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db():
    """Reset database before each test"""
    # Drop and recreate all tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up after test
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_resume_pdf():
    """Create a minimal valid PDF for testing"""
    pdf_content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(John Doe) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000301 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
395
%%EOF"""
    return pdf_content


@pytest.fixture
def sample_portfolio_data():
    """Sample parsed resume data"""
    return {
        "name": "John Doe",
        "contact": {
            "email": "john@example.com",
            "phone": "+1234567890",
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe",
            "website": "https://johndoe.com",
            "location": "San Francisco, CA"
        },
        "summary": "Experienced software engineer with 5+ years in full-stack development",
        "experiences": [
            {
                "company": "Tech Corp",
                "title": "Senior Developer",
                "start_date": "2021-01-01",
                "end_date": None,
                "description": ["Led team of 5 engineers", "Shipped 3 major features"]
            }
        ],
        "education": [
            {
                "institution": "University of California",
                "degree": "BS",
                "field": "Computer Science",
                "graduation_year": "2018",
                "gpa": "3.8"
            }
        ],
        "skills": ["Python", "React", "PostgreSQL", "AWS"],
        "projects": [
            {
                "name": "Portfolio Generator",
                "description": "AI-powered resume to portfolio converter",
                "technologies": ["Python", "FastAPI", "React"],
                "url": "https://github.com/example/portfolio"
            }
        ],
        "certifications": ["AWS Solutions Architect", "Google Cloud Professional"]
    }


@pytest.fixture
def mock_ai_extractor():
    """Mock the AI extractor service"""
    with patch('app.services.ai_extractor.extract') as mock:
        mock.return_value = ParsedResume(
            name="John Doe",
            contact={
                "email": "john@example.com",
                "phone": "+1234567890",
                "linkedin": "https://linkedin.com/in/johndoe",
                "github": "https://github.com/johndoe",
                "website": None,
                "location": "San Francisco, CA"
            },
            summary="Experienced software engineer with 5+ years in full-stack development",
            experiences=[
                {
                    "company": "Tech Corp",
                    "title": "Senior Developer",
                    "start_date": "2021-01-01",
                    "end_date": None,
                    "description": ["Led team of 5 engineers", "Shipped 3 major features"]
                }
            ],
            education=[
                {
                    "institution": "University of California",
                    "degree": "BS",
                    "field": "Computer Science",
                    "graduation_year": "2018",
                    "gpa": "3.8"
                }
            ],
            skills=["Python", "React", "PostgreSQL", "AWS"],
            projects=[
                {
                    "name": "Portfolio Generator",
                    "description": "AI-powered resume to portfolio converter",
                    "technologies": ["Python", "FastAPI", "React"],
                    "url": "https://github.com/example/portfolio"
                }
            ],
            certifications=["AWS Solutions Architect"]
        )
        yield mock


@pytest.fixture
def mock_ats_scorer():
    """Mock the ATS scorer service"""
    with patch('app.services.ats_scorer.score') as mock:
        # Create mock object with score and feedback attributes
        mock_result = MagicMock()
        mock_result.score = 85
        mock_result.feedback = ["Strong resume with relevant skills and experience", "Good technical background"]

        async def async_score(*args, **kwargs):
            return mock_result

        mock.side_effect = async_score
        yield mock


@pytest.fixture
def mock_tailor_service():
    """Mock the tailor service"""
    with patch('app.services.tailor_service.tailor') as mock:
        async def mock_tailor(*args, **kwargs):
            return {
                "tailored_summary": "Tailored summary for the job",
                "highlighted_skills": ["Python", "React"],
                "skill_match_notes": "Strong match for the role"
            }
        mock.side_effect = mock_tailor
        yield mock


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

class TestHealthCheck:
    """Tests for GET /health endpoint"""

    def test_health_check_success(self):
        """Test that health check endpoint returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


# ============================================================================
# UPLOAD ENDPOINT - POST /api/upload
# ============================================================================

class TestUploadResume:
    """Tests for POST /api/upload endpoint"""

    def test_upload_valid_pdf_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful PDF upload and resume parsing"""
        response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "id" in data
        assert "parsed_data" in data
        assert "ats_score" in data
        assert "ats_feedback" in data
        assert "template" in data
        assert data["template"] == "minimal"  # Default template

    def test_upload_non_pdf_file_rejected(self):
        """Test that non-PDF files are rejected"""
        response = client.post(
            "/api/upload",
            files={"file": ("resume.txt", b"Plain text resume", "text/plain")}
        )
        assert response.status_code == 400
        assert "PDF" in response.json()["detail"]

    def test_upload_oversized_file_rejected(self):
        """Test that files over 10MB are rejected"""
        large_data = b"x" * (11 * 1024 * 1024)
        response = client.post(
            "/api/upload",
            files={"file": ("large.pdf", large_data, "application/pdf")}
        )
        assert response.status_code == 400
        assert "exceeds" in response.json()["detail"].lower()

    def test_upload_no_file_provided(self):
        """Test that upload fails when no file is provided"""
        response = client.post("/api/upload", files={})
        assert response.status_code == 400

    def test_upload_creates_portfolio_in_database(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that upload creates a portfolio record in database"""
        response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = response.json()["id"]

        # Verify portfolio exists in database
        db = TestingSessionLocal()
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        assert portfolio is not None
        assert portfolio.view_count == 0
        db.close()

    def test_upload_returns_ats_score(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that upload includes ATS score"""
        response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        data = response.json()
        assert isinstance(data["ats_score"], int)
        assert 0 <= data["ats_score"] <= 100


# ============================================================================
# GET PORTFOLIO ENDPOINT - GET /api/portfolio/{id}
# ============================================================================

class TestGetPortfolio:
    """Tests for GET /api/portfolio/{id} endpoint"""

    def test_get_portfolio_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful portfolio retrieval"""
        # Create a portfolio
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Retrieve it
        response = client.get(f"/api/portfolio/{portfolio_id}")
        assert response.status_code == 200
        assert response.json()["id"] == portfolio_id

    def test_get_nonexistent_portfolio_returns_404(self):
        """Test that getting a non-existent portfolio returns 404"""
        response = client.get("/api/portfolio/nonexistent-id")
        assert response.status_code == 404

    def test_get_portfolio_increments_view_count(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that viewing a portfolio increments view count"""
        # Create portfolio
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # View it
        response1 = client.get(f"/api/portfolio/{portfolio_id}")
        assert response1.json()["view_count"] == 1

        # View again
        response2 = client.get(f"/api/portfolio/{portfolio_id}")
        assert response2.json()["view_count"] == 2

    def test_get_portfolio_returns_all_fields(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that portfolio response includes all required fields"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.get(f"/api/portfolio/{portfolio_id}")
        data = response.json()

        assert "id" in data
        assert "parsed_data" in data
        assert "ats_score" in data
        assert "view_count" in data
        assert "template" in data
        assert "slug" in data
        assert "custom_colors" in data


# ============================================================================
# UPDATE PORTFOLIO ENDPOINT - PATCH /api/portfolio/{id}
# ============================================================================

class TestUpdatePortfolio:
    """Tests for PATCH /api/portfolio/{id} endpoint"""

    def test_update_portfolio_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful portfolio update"""
        # Create portfolio
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Update it
        new_data = upload_response.json()["parsed_data"]
        new_data["summary"] = "Updated summary"

        response = client.patch(f"/api/portfolio/{portfolio_id}", json=new_data)
        assert response.status_code == 200
        assert response.json()["parsed_data"]["summary"] == "Updated summary"

    def test_update_nonexistent_portfolio_returns_404(self, sample_portfolio_data):
        """Test updating non-existent portfolio returns 404"""
        response = client.patch("/api/portfolio/nonexistent", json=sample_portfolio_data)
        assert response.status_code == 404

    def test_update_portfolio_preserves_id(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that portfolio ID is preserved during update"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        new_data = upload_response.json()["parsed_data"]
        response = client.patch(f"/api/portfolio/{portfolio_id}", json=new_data)
        assert response.json()["id"] == portfolio_id

    def test_update_portfolio_partial_update(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test partial update of portfolio"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        new_data = upload_response.json()["parsed_data"]
        new_data["skills"] = ["Python", "JavaScript", "Go"]

        response = client.patch(f"/api/portfolio/{portfolio_id}", json=new_data)
        assert response.json()["parsed_data"]["skills"] == ["Python", "JavaScript", "Go"]


# ============================================================================
# UPLOAD PHOTO ENDPOINT - POST /api/portfolio/{id}/photo
# ============================================================================

class TestUploadPhoto:
    """Tests for POST /api/portfolio/{id}/photo endpoint"""

    def test_upload_jpg_photo_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful JPG photo upload"""
        # Create portfolio
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Simple JPG header
        jpg_data = b'\xFF\xD8\xFF\xE0\x00\x10JFIF' + b'\x00' * 100
        response = client.post(
            f"/api/portfolio/{portfolio_id}/photo",
            files={"file": ("photo.jpg", jpg_data, "image/jpeg")}
        )
        assert response.status_code == 200

    def test_upload_png_photo_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful PNG photo upload"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # PNG header
        png_data = b'\x89PNG\r\n\x1a\n' + b'\x00' * 100
        response = client.post(
            f"/api/portfolio/{portfolio_id}/photo",
            files={"file": ("photo.png", png_data, "image/png")}
        )
        assert response.status_code == 200

    def test_upload_invalid_image_format_rejected(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that invalid image formats are rejected"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.post(
            f"/api/portfolio/{portfolio_id}/photo",
            files={"file": ("photo.gif", b"GIF89a", "image/gif")}
        )
        assert response.status_code == 400

    def test_upload_oversized_photo_rejected(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that oversized photos are rejected"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        large_photo = b'\xFF\xD8\xFF\xE0' + b'\x00' * (6 * 1024 * 1024)
        response = client.post(
            f"/api/portfolio/{portfolio_id}/photo",
            files={"file": ("large.jpg", large_photo, "image/jpeg")}
        )
        assert response.status_code == 400

    def test_upload_photo_nonexistent_portfolio(self):
        """Test uploading photo to non-existent portfolio"""
        png_data = b'\x89PNG\r\n\x1a\n' + b'\x00' * 100
        response = client.post(
            "/api/portfolio/nonexistent/photo",
            files={"file": ("photo.png", png_data, "image/png")}
        )
        assert response.status_code == 404


# ============================================================================
# UPDATE SETTINGS ENDPOINT - PATCH /api/portfolio/{id}/settings
# ============================================================================

class TestUpdateSettings:
    """Tests for PATCH /api/portfolio/{id}/settings endpoint"""

    def test_update_template_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful template update"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"template": "modern"}
        )
        assert response.status_code == 200
        assert response.json()["template"] == "modern"

    def test_update_custom_colors_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful custom colors update"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={
                "custom_colors": {
                    "primary": "#FF5733",
                    "secondary": "#3366FF"
                }
            }
        )
        assert response.status_code == 200
        assert response.json()["custom_colors"]["primary"] == "#FF5733"

    def test_update_slug_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful slug update"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "john-doe-portfolio"}
        )
        assert response.status_code == 200
        assert response.json()["slug"] == "john-doe-portfolio"

    def test_invalid_slug_format_rejected(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that invalid slug format is rejected"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "Invalid Slug!"}
        )
        assert response.status_code == 422

    def test_duplicate_slug_rejected(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that duplicate slug is rejected"""
        # Create first portfolio
        upload_response1 = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id1 = upload_response1.json()["id"]

        # Create second portfolio
        upload_response2 = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id2 = upload_response2.json()["id"]

        # Set first portfolio's slug
        client.patch(
            f"/api/portfolio/{portfolio_id1}/settings",
            json={"slug": "test-slug"}
        )

        # Try to set second portfolio to same slug
        response = client.patch(
            f"/api/portfolio/{portfolio_id2}/settings",
            json={"slug": "test-slug"}
        )
        assert response.status_code == 409


# ============================================================================
# GET METADATA ENDPOINTS
# ============================================================================

class TestGetPortfolioMetadata:
    """Tests for GET /api/portfolio/{id}/meta endpoint"""

    def test_get_metadata_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test successful metadata retrieval"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.get(f"/api/portfolio/{portfolio_id}/meta")
        assert response.status_code == 200

    def test_metadata_does_not_increment_view_count(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that metadata endpoint does not increment view count"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Call metadata endpoint
        response1 = client.get(f"/api/portfolio/{portfolio_id}/meta")
        count1 = response1.json()["view_count"]

        # Call metadata endpoint again
        response2 = client.get(f"/api/portfolio/{portfolio_id}/meta")
        count2 = response2.json()["view_count"]

        assert count1 == count2 == 0


# ============================================================================
# TAILOR PORTFOLIO ENDPOINT - POST /api/portfolio/{id}/tailor
# ============================================================================

class TestTailorPortfolio:
    """Tests for POST /api/portfolio/{id}/tailor endpoint"""

    def test_tailor_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer, mock_tailor_service):
        """Test successful portfolio tailoring"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.post(
            f"/api/portfolio/{portfolio_id}/tailor",
            json={"job_description": "Looking for a Python developer"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "tailored_summary" in data
        assert "highlighted_skills" in data
        assert "skill_match_notes" in data

    def test_tailor_empty_job_description(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test tailoring with empty job description"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.post(
            f"/api/portfolio/{portfolio_id}/tailor",
            json={"job_description": ""}
        )
        assert response.status_code in [400, 422]

    def test_tailor_nonexistent_portfolio_returns_404(self):
        """Test tailoring non-existent portfolio"""
        response = client.post(
            "/api/portfolio/nonexistent/tailor",
            json={"job_description": "Job description"}
        )
        assert response.status_code == 404

    def test_tailor_missing_job_description(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test tailoring without job description field"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        response = client.post(
            f"/api/portfolio/{portfolio_id}/tailor",
            json={}
        )
        assert response.status_code == 422

    def test_tailor_does_not_modify_portfolio(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer, mock_tailor_service):
        """Test that tailoring doesn't modify the portfolio without user action"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]
        original_summary = upload_response.json()["parsed_data"]["summary"]

        # Tailor the portfolio
        client.post(
            f"/api/portfolio/{portfolio_id}/tailor",
            json={"job_description": "Looking for a Python developer"}
        )

        # Verify portfolio wasn't modified
        response = client.get(f"/api/portfolio/{portfolio_id}")
        assert response.json()["parsed_data"]["summary"] == original_summary


# ============================================================================
# GET PORTFOLIO BY SLUG ENDPOINT
# ============================================================================

class TestGetPortfolioBySlug:
    """Tests for GET /api/p/{slug} endpoint"""

    def test_get_by_slug_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test getting portfolio by slug"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Set slug
        client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-portfolio"}
        )

        response = client.get("/api/p/test-portfolio")
        assert response.status_code == 200

    def test_get_by_nonexistent_slug_returns_404(self):
        """Test getting portfolio by non-existent slug"""
        response = client.get("/api/p/nonexistent-slug")
        assert response.status_code == 404

    def test_get_by_slug_increments_view_count(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that getting by slug increments view count"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Set slug
        client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-portfolio"}
        )

        # Get by slug
        response1 = client.get("/api/p/test-portfolio")
        assert response1.json()["view_count"] == 1

        # Get by slug again
        response2 = client.get("/api/p/test-portfolio")
        assert response2.json()["view_count"] == 2

    def test_slug_case_sensitive(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that slug lookup is case-sensitive"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Set slug with lowercase
        client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-portfolio"}
        )

        # Try uppercase slug
        response = client.get("/api/p/Test-Portfolio")
        assert response.status_code == 404


# ============================================================================
# GET SLUG METADATA ENDPOINT
# ============================================================================

class TestGetSlugMetadata:
    """Tests for GET /api/p/{slug}/meta endpoint"""

    def test_get_slug_metadata_success(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test getting slug metadata"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-portfolio"}
        )

        response = client.get("/api/p/test-portfolio/meta")
        assert response.status_code == 200

    def test_slug_metadata_does_not_increment_view_count(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test that slug metadata doesn't increment view count"""
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-portfolio"}
        )

        response1 = client.get("/api/p/test-portfolio/meta")
        count1 = response1.json()["view_count"]

        response2 = client.get("/api/p/test-portfolio/meta")
        count2 = response2.json()["view_count"]

        assert count1 == count2 == 0


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestIntegration:
    """Integration tests for complete workflows"""

    def test_complete_portfolio_workflow(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer):
        """Test complete workflow: upload -> view -> update -> set slug -> view by slug"""
        # Upload
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        assert upload_response.status_code == 200
        portfolio_id = upload_response.json()["id"]

        # Get portfolio (increment view count)
        get_response = client.get(f"/api/portfolio/{portfolio_id}")
        assert get_response.json()["view_count"] == 1

        # Update portfolio
        new_data = get_response.json()["parsed_data"]
        new_data["summary"] = "New summary"
        update_response = client.patch(f"/api/portfolio/{portfolio_id}", json=new_data)
        assert update_response.status_code == 200

        # Update settings with slug
        settings_response = client.patch(
            f"/api/portfolio/{portfolio_id}/settings",
            json={"slug": "test-slug"}
        )
        assert settings_response.status_code == 200

        # Get by slug
        slug_response = client.get("/api/p/test-slug")
        assert slug_response.status_code == 200
        assert slug_response.json()["view_count"] == 2

    def test_tailor_and_apply_workflow(self, sample_resume_pdf, mock_ai_extractor, mock_ats_scorer, mock_tailor_service):
        """Test workflow: upload -> tailor -> apply changes"""
        # Upload
        upload_response = client.post(
            "/api/upload",
            files={"file": ("resume.pdf", sample_resume_pdf, "application/pdf")}
        )
        portfolio_id = upload_response.json()["id"]

        # Tailor
        tailor_response = client.post(
            f"/api/portfolio/{portfolio_id}/tailor",
            json={"job_description": "Looking for a Python developer with 5+ years"}
        )
        assert tailor_response.status_code == 200
        tailored_data = tailor_response.json()

        # Apply changes
        current_portfolio = client.get(f"/api/portfolio/{portfolio_id}").json()
        updated_data = current_portfolio["parsed_data"]
        updated_data["summary"] = tailored_data["tailored_summary"]
        updated_data["skills"] = tailored_data["highlighted_skills"]

        apply_response = client.patch(f"/api/portfolio/{portfolio_id}", json=updated_data)
        assert apply_response.status_code == 200
        assert apply_response.json()["parsed_data"]["summary"] == tailored_data["tailored_summary"]
