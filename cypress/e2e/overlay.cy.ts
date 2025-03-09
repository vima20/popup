describe('Overlay', () => {
  beforeEach(() => {
    // Handle JavaScript errors
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from failing the test
      return false
    })
    
    // Visit YouTube
    cy.visit('/')
    
    // Wait for content script to load
    cy.window().then((win) => {
      // Mock chrome.storage
      win.chrome = {
        storage: {
          local: {
            get: cy.stub().resolves({ text: 'Hello world!' })
          }
        }
      }
    })
  })

  it('shows overlay on keyboard shortcut', () => {
    // Press CTRL + SHIFT + ENTER
    cy.get('body').type('{ctrl}{shift}{enter}')
    
    // Wait for overlay to appear
    cy.get('#youtube-overlay-container', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('contain', 'Hello world!')
  })

  it('updates text when changed in popup', () => {
    // Mock storage update
    cy.window().then((win) => {
      win.chrome.storage.local.get = cy.stub().resolves({ text: 'Updated text!' })
    })
    
    // Press CTRL + SHIFT + ENTER
    cy.get('body').type('{ctrl}{shift}{enter}')
    
    // Wait for overlay to appear with updated text
    cy.get('#youtube-overlay-container', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('contain', 'Updated text!')
  })
}) 