describe("challenge", () => {
  it("should draw a single card from the deck", () => {
    cy.request({
      method: "POST",
      url: "/new/draw",
      qs: { count: 10 },
    }).then((response) => {
      const hearts = response.body.cards.filter((card) => card.suit == "HEARTS");
      cy.request({
        method: "POST",
        url: `/${response.body.deck_id}/pile/testpile/add`,
        qs: { cards: hearts.map((card) => card.code) },
      });

      cy.request("GET", `/${response.body.deck_id}/pile/testpile/list`).then((response) => {
        console.log(response.body.piles.testpile.cards[0]);
      });
    });
  });
});
// Shuffle all cards
// Shuffle remaining cards
