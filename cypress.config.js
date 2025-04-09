const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require('path');

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    pageLoadTimeout: 180000,
    downloadsFolder: "D:/test",
    // downloadsFolder: "E:/Workspace/Projects/2. FeelsyncSystem/Edit Images/1. Raw Images/Thang 3/test",
    setupNodeEvents(on, config) {
      // 🧪 Kiểm tra file tải xong (không còn .crdownload)
      on("task", {
          readSetIds() {
            const content = fs.readFileSync(path.resolve('cypress/fixtures/setId.txt'), 'utf8');
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
