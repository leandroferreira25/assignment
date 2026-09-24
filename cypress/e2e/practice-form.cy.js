import practiceFormPage from '../pages/PracticeFormPage';

describe('Practice Form', () => {
  let studentData;

  before(() => {
    cy.fixture('studentData').then((data) => {
      studentData = data;
    });
  });

  beforeEach(() => {
    practiceFormPage.visit();
  });

  it('submits form with required fields', () => {
    const { minimalStudent } = studentData;

    practiceFormPage.fillRequiredFields(minimalStudent);
    practiceFormPage.submit();

    practiceFormPage.getModal().should('be.visible');
    practiceFormPage.getModalTitle().should('have.text', 'Thanks for submitting the form');
    practiceFormPage.getModalDataByLabel('Student Name').should('have.text', `${minimalStudent.firstName} ${minimalStudent.lastName}`);
    practiceFormPage.getModalDataByLabel('Gender').should('have.text', minimalStudent.gender);
    practiceFormPage.getModalDataByLabel('Mobile').should('have.text', minimalStudent.mobile);

    practiceFormPage.closeModal();
  });

  it('submits form with all fields filled', () => {
    const { comprehensiveStudent } = studentData;

    practiceFormPage.fillFullForm(comprehensiveStudent);
    practiceFormPage.submit();

    practiceFormPage.getModal().should('be.visible');
    practiceFormPage.getModalTitle().should('have.text', 'Thanks for submitting the form');
    practiceFormPage.getModalDataByLabel('Student Name').should('have.text', `${comprehensiveStudent.firstName} ${comprehensiveStudent.lastName}`);
    practiceFormPage.getModalDataByLabel('Student Email').should('have.text', comprehensiveStudent.email);
    practiceFormPage.getModalDataByLabel('Gender').should('have.text', comprehensiveStudent.gender);
    practiceFormPage.getModalDataByLabel('Mobile').should('have.text', comprehensiveStudent.mobile);
    practiceFormPage.getModalDataByLabel('Subjects').should('have.text', comprehensiveStudent.subjects.join(', '));
    practiceFormPage.getModalDataByLabel('Hobbies').should('have.text', comprehensiveStudent.hobbies.join(', '));
    practiceFormPage.getModalDataByLabel('Address').should('have.text', comprehensiveStudent.currentAddress);
    practiceFormPage.getModalDataByLabel('State and City').should('have.text', `${comprehensiveStudent.state} ${comprehensiveStudent.city}`);

    practiceFormPage.closeModal();
  });

  it('shows validation errors when submitting empty form', () => {
    practiceFormPage.submit();

    cy.get('.modal-content').should('not.exist');
    cy.get('#firstName:invalid').should('exist');
    cy.get('#lastName:invalid').should('exist');
    cy.get('#userNumber:invalid').should('exist');
  });
});
