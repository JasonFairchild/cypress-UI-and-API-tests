describe('Deck of Cards API', () => {
    let deckId;
  
    before(() => {
      // Shuffle a new deck to get a deck ID
      cy.request('POST', '/new/shuffle/').then((response) => {
        deckId = response.body.deck_id;
      });
    });
  
    it('should return the number of remaining cards in the deck', () => {
      cy.request({
        method: 'GET',
        url: `/${deckId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.remaining).to.eq(52); // Initially 52 cards
      });
    });
  });

  describe('Deck of Cards API', () => {
    let deckId;
  
    before(() => {
      // Shuffle a new deck to get a deck ID
      cy.request('POST', '/new/shuffle/').then((response) => {
        deckId = response.body.deck_id;
      });
    });
  
    it('should list all the cards in the deck', () => {
      cy.request({
        method: 'GET',
        url: `/${deckId}/list/`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.cards).to.have.length(52); // All 52 cards in a shuffled deck
      });
    });
  });

  describe('Deck of Cards API', () => {
    let deckId;
  
    before(() => {
      // Shuffle a new deck to get a deck ID
      cy.request('POST', '/new/shuffle/').then((response) => {
        deckId = response.body.deck_id;
      });
    });
  
    it('should get the status of the deck', () => {
      cy.request({
        method: 'GET',
        url: `/${deckId}/status/`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.deck_id).to.eq(deckId);
        expect(response.body.shuffled).to.be.true;
      });
    });
  });
  