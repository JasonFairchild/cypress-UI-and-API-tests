describe('Pile API Tests', () => {

    let deckId;
  
    // Setup: Create a new deck before each test
    before(() => {
      // Step 1: Create a new deck (this is necessary for interacting with piles)
      cy.request('POST', '/new/shuffle/?deck_count=1')
        .then((response) => {
          deckId = response.body.deck_id;  // Capture the deck_id for use in subsequent tests
          expect(response.status).to.eq(200);
        });
    });
  
    it('should create a pile in the deck', () => {
      // Step 2: Create a new pile in the deck
      cy.request('POST', `/${deckId}/pile/testpile/`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        });
    });
  
    it('should add cards to the pile', () => {
      // Step 3: Add cards to the pile
      cy.request('POST', `/${deckId}/pile/testpile/add/?cards=AS,2D,3H,4S`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        });
    });
  
    it('should draw cards from the pile', () => {
      // Step 4: Draw cards from the pile
      cy.request('GET', `/${deckId}/pile/testpile/draw/?count=2`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.cards.length).to.eq(2);
          expect(response.body.success).to.be.true;
        });
    });
  
    it('should list remaining cards in the pile', () => {
      // Step 5: List remaining cards in the pile
      cy.request('GET', `/${deckId}/pile/testpile/list/`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.piles.testpile.cards.length).to.eq(2); // After drawing 2 cards
        });
    });
  
    it('should return an error when drawing from an empty pile', () => {
      // Step 6: Try to draw more cards than are available
      cy.request({
        method: 'GET',
        url: `/${deckId}/pile/testpile/draw/?count=10`,
        failOnStatusCode: false, // Do not fail the test on non-2xx responses
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include('not enough cards in the pile');
      });
    });
  });
  