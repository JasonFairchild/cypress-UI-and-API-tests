describe("Deck of Cards API", () => {
  it("should shuffle a new deck", () => {
    cy.request({
      method: "POST",
      url: "/new/shuffle/",
      body: {},
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.equal(52);
    });
  });
});

describe("Deck of Cards API", () => {
  it("should create a new deck with jokers", () => {
    cy.request({
      method: "POST",
      url: "/new",
      qs: { jokers_enabled: true },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(true);
      expect(response.body.deck_id).to.exist;
      expect(response.body.remaining).to.equal(54);
    });
  });

  // Multiple decks
  // Brand new ordered deck
  // Partial deck
});
