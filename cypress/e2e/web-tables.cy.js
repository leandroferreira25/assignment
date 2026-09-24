import webTablesPage from '../pages/WebTablesPage';

describe('Web Tables', () => {
  beforeEach(() => {
    webTablesPage.visit();
  });

  it('adds a new record to the table', () => {
    const newRecord = {
      firstName: 'Samantha',
      lastName: 'Reed',
      email: 'samantha.reed@example.com',
      age: 32,
      salary: 85000,
      department: 'Engineering',
    };

    webTablesPage.addRecord(newRecord);

    webTablesPage.findRowByText(newRecord.email).within(() => {
      cy.get('td').eq(0).should('have.text', newRecord.firstName);
      cy.get('td').eq(1).should('have.text', newRecord.lastName);
      cy.get('td').eq(2).should('have.text', String(newRecord.age));
      cy.get('td').eq(3).should('have.text', newRecord.email);
      cy.get('td').eq(4).should('have.text', String(newRecord.salary));
      cy.get('td').eq(5).should('have.text', newRecord.department);
    });
  });

  it('searches records and handles empty results', () => {
    webTablesPage.search('Compliance');
    webTablesPage.getTableRows().should('have.length', 1);
    webTablesPage.findRowByText('Alden').should('be.visible');

    webTablesPage.search('NonExistentDepartment');
    webTablesPage.getTableRows().should('have.length', 0);

    webTablesPage.clearSearch();
    webTablesPage.getTableRows().should('have.length', 3);
  });

  it('edits an existing record', () => {
    webTablesPage.editRecord('cierra@example.com', {
      salary: '95000',
      department: 'Operations',
    });

    webTablesPage.findRowByText('cierra@example.com').within(() => {
      cy.get('td').eq(4).should('have.text', '95000');
      cy.get('td').eq(5).should('have.text', 'Operations');
    });
  });

  it('deletes a record', () => {
    webTablesPage.findRowByText('kierra@example.com').should('exist');
    webTablesPage.deleteRecord('kierra@example.com');

    cy.contains('td', 'kierra@example.com').should('not.exist');
    webTablesPage.getTableRows().should('have.length', 2);
  });
});
