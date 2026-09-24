import './commands';

// DemoQA injects noisy 3rd-party ad trackers and GTM scripts that throw uncaught errors
Cypress.on('uncaught:exception', () => false);
