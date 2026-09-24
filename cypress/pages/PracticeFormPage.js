class PracticeFormPage {
  visit() {
    cy.visit('/automation-practice-form');
    cy.get('#userForm').should('be.visible');
  }

  fillRequiredFields({ firstName, lastName, gender, mobile }) {
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#genterWrapper').contains(gender).click();
    cy.get('#userNumber').clear().type(mobile);
  }

  fillFullForm(data) {
    this.fillRequiredFields(data);
    cy.get('#userEmail').clear().type(data.email);
    data.subjects.forEach((subject) => cy.get('#subjectsInput').type(`${subject}{enter}`));
    data.hobbies.forEach((hobby) => cy.get('#hobbiesWrapper').contains(hobby).click());
    cy.get('#currentAddress').clear().type(data.currentAddress);
    cy.get('#state input').type(`${data.state}{enter}`, { force: true });
    cy.get('#city input').type(`${data.city}{enter}`, { force: true });
  }

  submit() {
    // The footer or ads can block the submit button on smaller viewports, so force the click
    cy.get('#submit').scrollIntoView().click({ force: true });
  }

  getModal() {
    return cy.get('.modal-content');
  }

  getModalTitle() {
    return cy.get('#example-modal-sizes-title-lg');
  }

  getModalDataByLabel(label) {
    return cy
      .get('.table-responsive tbody tr')
      .contains('td', label)
      .parent()
      .find('td')
      .eq(1);
  }

  closeModal() {
    cy.get('#closeLargeModal').should('be.visible');
    // DemoQA's close button has a React 18 findDOMNode bug that crashes, so press escape to close it
    cy.get('body').type('{esc}');
    cy.get('.modal-content').should('not.exist');
  }
}

export default new PracticeFormPage();
