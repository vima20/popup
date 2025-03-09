describe('Popup', () => {
  beforeEach(() => {
    // Mock chrome.storage
    cy.window().then((win) => {
      win.chrome = {
        storage: {
          local: {
            get: cy.stub().resolves({ text: 'Hello world!' }),
            set: cy.stub().resolves({})
          }
        }
      }
    })
    
    // Visit popup page
    cy.visit('/popup.html')
    
    // Wait for page to load
    cy.get('#app').should('exist')
  })

  it('opens popup and displays content', () => {
    // Check title
    cy.get('h1').should('contain', 'YouTube Overlay Extension')
    
    // Check styling
    cy.get('.bg-gray-800').should('exist')
    
    // Check input field
    cy.get('input[type="text"]')
      .should('exist')
      .should('have.value', 'Hello world!')
    
    // Check save button
    cy.get('button')
      .should('contain', 'Save')
    
    // Check status indicator
    cy.get('.status-indicator').should('exist')
    
    // Check keyboard shortcut info
    cy.get('.shortcut-info').should('contain', 'CTRL + SHIFT + ENTER')
  })

  it('saves custom text', () => {
    const customText = 'Custom overlay text'
    
    // Type new text
    cy.get('input[type="text"]')
      .clear()
      .type(customText)
    
    // Click save button
    cy.get('button').click()
    
    // Verify storage was updated
    cy.window().then((win) => {
      expect(win.chrome.storage.local.set).to.be.calledWith({
        text: customText
      })
    })
    
    // Check status indicator
    cy.get('.status-indicator').should('contain', 'Saved')
  })
}) 