import io
import pdfplumber

def extract_text(file_bytes: bytes) -> str:
    """Extract text from PDF bytes. Raises ValueError if PDF is image-only."""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            if not text.strip():
                raise ValueError("PDF appears to be image-only. Please use a text-based PDF.")
            return text
    except Exception as e:
        if "image-only" in str(e):
            raise
        raise ValueError(f"Failed to parse PDF: {str(e)}")
