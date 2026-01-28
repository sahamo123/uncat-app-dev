const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER_ERROR:', err.message));

    try {
        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        const content = await page.content();
        console.log('Page content length:', content.length);
    } catch (e) {
        console.error('Navigation failed:', e.message);
    }

    await browser.close();
})();
