describe('Popup Window', () => {
  beforeEach(() => {
    // Visit popup page
    cy.visit('popup.html')
  })

  it('should render popup window', () => {
    cy.get('body').should('exist')
    cy.get('#app').should('exist')
  })

  it('should show correct title', () => {
    cy.get('h1')
      .should('have.class', 'text-xl')
      .and('have.class', 'font-bold')
      .and('have.class', 'mb-4')
      .and('contain', 'YouTube Overlay Extension')
  })

  it('should show keyboard shortcut info', () => {
    cy.get('p')
      .should('have.class', 'text-sm')
      .and('have.class', 'text-gray-600')
      .and('have.class', 'mb-4')
      .and('contain', 'Press CTRL + F3 to toggle the overlay on YouTube videos.')
  })

  it('should show version number', () => {
    cy.get('div')
      .should('have.class', 'text-xs')
      .and('have.class', 'text-gray-500')
      .and('contain', 'Version: 1.0.0')
  })

  it('should have correct container styling', () => {
    cy.get('div')
      .should('have.class', 'p-4')
      .and('have.class', 'w-64')
  })
}) 