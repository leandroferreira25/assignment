class DialogsAlertsPage {
  visitModals() {
    cy.visit('/modal-dialogs');
    cy.get('#modalWrapper').should('be.visible');
  }

  visitAlerts() {
    cy.visit('/alerts');
    cy.get('#javascriptAlertsWrapper').should('be.visible');
  }

  openSmallModal() {
    cy.get('#showSmallModal').click();
    cy.get('#example-modal-sizes-title-sm').should('be.visible');
  }

  closeSmallModal() {
    cy.get('#closeSmallModal').click();
    cy.get('.modal-content').should('not.exist');
  }

  getModalBodyText() {
    return cy.get('.modal-body');
  }

  triggerConfirm() {
    cy.get('#confirmButton').click();
  }

  getConfirmResultText() {
    return cy.get('#confirmResult');
  }
}

export default new DialogsAlertsPage();
