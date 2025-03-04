describe('YouTube Overlay Extension', () => {
  beforeEach(() => {
    // Visit YouTube and load extension
    cy.visit('/')
    cy.loadExtension()
  })

  it('should show overlay when CTRL+F3 is pressed', () => {
    // Initially overlay should not be visible
    cy.checkOverlay(false)

    // Press CTRL+F3
    cy.pressKeyCombination('F3', 'ctrl')

    // Overlay should be visible
    cy.checkOverlay(true)
  })

  it('should hide overlay when CTRL+F3 is pressed again', () => {
    // Show overlay
    cy.pressKeyCombination('F3', 'ctrl')
    cy.checkOverlay(true)

    // Hide overlay
    cy.pressKeyCombination('F3', 'ctrl')
    cy.checkOverlay(false)
  })

  it('should not show overlay when only F3 is pressed', () => {
    // Press only F3
    cy.pressKeyCombination('F3')

    // Overlay should not be visible
    cy.checkOverlay(false)
  })

  it('should not show overlay when CTRL+other key is pressed', () => {
    // Press CTRL+F4
    cy.pressKeyCombination('F4', 'ctrl')

    // Overlay should not be visible
    cy.checkOverlay(false)
  })

  it('should show overlay with correct styling', () => {
    // Show overlay
    cy.pressKeyCombination('F3', 'ctrl')

    // Check styling
    cy.get('#youtube-overlay-extension')
      .should('have.class', 'fixed')
      .and('have.class', 'inset-0')
      .and('have.class', 'flex')
      .and('have.class', 'items-center')
      .and('have.class', 'justify-center')
      .and('have.class', 'bg-black')
      .and('have.class', 'bg-opacity-50')
      .and('have.class', 'z-50')
  })

  it('should show correct text in overlay', () => {
    // Show overlay
    cy.pressKeyCombination('F3', 'ctrl')

    // Check text
    cy.get('#youtube-overlay-extension')
      .find('div')
      .should('have.class', 'text-white')
      .and('have.class', 'text-4xl')
      .and('have.class', 'font-bold')
      .and('contain', 'Hello world!')
  })
}) 