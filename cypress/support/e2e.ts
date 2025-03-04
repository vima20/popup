// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide XHR requests from command log
const app = window.top;
if (app) {
  app.console.log = () => {};
}

// Add custom commands for extension testing
Cypress.Commands.add('loadExtension', () => {
  cy.window().then((win) => {
    // Mock chrome extension API
    win.chrome = {
      runtime: {
        sendMessage: cy.stub().as('sendMessage'),
        onMessage: {
          addListener: cy.stub().as('addMessageListener'),
        },
      },
      tabs: {
        query: cy.stub().as('queryTabs'),
      },
    };
  });
});

// Add custom commands for keyboard shortcuts
Cypress.Commands.add('pressKeyCombination', (key: string, modifier: string = '') => {
  const event = new KeyboardEvent('keydown', {
    key,
    ctrlKey: modifier === 'ctrl',
    shiftKey: modifier === 'shift',
    altKey: modifier === 'alt',
    metaKey: modifier === 'meta',
    bubbles: true,
  });
  cy.document().then((doc) => {
    doc.dispatchEvent(event);
  });
});

// Add custom commands for checking overlay
Cypress.Commands.add('checkOverlay', (shouldBeVisible: boolean) => {
  cy.get('#youtube-overlay-extension').should(shouldBeVisible ? 'be.visible' : 'not.be.visible');
  if (shouldBeVisible) {
    cy.get('#youtube-overlay-extension').should('contain', 'Hello world!');
  }
}); 