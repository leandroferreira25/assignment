class ButtonsPage {
  visit() {
    cy.visit('/buttons');
    cy.get('h1').contains('Buttons').should('be.visible');
  }

  performDoubleClick() {
    cy.get('#doubleClickBtn').dblclick();
  }

  performRightClick() {
    cy.get('#rightClickBtn').rightclick();
  }

  // DemoQA generates a random ID for this button on each render, so grab it by exact text instead
  performDynamicClick() {
    cy.contains('button', /^Click Me$/).click();
  }

  getDoubleClickMessage() {
    return cy.get('#doubleClickMessage');
  }

  getRightClickMessage() {
    return cy.get('#rightClickMessage');
  }

  getDynamicClickMessage() {
    return cy.get('#dynamicClickMessage');
  }
}

export default new ButtonsPage();
