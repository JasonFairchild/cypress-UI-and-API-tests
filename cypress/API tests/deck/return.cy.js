describe('Deck of Cards API', () => {
    let deckId;
  
    before(() => {
      // Shuffle a new deck to get a deck ID
      cy.request('POST', '/new/shuffle/').then((response) => {
        deckId = response.body.deck_id;
      });
    });
  
    it('should return 3 cards to the deck', () => {
      // First, draw 3 cards
      cy.request({
        method: 'GET',
        url: `/${deckId}/draw/`,
        qs: { count: 3 },
      }).then((response) => {
        const drawnCards = response.body.cards;
        
        // Now, return those 3 cards
        cy.request({
          method: 'POST',
          url: `/${deckId}/return/`,
          body: { cards: drawnCards.map(card => card.code) },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.eq(true);
          expect(response.body.remaining).to.eq(52); // All cards returned
        });
      });
    });
  });
  