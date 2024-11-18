describe("Pile endpoint", function () {
  beforeEach("Create a deck and draw all", function () {
    // cards must be drawn from the deck before they can be added to piles
    cy.request({
      method: "POST",
      url: "/new/draw",
      qs: { count: 52 },
    }).then((response) => {
      cy.wrap(response.body.deck_id).as("deckId");
    });
  });

  it("should draw from the top and bottom", function () {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "POST",
        url: `/${deckId}/pile/testpile/add`,
        qs: { cards: ["AS", "2S", "2D", "AD"] },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(4);
      });

      cy.request({
        method: "GET",
        url: `/${deckId}/pile/testpile/draw`,
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(3);
        expect(response.body.cards.length).to.eq(1);
        expect(response.body.cards[0].code).to.eq("AD");
      });

      cy.request({
        method: "GET",
        url: `/${deckId}/pile/testpile/draw/bottom`,
        qs: { count: 2 },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(1);
        expect(response.body.cards.length).to.eq(2);
        expect(response.body.cards[0].code).to.eq("AS");
        expect(response.body.cards[1].code).to.eq("2S");
      });
    });
  });

  it("should draw and return specific cards from the pile", function () {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "POST",
        url: `/${deckId}/pile/testpile/add`,
        qs: { cards: ["AS", "2S", "2D", "AD"] },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(4);
      });

      cy.request({
        method: "GET",
        url: `/${deckId}/pile/testpile/draw`,
        qs: { cards: ["2S", "2D"] },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(2);
        expect(response.body.cards.length).to.eq(2);
        expect(response.body.cards[0].code).to.eq("2S");
        expect(response.body.cards[1].code).to.eq("2D");
      });

      cy.request({
        method: "GET",
        url: `/${deckId}/pile/testpile/return`,
        qs: { cards: ["AS"] },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(1);
        expect(response.body.remaining).to.eq(1);
      });

      cy.request("GET", `/${deckId}/pile/testpile/list`).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(1);
        expect(response.body.piles.testpile.cards[0].code).to.eq("AD");
      });
    });
  });

  it("should add cards, list them in order, then shuffle pile", function () {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "POST",
        url: `/${deckId}/pile/shufflePile/add`,
        qs: { cards: ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C"] },
      }).then((response) => {
        expect(response.body.piles.shufflePile.remaining).to.eq(9);

        const orderedClubs = ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C"];
        cy.request("GET", `/${deckId}/pile/shufflePile/list`).then((response) => {
          const actualCardCodes = response.body.piles.shufflePile.cards.map((card) => card.code);
          console.log(actualCardCodes);
          expect(actualCardCodes).to.have.ordered.members(orderedClubs);
        });

        cy.request("GET", `/${deckId}/pile/shufflePile/shuffle`);

        cy.request("GET", `/${deckId}/pile/shufflePile/list`).then((response) => {
          const actualCardCodes = response.body.piles.shufflePile.cards.map((card) => card.code);
          expect(actualCardCodes).to.not.have.ordered.members(orderedClubs);
        });
      });
    });
  });

  it("should return an error when over drawing from a pile", function () {
    cy.get("@deckId").then((deckId) => {
      cy.request({
        method: "POST",
        url: `/${deckId}/pile/testpile/add`,
        qs: { cards: ["AS", "2S", "2D", "AD"] },
      }).then((response) => {
        expect(response.body.piles.testpile.remaining).to.eq(4);
      });

      cy.request({
        method: "GET",
        url: `/${deckId}/pile/testpile/draw`,
        failOnStatusCode: false,
        qs: { count: 10 },
      }).then((response) => {
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include("Not enough cards remaining to draw 10 additional");
      });
    });
  });
  // Error states for drawing from non-existing pile and returning cards that are not in a pile
  // Test for drawing randomly
});
