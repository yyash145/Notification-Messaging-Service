// html-to-image.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const htmlFiles = [
  "./Users/yyash145/Documents/Project/Notification/html/1.html",
  "./Users/yyash145/Documents/Project/Notification/html/2.html",
  "./Users/yyash145/Documents/Project/Notification/html/3.html",
  "./Users/yyash145/Documents/Project/Notification/html/4.html",
  "./Users/yyash145/Documents/Project/Notification/html/5.html",
  "./Users/yyash145/Documents/Project/Notification/html/6.html",
  "./Users/yyash145/Documents/Project/Notification/html/7.html",
  "./Users/yyash145/Documents/Project/Notification/html/8.html",
  "./Users/yyash145/Documents/Project/Notification/html/9.html",
  "./Users/yyash145/Documents/Project/Notification/html/10.html"
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (let i = 0; i < htmlFiles.length; i++) {
    const filePath = "file:///" + htmlFiles[i];
    await page.goto(filePath, { waitUntil: "load" });
    if(i===4){
      await page.setViewport({ width: 1280, height: 1600 });
    }else{
      await page.setViewport({ width: 1280, height: 720 });
    }
    await page.screenshot({
      path: `slide-${i + 1}.png`
    });
  }

  await browser.close();
})();
