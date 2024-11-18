describe("Deck of Cards API", () => {
  beforeEach("Create a deck", () => {
    cy.request("POST", "/new").then((response) => {
      cy.wrap(response.body.deck_id).as("deckId");
    });
  });

  it("should draw a single card from the deck", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
      }).then((response) => {
        expect(response.body.success).to.eq(true);
        expect(response.body.cards).to.have.length(1);
        expect(response.body.cards[0].code).to.eq("AS");
        expect(response.body.cards[0].suit).to.eq("SPADES");
        expect(response.body.cards[0].value).to.eq("ACE");
        expect(response.body.cards[0]).to.have.property("image");
        expect(response.body.cards[0]).to.have.property("images");
        expect(response.body.remaining).to.eq(51);
      });
    });
  });

  it("should draw no cards from deck", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: 0 },
      }).then((response) => {
        expect(response.body.cards).to.be.empty;
        expect(response.body.remaining).to.eq(52);
      });
    });
  });

  it("should draw all cards from the deck", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: 52 },
      }).then((response) => {
        expect(response.body.cards).to.have.length(52);
        expect(response.body.remaining).to.eq(0);
      });
    });
  });

  it("should draw 52 cards from the deck and give error", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: 53 },
      }).then((response) => {
        expect(response.body.success).to.eq(false);
        expect(response.body.error).to.eq("Not enough cards remaining to draw 53 additional");
        expect(response.body.cards).to.have.length(52);
        expect(response.body.remaining).to.eq(0);
      });
    });
  });

  it("should result in remaining cards minus negative count cards drawn", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: -1 },
      }).then((response) => {
        expect(response.body.success).to.eq(true);
        // remaining - 1 cards drawn
        expect(response.body.cards).to.have.length(51);
        expect(response.body.remaining).to.eq(1);
      });
    });
  });

  it("should return 500 when passed an invalid query string", () => {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "GET",
        url: `/${deckId}/draw/`,
        qs: { count: "a" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
      });
    });
  });
});
