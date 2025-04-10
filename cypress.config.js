const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require('path');
const downloadDir = "D:/test";

module.exports = defineConfig({
  e2e: {
    env: {
      downloadDir,
    },
    chromeWebSecurity: false,
    pageLoadTimeout: 180000,
    downloadsFolder: downloadDir,
    setupNodeEvents(on, config) {
      on("task", {
        readListUrl() {
          const content = fs.readFileSync(path.resolve('cypress/downloads/listUrl.txt'), 'utf8');
          return content
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        },
        isCrdownloadStarted(dirPath) {
          const files = fs.readdirSync(dirPath);
          return files.some(file => file.endsWith('.crdownload'));
        },
        isDownloadFinished(dirPath) {
          const files = fs.readdirSync(dirPath);
          return !files.some(file => file.endsWith(".crdownload"));
        }
      });
    },
  },
});
