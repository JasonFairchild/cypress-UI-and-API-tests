describe('Deck of Cards API', () => {
    let deckId;
  
    before(() => {
      // Shuffle a new deck to get a deck ID
      cy.request('POST', '/new/shuffle/').then((response) => {
        deckId = response.body.deck_id;
      });
    });
  
    it('should draw a single card from the deck', () => {
      cy.request({
        method: 'GET',
        url: `/${deckId}/draw/`,
        qs: { count: 1 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.cards).to.have.length(1);
        expect(response.body.cards[0]).to.have.property('code');
        expect(response.body.remaining).to.be.greaterThan(0);
      });
    });

    it('should draw 5 cards from the deck', () => {
      cy.request({
        method: 'GET',
        url: `/${deckId}/draw/`,
        qs: { count: 5 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.cards).to.have.length(5);
        expect(response.body.remaining).to.eq(47); // 52 - 5 cards drawn
      });
    });
});
  