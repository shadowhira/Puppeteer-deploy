// puppeteerController.js
const pt = require("puppeteer");
const minimal_args = require("./constant/minimalArgs");
require("dotenv").config();

// Import các module cần thiết
const { login } = require("./modules/loginModule"); // Import hàm đăng nhập
const { crawlXemHocPhi } = require("./modules/crawlXemHocPhi"); // Import hàm lấy điểm
const { default: puppeteer } = require("puppeteer");

// Khởi tạo browser và thực hiện các thao tác
async function crawlHocPhi(res) {
  const browser = await pt.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: true,  // Đổi lại thành true khi deploy để tiết kiệm tài nguyên
    args: minimal_args,
    userDataDir: "./path/to/cache/resource",
  });

  const page = await browser.newPage();
//   // Kiểm tra và thực hiện hành động trên trang nếu trang chưa bị đóng
// if (!page.isClosed()) {
//   await page.setViewport({ width: 1500, height: 800 });
// }

  // Chặn các tài nguyên không cần thiết như ảnh, font, media, stylesheet
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    if (["image", "media"].includes(resourceType)) {
      request.abort(); // Chặn các tài nguyên không cần thiết
    } else {
      request.continue();
    }
  });

  // Launch URL
  await page.goto("https://qldt.ptit.edu.vn/#/home", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Gọi hàm đăng nhập từ module loginModule
  await login(page);

  // Gọi hàm để lấy điểm
  const result = await crawlXemHocPhi(page); // Gọi hàm từ module lấy điểm

  res.send(result); // Gửi kết quả về client

  // Close the browser
  await browser.close();
}

// Xuất hàm để sử dụng ở nơi khác
module.exports = {
  crawlHocPhi,
};
