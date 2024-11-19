describe("Checkers UI", () => {
  // Ideally, I would test each possible move by controlling the starting
  // state and only testing a single move in a test.
  // But since I don't have access to the inner workings of the source code
  // this test is very long and has other quirks.
  it("Plays a game with various moves until won", () => {
    cy.viewport(1280, 720);
    // Removes all the annoying requests due to ads on the site from command log
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit("https://www.gamesforthebrain.com/game/checkers/");
    cy.contains("h1", "Checkers");
    cy.contains("Select an orange piece to move.");
    cy.contains("a", "Restart...").should("have.attr", "href", "./");
    cy.contains("a", "Rules").should("have.attr", "href", "https://en.wikipedia.org/wiki/English_draughts#Starting_position");

    cy.get("#board").find('[name="space42"]').click();
    cy.get("#board").find('[name="space42"]').should("have.attr", "src", "you2.gif");
    cy.get("#board").find('[name="space33"]').click();
    cy.log(cy.get("#board").find('[name="space33"]'));
    cy.get("#board").find('[name="space33"]').should("have.attr", "src").and("includes", "you2.gif");
    cy.get("#board").find('[name="space33"]').should("have.attr", "src", "you1.gif");
    cy.get("#board").find('[name="space04"]').should("have.attr", "src", "me1.gif");
    cy.contains("Make a move.");
    // There is a very good chance that these snapshots will not pass on other machines as they can be very sensitive to OS and other small differences
    // If they fail, you could delete the baseline images and regenerate them and then see them pass, or just comment out every line with compareSnapshot
    cy.get("#board").compareSnapshot("Move right");

    cy.get("#board").find('[name="space51"]').click();
    cy.get("#board").find('[name="space42"]').click();
    cy.get("#board").find('[name="space44"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space42"]').click();
    cy.get("#board").find('[name="space53"]').click();
    cy.get("#board").find('[name="space35"]').should("have.attr", "src", "me1.gif");
    cy.get("#board").compareSnapshot("Move left");

    cy.get("#board").find('[name="space31"]').click();
    cy.get("#board").find('[name="space42"]').click();
    cy.get("#board").find('[name="space64"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space40"]').click();
    cy.get("#board").find('[name="space51"]').click();
    cy.get("#board").find('[name="space55"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space20"]').click();
    cy.get("#board").find('[name="space31"]').click();
    cy.get("#board").find('[name="space73"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space64"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space11"]').click();
    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space55"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space00"]').click();
    cy.get("#board").find('[name="space11"]').click();
    cy.get("#board").find('[name="space15"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space24"]').click();
    cy.get("#board").find('[name="space13"]').should("have.attr", "src", "me1.gif");
    cy.get("#board").compareSnapshot("Single jump");

    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space24"]').click();
    cy.contains("Complete the double jump or click on your piece to stay still.");
    cy.get("#board").find('[name="space06"]').click();
    cy.contains("Please wait.");
    // These waits are not good at all, but I have yet to find any way around it for a double jump.
    // There is something to be said that the user experience is basically exactly this type of waiting
    // with no indication that you can subsequently make a move, which is not great.
    cy.wait(2000);
    cy.get("#board").find('[name="space06"]').click();
    cy.get("#board").find('[name="space26"]').should("have.attr", "src", "me1.gif");
    cy.get("#board").compareSnapshot("Double jump");

    cy.get("#board").find('[name="space06"]').click();
    cy.get("#board").find('[name="space17"]').click();
    cy.get("#board").find('[name="space35"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space11"]').click();
    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space46"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space66"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space17"]').click();
    cy.get("#board").find('[name="space26"]').click();
    cy.get("#board").find('[name="space24"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space35"]').click();
    cy.contains("Complete the double jump or click on your piece to stay still.");
    cy.wait(2000);
    cy.get("#board").find('[name="space57"]').click();
    cy.get("#board").find('[name="space13"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space26"]').click();
    cy.get("#board").find('[name="space15"]').click();
    cy.get("#board").find('[name="space02"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space15"]').click();
    cy.get("#board").find('[name="space04"]').click();
    cy.get("#board").find('[name="space11"]').should("have.attr", "src", "me1.gif");

    cy.get("#board").find('[name="space04"]').click();
    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space20"]').should("have.attr", "src", "me1k.gif");

    cy.get("#board").find('[name="space13"]').click();
    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space11"]').should("have.attr", "src", "me1k.gif");

    cy.get("#board").find('[name="space02"]').click();
    cy.get("#board").find('[name="space20"]').click();
    cy.contains("You have won!");
    cy.get("#board").compareSnapshot("King capture backward");
  });
});
