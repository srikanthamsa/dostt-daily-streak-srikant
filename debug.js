import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000/dostt-daily-streak-srikant/');
  console.log('Page loaded');
  
  // Wait for the button and click it
  await page.waitForSelector('.primary-btn');
  await page.click('.primary-btn');
  console.log('Clicked open box');

  // Wait 2 seconds for animation
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  if (content.includes('Awesome!')) {
    console.log('Reward overlay successfully rendered!');
  } else {
    console.log('Error: Reward overlay not found. Screen might be blank.');
  }

  await browser.close();
})();
