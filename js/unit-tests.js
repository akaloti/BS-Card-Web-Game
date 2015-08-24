"use strict";

/*
  @pre none
  @post bs.players.length = numberOfPlayers
  @hasTest true
  @param numberOfPlayers to create; must be greater than 0
  @returns nothing
  @throws nothing
*/
function createArtificialPlayers(numberOfPlayers) {
  // Clear the players
  bs.players = [];

  for (var i = 0; i < numberOfPlayers; ++i)
    bs.players.push(new Player());
}

QUnit.test("createArtificialPlayers()", function(assert) {
  createArtificialPlayers(1);
  assert.ok(bs.players.length === 1, "Correct number of players created");
  createArtificialPlayers(10);
  assert.ok(bs.players.length === 10, "Correct number of players created");
});

/*
  @pre none
  @post bs.players[playerIndex].cards.length = numberOfCards
  @hasTest true
  @param numberOfCards to create; must exceed 0
  @param playerIndex index of player to give the cards in bs.players
  @returns nothing
  @throws nothing
*/
function createArtificialCards(numberOfCards, playerIndex) {
  // Clear the player's cards
  bs.players[playerIndex].cards = [];

  for (var i = 0; i < numberOfCards; ++i)
    bs.players[playerIndex].cards.push(new Card(bs.SUITS.SPADE,
      bs.RANKS.ACE));
}

QUnit.test("createArtificialCards()", function(assert) {
  createArtificialPlayers(1);
  createArtificialCards(1, 0);
  assert.ok(bs.players[0].cards.length === 1, "Correct number of cards created");
  createArtificialCards(10, 0);
  assert.ok(bs.players[0].cards.length === 10, "Correct number of cards created");
});

QUnit.test("shared.preconditionError()", function(assert) {
  assert.equal(shared.preconditionError("This is a test"),
    shared.PRECONDITION_ERROR, "Correct value is returned");
});

QUnit.test("generateDeck()", function(assert) {
  generateDeck();

  assert.equal(bs.deck.length, bs.DECK_LENGTH,
    "bs.deck contains 52 cards");
});

QUnit.test("dealOutCards()", function(assert) {
  testDealOutCards(assert, 1);
  testDealOutCards(assert, 5);
  testDealOutCards(assert, 53);

  // Check the enforcement of the bs.players.length precondition
  bs.players = [];
  assert.equal(dealOutCards(), shared.PRECONDITION_ERROR,
    "Function throws exception if no players");
});

/*
  @pre none
  @post function dealOutCards has been tested with the given number
  of players
  @hasTest false
  @param assert mandatory parameter that allows usage of unit testing
  in this function
  @param numberOfArtificialPlayers number of players to create and
  deal cards to
  @returns nothing
  @throws nothing
*/
function testDealOutCards(assert, numberOfArtificialPlayers) {
  // create an artificial environment with players and that obeys
  // the preconditions
  generateDeck();
  createArtificialPlayers(numberOfArtificialPlayers);

  // call the function
  dealOutCards();

  // check for (practical) equality of number of cards each player has
  var tolerance = ((bs.DECK_LENGTH % numberOfArtificialPlayers) == 0) ?
    0 : 1;
  var toleranceSatisfied = true;
  // check that the tolerance is obeyed
  for (var i in bs.players)
  {
    if (Math.abs(bs.players[i].cards.length -
      bs.players[0].cards.length) > tolerance)
    {
      toleranceSatisfied = false;
      break;
    }
  }

  assert.ok(toleranceSatisfied,
    "Cards distributed as equally as possible between " +
    numberOfArtificialPlayers + " players");
  assert.equal(bs.deck.length, 0, "All cards were dealt");
}

QUnit.test("createPlayers()", function(assert) {
  // Create an artificial environment that obeys the preconditions
  bs.players = [];

  // check enforcement of (some) preconditions
  assert.equal(createPlayers(-1), shared.PRECONDITION_ERROR,
    "-1 should be a rejected parameter");
  assert.equal(createPlayers(0), shared.PRECONDITION_ERROR,
    "0 should be a rejected parameter");
  assert.equal(createPlayers(shared.bs.MAX_NUMBER_OF_PLAYERS + 1),
    shared.PRECONDITION_ERROR,
    "Any value above shared.bs.MAX_NUMBER_OF_PLAYERS" +
    " should be rejected parameter");

  // reset environment
  bs.players = [];

  var testValue = 5;
  createPlayers(testValue);
  assert.equal(bs.players.length, testValue,
    "Correct number of players created");
});

