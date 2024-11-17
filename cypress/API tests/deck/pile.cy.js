describe("Pile API Tests", () => {
  let deckId;

  before(() => {
    cy.request({
      method: "POST",
      url: "/new/shuffle",
      qa: { deck_count: 1 },
    }).then((response) => {
      deckId = response.body.deck_id; // Capture the deck_id for use in subsequent tests
      expect(response.status).to.eq(200);
      // cards must be drawn from the deck before they can be added to piles
      cy.request({
        method: "POST",
        url: `/${response.body.deck_id}/draw`,
        qs: { count: 52 },
      }).then((response) => {
        expect(response.body.cards).to.have.length(52);
      });
    });
  });

  it("should create a pile in the deck", () => {
    cy.request({
      method: "POST",
      url: `/${deckId}/pile/testpile/add`,
      qs: { cards: ["AS", "2S", "AD"] },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it("should add cards to the pile", () => {
    cy.request({
      method: "POST",
      url: `/${deckId}/pile/testpile/add`,
      qs: { cards: ["QS", "KS"] },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it("should draw cards from the pile", () => {
    cy.request({
      method: "GET",
      url: `/${deckId}/pile/testpile/draw`,
      qs: { count: 2 },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.cards.length).to.eq(2);
      expect(response.body.success).to.be.true;
    });
  });

  it("should list remaining cards in the pile", () => {
    cy.request("GET", `/${deckId}/pile/testpile/list/`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.piles.testpile.cards.length).to.eq(3);
    });
  });

  it("should return an error when drawing from an empty pile", () => {
    cy.request({
      method: "GET",
      url: `/${deckId}/pile/testpile/draw`,
      failOnStatusCode: false, // Do not fail the test on non-2xx responses
      qs: { count: 10 },
    }).then((response) => {
      expect(response.body.success).to.be.false;
      expect(response.body.error).to.include(
        "Not enough cards remaining to draw 10 additional"
      );
    });
  });
  // Shuffle pile
  // Drawing specific cards from pile
  // Draw from top
  // Draw from bottom
  // Return cards from a pile
});
