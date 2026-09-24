import selectMenuPage from '../pages/SelectMenuPage';

describe('Select Menu', () => {
  beforeEach(() => {
    selectMenuPage.visit();
  });

  it('selects options from standard select dropdowns', () => {
    selectMenuPage.selectOldStyleMenu('Blue');
    selectMenuPage.getOldStyleMenuValue().should('have.value', '1');

    selectMenuPage.selectOldStyleMenu('Aqua');
    selectMenuPage.getOldStyleMenuValue().should('have.value', '10');

    selectMenuPage.selectStandardMulti(['volvo', 'audi']);
    selectMenuPage.getStandardMultiSelectedValues().should('deep.equal', ['volvo', 'audi']);
  });

  it('selects multiple items in custom react dropdown', () => {
    selectMenuPage.selectCustomMulti('Green');
    selectMenuPage.getCustomMultiSelectedBadges().should('contain.text', 'Green');

    selectMenuPage.selectCustomMulti('Blue');
    selectMenuPage.getCustomMultiSelectedBadges().should('have.length', 2);
    selectMenuPage.getCustomMultiSelectedBadges().should('contain.text', 'Blue');
  });
});