QUnit.test("sortCards()", function(assert) {
  // Make an unsorted array of some instances of Card
  var unsortedArray = [];
  unsortedArray.push(new Card(bs.SUITS.CLUB, bs.RANKS.QUEEN));
  unsortedArray.push(new Card(bs.SUITS.DIAMOND, bs.RANKS.ACE));
  unsortedArray.push(new Card(bs.SUITS.SPADE, bs.RANKS.KING));
  unsortedArray.push(new Card(bs.SUITS.CLUB, bs.RANKS.SEVEN));

  // Call the function and check
  var sortedArray = sortCards(unsortedArray);
  assert.ok((unsortedArray[0].rank === bs.RANKS.ACE) &&
    (unsortedArray[1].rank === bs.RANKS.SEVEN) &&
    (unsortedArray[2].rank === bs.RANKS.QUEEN) &&
    (unsortedArray[3].rank === bs.RANKS.KING),
    "Properly sorted four cards");
});

QUnit.test("determineHigherRank()", function(assert) {
  assert.ok((determineHigherRank(new Card(bs.SUITS.DIAMOND,
    bs.RANKS.JACK), new Card(bs.SUITS.SPADE, bs.RANKS.THREE)) >
    0), "Rank Jack should exceed Rank 3");
  assert.ok((determineHigherRank(new Card(bs.SUITS.CLUB,
    bs.RANKS.ACE), new Card(bs.SUITS.HEART, bs.RANKS.KING)) <
    0), "Rank Queen should be exceeded by Rank King");
  assert.ok((determineHigherRank(new Card(bs.SUITS.DIAMOND,
    bs.RANKS.FIVE), new Card(bs.SUITS.SPADE, bs.RANKS.FIVE)) ===
    0), "Rank Five should equal Rank Five");
});

QUnit.test("updateHoveredCard()", function(assert) {
  // Check precondition enforcement
  assert.equal(updateHoveredCard("invalidArgument"),
    shared.PRECONDITION_ERROR, "Enforcement of valid parameter");

  // Create artificial environment
  createArtificialPlayers(1);
  createArtificialCards(5, 0);

  bs.currentPlayerIndex = 0;

  assert.equal(updateHoveredCard(1, "reset"), 0,
    "Resetting hovered card works");
  assert.equal(updateHoveredCard(1, "down"), 2, "Hovering down works");
  assert.equal(updateHoveredCard(1, "up"), 0, "Hovering up works");
  assert.equal(updateHoveredCard(4, "down"), 0,
    "Can wrap around from last card to first card");
  assert.equal(updateHoveredCard(0, "up"), 4,
    "Can wrap around from first card to last card");
});

QUnit.test("updateCurrentPlayerIndex()", function(assert) {
  createArtificialPlayers(5);

  assert.equal(updateCurrentPlayerIndex(1), 2,
    "Normal increment from 1 to 2 worked");
  assert.equal(updateCurrentPlayerIndex(4), 0,
    "Wrap around from last player to first player worked");
});

QUnit.test("updateCurrentRank()", function(assert) {
  assert.equal(updateCurrentRank(bs.RANKS.ACE), bs.RANKS.TWO,
    "Normal increment from Ace to Two worked");
  assert.equal(updateCurrentRank(bs.RANKS.TEN), bs.RANKS.JACK,
    "Normal increment from Ten to Jack worked");
  assert.equal(updateCurrentRank(bs.RANKS.KING), bs.RANKS.ACE,
    "Wrap around 'increment' from King to Ace worked");
});

QUnit.test("updateDisplayedCards()", function(assert) {
  $("#qunit-fixture").append("<ul id='displayed-cards'></ul>");

  // Create artificial environment
  createArtificialPlayers(1);
  bs.currentPlayerIndex = 0;
  var numberOfCards = 6;
  createArtificialCards(numberOfCards, bs.currentPlayerIndex);

  updateDisplayedCards();

  assert.equal($("#displayed-cards li").length, numberOfCards,
    "All of the current player's cards are displayed");
});

QUnit.test("displayableRank()", function(assert) {
  assert.equal(displayableRank(bs.RANKS.SEVEN), "SEVEN",
    "Rank 7 is properly converted");
  assert.equal(displayableRank(bs.RANKS.QUEEN), "QUEEN",
    "Rank Queen is properly converted");
});

QUnit.test("displayableSuit()", function(assert) {
  assert.equal(displayableSuit(bs.SUITS.SPADE), "SPADE",
    "Suit Spade is properly converted");
  assert.equal(displayableSuit(bs.SUITS.DIAMOND), "DIAMOND",
    "Rank Diamond is properly converted");
});

QUnit.test("isValidMove()", function(assert) {
  // Create artificial environment
  createArtificialPlayers(1);
  bs.currentPlayerIndex = 0;
  createArtificialCards(3, bs.currentPlayerIndex);

  assert.equal(isValidMove(), false,
    "Requirement that at least one card be selected works");

  // The tested function checks if the user's cards have a certain
  // CSS class, which makes no sense to test here
});