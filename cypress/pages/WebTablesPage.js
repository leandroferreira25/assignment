class WebTablesPage {
  visit() {
    cy.visit('/webtables');
    cy.get('.web-tables-wrapper').should('be.visible');
  }

  openAddModal() {
    cy.get('#addNewRecordButton').click();
    cy.get('#registration-form-modal').should('be.visible');
  }

  fillRecordForm({ firstName, lastName, email, age, salary, department }) {
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#userEmail').clear().type(email);
    cy.get('#age').clear().type(String(age));
    cy.get('#salary').clear().type(String(salary));
    cy.get('#department').clear().type(department);
  }

  submitRecord() {
    cy.get('#submit').click();
  }

  addRecord(record) {
    this.openAddModal();
    this.fillRecordForm(record);
    this.submitRecord();
    cy.get('#registration-form-modal').should('not.exist');
  }

  search(query) {
    cy.get('#searchBox').clear().type(query);
  }

  clearSearch() {
    cy.get('#searchBox').clear();
  }

  getTableRows() {
    return cy.get('tbody tr');
  }

  findRowByText(text) {
    return cy.get('tbody tr').contains('td', text).parent('tr');
  }

  editRecord(rowIdentifier, { salary, department }) {
    this.findRowByText(rowIdentifier).within(() => {
      cy.get('span[title="Edit"]').click();
    });
    cy.get('#registration-form-modal').should('be.visible');
    cy.get('#salary').clear().type(String(salary));
    cy.get('#department').clear().type(department);
    this.submitRecord();
    cy.get('#registration-form-modal').should('not.exist');
  }

  deleteRecord(rowIdentifier) {
    this.findRowByText(rowIdentifier).within(() => {
      cy.get('span[title="Delete"]').click();
    });
  }
}

export default new WebTablesPage();
