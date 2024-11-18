describe("Return endpoint", () => {
  beforeEach("Create a deck", () => {
    cy.request("POST", "/new/shuffle/").then((response) => {
      cy.wrap(response.body.deck_id).as("deckId");
    });
  });

  it("should return 2 of 3 cards to the deck", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: 3 },
      }).then((response) => {
        expect(response.body.remaining).to.equal(49);
        const twoDrawnCards = response.body.cards.slice(0, 2);
        const returningCardCodes = twoDrawnCards.map((card) => card.code);

        cy.request({
          method: "GET",
          url: `/${deckId}/return/`,
          qs: { cards: returningCardCodes },
        }).then((response) => {
          expect(response.body.success).to.eq(true);
          expect(response.body.remaining).to.eq(51);
        });
      });
    });
  });

  it("should return all drawn cards to the deck", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: 51 },
      }).then((response) => {
        expect(response.body.remaining).to.equal(1);

        cy.request({
          method: "GET",
          url: `/${deckId}/return/`,
        }).then((response) => {
          expect(response.body.success).to.eq(true);
          expect(response.body.remaining).to.eq(52);
        });
      });
    });
  });
});
