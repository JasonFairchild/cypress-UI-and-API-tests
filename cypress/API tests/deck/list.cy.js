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
  