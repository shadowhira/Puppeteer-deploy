const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    // Truy cập trang cần scrape
    await page.goto("https://qldt.ptit.edu.vn/#/home", {
      waitUntil: "domcontentloaded",
    });

    // Đợi cho phần tử <small> xuất hiện
    const smallSelector = 'small.text-white.text-center.py-0.my-0';
    await page.waitForSelector(smallSelector);

    // Lấy innerText của phần tử <small>
    const innerText = await page.$eval(smallSelector, el => el.innerText);

    // Log ra console và gửi nội dung qua response
    console.log(`Extracted Text: ${innerText}`);
    res.send(`Extracted Text: ${innerText}`);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
