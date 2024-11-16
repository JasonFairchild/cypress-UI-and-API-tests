describe('Deck of Cards API', () => {
    it('should shuffle a new deck', () => {
      cy.request({
        method: 'POST',
        url: '/new/shuffle/',
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.deck_id).to.exist;
        expect(response.body.remaining).to.be.greaterThan(0);
      });
    });
  });

  describe('Deck of Cards API', () => {
    it('should create a new deck with jokers', () => {
      cy.request({
        method: 'POST',
        url: '/new/jokers/',
        body: {},
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.eq(true);
        expect(response.body.deck_id).to.exist;
        expect(response.body.cards).to.have.length(54); // 52 cards + 2 jokers
      });
    });
  });
  
  