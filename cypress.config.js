const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 15000,
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    blockHosts: [
      '*googlesyndication.com',
      '*doubleclick.net',
      '*google-analytics.com',
      '*googletagmanager.com',
      '*adroll.com',
    ],
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
