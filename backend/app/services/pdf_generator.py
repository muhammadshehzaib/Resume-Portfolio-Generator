from playwright.async_api import async_playwright
from app.config import settings

async def generate_portfolio_pdf(portfolio_id: str, mode: str = "ats") -> bytes:
    """
    Renders the portfolio page or dedicated ATS CV view using headless Chromium and returns PDF bytes.
    mode: 'ats' (dedicated executive ATS single-column template) or 'web' (interactive web portfolio view)
    """
    if mode == "web":
        url = f"{settings.FRONTEND_URL}/portfolio/{portfolio_id}?preview=true"
    else:
        url = f"{settings.FRONTEND_URL}/portfolio/{portfolio_id}/ats-export"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            device_scale_factor=2,
        )

        page = await context.new_page()
        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(800)

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
