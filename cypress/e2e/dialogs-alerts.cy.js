import dialogsAlertsPage from '../pages/DialogsAlertsPage';

describe('Modals and Alerts', () => {
  describe('Modal Dialogs', () => {
    beforeEach(() => {
      dialogsAlertsPage.visitModals();
    });

    it('opens and closes the small modal', () => {
      dialogsAlertsPage.openSmallModal();
      dialogsAlertsPage.getModalBodyText().should('contain.text', 'This is a small modal');
      dialogsAlertsPage.closeSmallModal();
    });
  });

  describe('Alerts and Confirms', () => {
    beforeEach(() => {
      dialogsAlertsPage.visitAlerts();
    });

    it('accepts confirm alert', () => {
      dialogsAlertsPage.triggerConfirm();
      dialogsAlertsPage.getConfirmResultText().should('have.text', 'You selected Ok');
    });

    it('dismisses confirm alert', () => {
      cy.on('window:confirm', () => false);
      dialogsAlertsPage.triggerConfirm();
      dialogsAlertsPage.getConfirmResultText().should('have.text', 'You selected Cancel');
    });
  });
});
