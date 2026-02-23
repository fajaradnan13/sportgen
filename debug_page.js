const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure().errorText));
    await page.goto('http://localhost:3001/?sport=volleyball');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
