// set standard timestamp format
const timestamp = Date.now()

const fs = require('fs');
require('console');
//const output = fs.createWriteStream('./logs/fwbot_' + timestamp + '.log');
//const errlog = fs.createWriteStream(`./logs/error_${timestamp}.log`);
//const logger = new console.Console({ stdout: output, stderr: errlog });

require('dotenv').config();
const puppeteer = require('puppeteer');
const device = puppeteer.devices['Pixel 4'];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.emulate(device)
  // login
  await page.goto('https://welt2.freewar.de/freewar/index.php');
  await page.screenshot({path:`./screenshots/index_${timestamp}.png`, fullPage: true})
  await page.type('table.whitebg > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(2)', process.env.FW_USER)
  await page.type('table.whitebg > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > input:nth-child(2)', process.env.PW)
  console.info('FW_USER: ' + process.env.FW_USER)
  console.info('PW: ' + process.env.PW)
  await page.screenshot({path:`./screenshots/login_${timestamp}.png`, fullPage: true})
  await Promise.all([
    page.click('.loginsubmit'),
    page.waitForNavigation({
      waitUntil: 'networkidle0'
    })
  ])
  dumpFrameTree(page.mainFrame(), '')
  await page.screenshot({path:`./screenshots/loggedIn_${timestamp}.png`, fullPage: true})
  // log frames for debug
  // logger.log(page.frames())

  // if Position X: 103 Y: 117
  await page.goto('https://welt2.freewar.de/freewar/internal/main.php');
  await page.waitForSelector('td.areadescription > a:nth-child(6)', { visible: true })
  console.info('get oil at' + timestamp)
  await page.click('td.areadescription > a:nth-child(6)', { delay: 523 }) // Ölfässer mitnehmen
  await page.screenshot({path:`./screenshots/got_oil_${timestamp}.png`, fullPage: true})
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.info(frame.name() + indent + frame.url());
    for (const child of frame.childFrames()) {
      dumpFrameTree(child, indent + '  ');
    }
  }
})();