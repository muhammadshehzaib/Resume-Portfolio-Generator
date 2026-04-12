from playwright.async_api import async_playwright
from app.config import settings

async def generate_portfolio_pdf(portfolio_id: str) -> bytes:
    """
    Renders the portfolio page using a headless browser and returns the PDF bytes.
    """
    # The URL that Playwright will visit
    # We use the preview-compatible URL or a specific print route if available
    # For now, we visit the public portfolio page which has print styles
    url = f"{settings.FRONTEND_URL}/portfolio/{portfolio_id}?preview=true"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Create a browser context with a larger screen to ensure good rendering
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            device_scale_factor=2,
        )
        
        page = await context.new_page()
        
        # Navigate and wait for content to load
        # 'networkidle' is a good signal for Next.js apps
        await page.goto(url, wait_until="networkidle")
        
        # Give a small extra delay for any animations to finish
        await page.wait_for_timeout(1000)
        
        # Generate the PDF
        # We use emulate_media(media="print") to trigger @media print styles
        await page.emulate_media(media="print")
        
        pdf_bytes = await page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"},
            display_header_footer=False,
            prefer_css_page_size=True
        )
        
        await browser.close()
        return pdf_bytes
