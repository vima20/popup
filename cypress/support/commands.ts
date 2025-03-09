/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Declare global types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      loadExtension(): Chainable<void>
      pressKeyCombination(key: string, modifier?: string): Chainable<void>
      checkOverlay(shouldBeVisible: boolean): Chainable<void>
    }
  }
}

// Load extension
Cypress.Commands.add('loadExtension', () => {
  cy.window().then((win) => {
    // Mock chrome API
    win.chrome = {
      runtime: {
        sendMessage: cy.stub(),
        onMessage: {
          addListener: cy.stub(),
          removeListener: cy.stub()
        }
      },
      storage: {
        local: {
          get: cy.stub().resolves({ text: 'Hello world!' }),
          set: cy.stub().resolves({})
        }
      }
    }
  })
})

// Check overlay visibility
Cypress.Commands.add('checkOverlay', (visible: boolean) => {
  if (visible) {
    cy.get('.fixed').should('be.visible')
  } else {
    cy.get('.fixed').should('not.be.visible')
  }
})

// Press key combination
Cypress.Commands.add('pressKeyCombination', (key: string, modifier?: string) => {
  if (modifier) {
    cy.get('body').type(`{${modifier}}{${key}}`)
  } else {
    cy.get('body').type(`{${key}}`)
  }
}) 