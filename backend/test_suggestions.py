"""
Tests for AI-powered portfolio suggestions feature.
Tests the suggestion service and the suggestions API endpoint.
Note: AI API calls are mocked to avoid actual API costs and ensure deterministic tests.
"""

import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from app.models.portfolio import Portfolio
from sqlalchemy.orm import Session
from app.schemas.portfolio import SuggestionResult

# Use file-based SQLite for testing (in-memory has issues with TestClient)
import tempfile
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

test_db_dir = tempfile.mkdtemp()
TEST_DATABASE_URL = f"sqlite:///{test_db_dir}/test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = SessionLocal()
    try:
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

# Test data
MOCK_PORTFOLIO_DATA = {
    "name": "John Doe",
    "summary": "Experienced developer",
    "experience_count": 2,
    "experiences": [
        "Senior Developer at TechCorp: Led team, improved performance",
        "Junior Developer at StartupXYZ: Worked on frontend"
    ],
    "education": [
        "BS Computer Science from University of Example"
    ],
    "skills": "Python, JavaScript, React, SQL",
    "projects": ["Portfolio App", "E-commerce Platform"],
    "has_photo": True,
    "available_for_hire": True,
    "ats_score": 72,
}

MOCK_SUGGESTION_RESULT = {
    "issues": [
        "Experience descriptions lack specific metrics",
        "Missing quantified achievements"
    ],
    "improvements": [
        "Add specific numbers to achievements (e.g., 'Reduced load time by 40%')",
        "Include 3-5 more technical keywords for better ATS matching",
        "Expand project descriptions with outcomes"
    ],
    "positives": [
        "Good diverse skill set",
        "Clear contact information provided"
    ],
    "overall_score": 72
}


class TestSuggestionService:
    """Test the suggestion_service module."""

    @pytest.mark.asyncio
    @patch('app.services.suggestion_service.client.chat.completions.create')
    async def test_analyze_portfolio_success(self, mock_ai_call):
        """Test successful portfolio analysis."""
        from app.services import suggestion_service

        # Mock the AI response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps(MOCK_SUGGESTION_RESULT)
        mock_ai_call.return_value = mock_response

        result = await suggestion_service.analyze(MOCK_PORTFOLIO_DATA)

        assert isinstance(result, SuggestionResult)
        assert result.overall_score == 72
        assert len(result.issues) == 2
        assert len(result.improvements) == 3
        assert len(result.positives) == 2
        assert "metrics" in result.issues[0].lower()

    @pytest.mark.asyncio
    @patch('app.services.suggestion_service.client.chat.completions.create')
    async def test_analyze_with_invalid_json_response(self, mock_ai_call):
        """Test handling of invalid JSON response from AI."""
        from app.services import suggestion_service

        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Not valid JSON"
        mock_ai_call.return_value = mock_response

        with pytest.raises(ValueError, match="AI returned invalid JSON"):
            await suggestion_service.analyze(MOCK_PORTFOLIO_DATA)

    @pytest.mark.asyncio
    @patch('app.services.suggestion_service.client.chat.completions.create')
    async def test_analyze_with_ai_error(self, mock_ai_call):
        """Test handling of AI service errors."""
        from app.services import suggestion_service

        mock_ai_call.side_effect = Exception("AI service unavailable")

        with pytest.raises(ValueError, match="Analysis failed"):
            await suggestion_service.analyze(MOCK_PORTFOLIO_DATA)

    @pytest.mark.asyncio
    @patch('app.services.suggestion_service.client.chat.completions.create')
    async def test_analyze_with_empty_portfolio_data(self, mock_ai_call):
        """Test analysis with minimal portfolio data."""
        from app.services import suggestion_service

        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        minimal_result = {
            "issues": ["Portfolio is very sparse"],
            "improvements": ["Add more content"],
            "positives": [],
            "overall_score": 20
        }
        mock_response.choices[0].message.content = json.dumps(minimal_result)
        mock_ai_call.return_value = mock_response

        empty_data = {
            "name": "John",
            "summary": "",
            "experience_count": 0,
            "experiences": [],
            "education": [],
            "skills": "",
            "projects": [],
            "has_photo": False,
            "available_for_hire": False,
            "ats_score": 20,
        }

        result = await suggestion_service.analyze(empty_data)

        assert result.overall_score == 20
        assert len(result.issues) == 1
        assert result.overall_score < 50  # Low score expected


