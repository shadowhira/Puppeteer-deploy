const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();
const {crawlHocPhi} = require("./crawl");

require('dotenv').config();
process.env.NODE_ENV === "production"

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/crawl", (req, res) => {
  crawlHocPhi(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
