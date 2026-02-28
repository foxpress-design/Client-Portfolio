const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const sites = [
  { name: 'listenablemusic', url: 'http://listenablemusic.ca' },
  { name: 'cabinetcraft',    url: 'http://glhiholdings.ca' },
  { name: 'mayabastian',     url: 'http://mayabastian.com' },
  { name: 'foodbank',        url: 'http://hastingsfoodbank.foxpress.io' },
  { name: 'anpl',            url: 'http://staging.anpl.org' },
  { name: 'subfolder',       url: 'https://subfolder.app' },
];

const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });

  for (const site of sites) {
    console.log(`Screenshotting ${site.url}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    try {
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 1000));
      const outPath = path.join(outDir, `${site.name}.jpg`);
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1280, height: 900 } });
      console.log(`  -> saved ${outPath}`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done.');
})();
