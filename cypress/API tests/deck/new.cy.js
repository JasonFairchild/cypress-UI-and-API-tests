describe("Deck of Cards API - /new", () => {
  it("should shuffle a new deck", () => {
    cy.request({
      method: "POST",
      url: "/new/shuffle",
    }).then((response) => {
      expect(response.body.success).to.eq(true);
      expect(response.body.shuffled).to.eq(true);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.eq(52);
    });
  });

  it("should create a new unshuffled deck with jokers", () => {
    cy.request({
      method: "POST",
      url: "/new",
      qs: { jokers_enabled: true },
    }).then((response) => {
      expect(response.body.success).to.eq(true);
      expect(response.body.shuffled).to.eq(false);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.eq(54);

      cy.request({
        method: "GET",
        url: `/${response.body.deck_id}/draw`,
        qs: { count: 54 },
      }).then((response) => {
        expect(response.body.remaining).to.eq(0);
        const orderedDeck = ["AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", "X1", "X2"];
        orderedDeck.forEach((cardCode, index) => {
          expect(response.body.cards[index].code).to.eq(cardCode);
        });
      });
    });
  });

  it("should create multiple new decks", () => {
    cy.request({
      method: "POST",
      url: "/new",
      qs: { deck_count: 2 },
    }).then((response) => {
      expect(response.body.success).to.eq(true);
      expect(response.body.shuffled).to.eq(false);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.eq(104);
    });
  });

  it("should create a partial deck", () => {
    cy.request({
      method: "POST",
      url: "/new",
      qs: { cards: ["AS", "2S", "3S", "4S"] },
    }).then((response) => {
      expect(response.body.success).to.eq(true);
      expect(response.body.shuffled).to.eq(false);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.eq(4);

      cy.request({
        method: "GET",
        url: `/${response.body.deck_id}/draw`,
        qs: { count: 4 },
      }).then((response) => {
        expect(response.body.remaining).to.eq(0);
        const partialDeck = ["AS", "2S", "3S", "4S"];
        partialDeck.forEach((cardCode, index) => {
          expect(response.body.cards[index].code).to.eq(cardCode);
        });
      });
    });
  });
});
