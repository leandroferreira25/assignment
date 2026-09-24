import buttonsPage from '../pages/ButtonsPage';

describe('Buttons', () => {
  beforeEach(() => {
    buttonsPage.visit();
  });

  it('handles double click, right click, and dynamic click', () => {
    buttonsPage.performDoubleClick();
    buttonsPage.getDoubleClickMessage().should('have.text', 'You have done a double click');

    buttonsPage.performRightClick();
    buttonsPage.getRightClickMessage().should('have.text', 'You have done a right click');

    buttonsPage.performDynamicClick();
    buttonsPage.getDynamicClickMessage().should('have.text', 'You have done a dynamic click');
  });
});