class TestSuggestionsEndpoint:
    """Test the suggestions API endpoint."""

    @pytest.fixture
    def auth_header(self):
        """Create a test user and return auth header."""
        return {"Authorization": "Bearer test-user-123"}

    @pytest.fixture
    def test_portfolio(self, auth_header):
        """Create a test portfolio in the database."""
        db = SessionLocal()
        portfolio = Portfolio(
            id="test-portfolio-id",
            user_id="test-user-123",
            raw_text="Test resume content",
            parsed_data=json.dumps({
                "name": "John Doe",
                "contact": {"email": "john@example.com"},
                "summary": "Experienced developer",
                "experiences": [
                    {
                        "company": "TechCorp",
                        "title": "Senior Developer",
                        "start_date": "2020-01",
                        "description": ["Led team", "Improved performance"]
                    }
                ],
                "education": [
                    {
                        "institution": "University",
                        "degree": "BS Computer Science",
                        "graduation_year": "2020"
                    }
                ],
                "skills": ["Python", "JavaScript", "React"],
                "projects": [],
                "certifications": []
            }),
            ats_score=72,
            ats_feedback=json.dumps(["Good structure", "Missing metrics"]),
            template="minimal",
            photo_url="https://example.com/photo.jpg",
            available_for_hire=True,
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
        return portfolio

    @patch('app.services.suggestion_service.client.chat.completions.create')
    def test_get_suggestions_success(self, mock_ai_call, test_portfolio, auth_header):
        """Test successful suggestions retrieval."""
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps(MOCK_SUGGESTION_RESULT)
        mock_ai_call.return_value = mock_response

        response = client.post(
            f"/api/portfolio/{test_portfolio.id}/suggestions",
            headers=auth_header
        )

        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data
        assert "issues" in data
        assert "improvements" in data
        assert "positives" in data
        assert isinstance(data["overall_score"], int)
        assert 1 <= data["overall_score"] <= 100

    def test_get_suggestions_portfolio_not_found(self, auth_header):
        """Test suggestions request for non-existent portfolio."""
        response = client.post(
            "/api/portfolio/nonexistent-id/suggestions",
            headers=auth_header
        )

        assert response.status_code == 404

    def test_get_suggestions_unauthorized(self, test_portfolio):
        """Test suggestions request without authentication."""
        response = client.post(f"/api/portfolio/{test_portfolio.id}/suggestions")

        assert response.status_code == 401

    def test_get_suggestions_forbidden_wrong_user(self, test_portfolio):
        """Test suggestions request by user who doesn't own the portfolio."""
        wrong_auth_header = {"Authorization": "Bearer different-user"}

        response = client.post(
            f"/api/portfolio/{test_portfolio.id}/suggestions",
            headers=wrong_auth_header
        )

        assert response.status_code == 403

    @patch('app.services.suggestion_service.client.chat.completions.create')
    def test_get_suggestions_ai_failure(self, mock_ai_call, test_portfolio, auth_header):
        """Test suggestions endpoint when AI service fails."""
        mock_ai_call.side_effect = Exception("AI service error")

        response = client.post(
            f"/api/portfolio/{test_portfolio.id}/suggestions",
            headers=auth_header
        )

        assert response.status_code == 500
        assert "AI analysis failed" in response.json()["detail"]

    @patch('app.services.suggestion_service.client.chat.completions.create')
    def test_suggestions_includes_all_portfolio_data(self, mock_ai_call, test_portfolio, auth_header):
        """Test that suggestions endpoint includes all relevant portfolio data."""
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps(MOCK_SUGGESTION_RESULT)
        mock_ai_call.return_value = mock_response

        response = client.post(
            f"/api/portfolio/{test_portfolio.id}/suggestions",
            headers=auth_header
        )

        assert response.status_code == 200

        # Verify the AI was called with the right data structure
        assert mock_ai_call.called
        call_args = mock_ai_call.call_args
        messages = call_args[1]["messages"]
        user_message = messages[1]["content"]

        # Check that key portfolio data is in the prompt
        assert "John Doe" in user_message
        assert "Senior Developer" in user_message
        assert "72" in user_message  # ATS score

    @patch('app.services.suggestion_service.client.chat.completions.create')
    def test_suggestions_score_ranges(self, mock_ai_call, test_portfolio, auth_header):
        """Test that scores are properly validated."""
        test_cases = [
            {"score": 1, "valid": True},    # Minimum valid
            {"score": 50, "valid": True},   # Middle
            {"score": 100, "valid": True},  # Maximum valid
            {"score": 0, "valid": False},   # Below minimum
            {"score": 101, "valid": False}, # Above maximum
        ]

        for case in test_cases:
            result_data = MOCK_SUGGESTION_RESULT.copy()
            result_data["overall_score"] = case["score"]

            mock_response = MagicMock()
            mock_response.choices = [MagicMock()]
            mock_response.choices[0].message.content = json.dumps(result_data)
            mock_ai_call.return_value = mock_response

            response = client.post(
                f"/api/portfolio/{test_portfolio.id}/suggestions",
                headers=auth_header
            )

            if case["valid"]:
                assert response.status_code == 200
            else:
                # Should fail validation with 422 or 500
                assert response.status_code in [422, 500]


class TestSuggestionsIntegration:
    """Integration tests for the suggestions feature."""

    @pytest.fixture
    def auth_header(self):
        return {"Authorization": "Bearer integration-test-user"}

    @pytest.fixture
    def full_portfolio(self, auth_header):
        """Create a comprehensive test portfolio."""
        db = SessionLocal()
        portfolio = Portfolio(
            id="integration-test-portfolio",
            user_id="integration-test-user",
            raw_text="Full resume with all sections",
            parsed_data=json.dumps({
                "name": "Jane Smith",
                "contact": {
                    "email": "jane@example.com",
                    "phone": "555-0123",
                    "linkedin": "linkedin.com/in/janesmith",
                    "github": "github.com/janesmith",
                    "website": "janesmith.com"
                },
                "summary": "Full-stack developer with 5 years of experience",
                "experiences": [
                    {
                        "company": "BigTech",
                        "title": "Senior Engineer",
                        "start_date": "2022-01",
                        "description": [
                            "Led team of 5 engineers",
                            "Increased performance by 60%",
                            "Mentored 3 junior developers"
                        ]
                    },
                    {
                        "company": "StartupABC",
                        "title": "Full-stack Developer",
                        "start_date": "2019-06",
                        "end_date": "2021-12",
                        "description": [
                            "Built scalable backend",
                            "Deployed 10+ features"
                        ]
                    }
                ],
                "education": [
                    {
                        "institution": "Top University",
                        "degree": "BS Computer Science",
                        "field": "Artificial Intelligence",
                        "graduation_year": "2019"
                    }
                ],
                "skills": ["Python", "JavaScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
                "projects": [
                    {
                        "name": "ML Pipeline",
                        "description": "Automated data processing",
                        "technologies": ["Python", "TensorFlow"]
                    }
                ],
                "certifications": ["AWS Solutions Architect"]
            }),
            ats_score=85,
            ats_feedback=json.dumps(["Strong technical skills", "Good achievements"]),
            template="modern",
            photo_url="https://example.com/jane-photo.jpg",
            custom_colors=json.dumps({"primaryColor": "#3b82f6", "bgColor": "#ffffff"}),
            dark_mode=False,
            available_for_hire=True,
            slug="jane-smith",
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
        return portfolio

    @patch('app.services.suggestion_service.client.chat.completions.create')
    def test_full_suggestions_workflow(self, mock_ai_call, full_portfolio, auth_header):
        """Test complete workflow: analyze comprehensive portfolio."""
        expected_result = {
            "issues": [],
            "improvements": [
                "Consider adding AWS certifications section",
                "Add GitHub repository links to projects"
            ],
            "positives": [
                "Excellent technical skills coverage",
                "Strong quantified achievements",
                "Good variety of experience levels",
                "Complete contact information"
            ],
            "overall_score": 88
        }

        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps(expected_result)
        mock_ai_call.return_value = mock_response

        response = client.post(
            f"/api/portfolio/{full_portfolio.id}/suggestions",
            headers=auth_header
        )

        assert response.status_code == 200
        data = response.json()

        assert data["overall_score"] == 88
        assert len(data["positives"]) == 4
        assert len(data["improvements"]) == 2
        assert len(data["issues"]) == 0  # Strong portfolio has no critical issues
