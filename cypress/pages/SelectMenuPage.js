class SelectMenuPage {
  visit() {
    cy.visit('/select-menu');
    cy.get('#selectMenuContainer').should('be.visible');
  }

  selectOldStyleMenu(color) {
    cy.get('#oldSelectMenu').select(color);
  }

  getOldStyleMenuValue() {
    return cy.get('#oldSelectMenu');
  }

  selectStandardMulti(carValues) {
    cy.get('#cars').select(carValues);
  }

  getStandardMultiSelectedValues() {
    return cy.get('#cars').invoke('val');
  }

  selectCustomMulti(color) {
    cy.contains('p', 'Multiselect drop down')
      .parent()
      .find('input')
      .first()
      .type(`${color}{enter}`, { force: true });
  }

  getCustomMultiSelectedBadges() {
    return cy
      .contains('p', 'Multiselect drop down')
      .parent()
      .find('div[class*="-multiValue"]');
  }
}

export default new SelectMenuPage();
