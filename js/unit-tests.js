"use strict";

/*
  Author: Aaron Kaloti
  Release number: 0.1
*/

QUnit.module("unit-tests.js");

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

QUnit.module("shared.js");

QUnit.test("shared.preconditionError()", function(assert) {
  assert.deepEqual(shared.preconditionError("This is a test"),
    shared.PRECONDITION_ERROR, "Correct value is returned");
});

QUnit.test("shared.parameterError()", function(assert) {
  assert.deepEqual(shared.parameterError("This is a test"),
    shared.PARAMETER_ERROR, "Correct value is returned");
});

QUnit.module("play.js");

QUnit.test("getCardId()", function(assert) {
  assert.deepEqual(getCardId(bs.SUITS.SPADE, bs.RANKS.ACE),
    "s" + bs.SUITS.SPADE + "r" + bs.RANKS.ACE,
    "Correct id for ace of spades");
  assert.deepEqual(getCardId(bs.SUITS.HEART, bs.RANKS.SIX),
    "s" + bs.SUITS.HEART + "r" + bs.RANKS.SIX,
    "Correct id for six of hearts");
  assert.deepEqual(getCardId(bs.SUITS.DIAMOND, bs.RANKS.KING),
    "s" + bs.SUITS.DIAMOND + "r" + bs.RANKS.KING,
    "Correct id for king of diamonds");
});

QUnit.test("initializeCardBackgroundPositions()", function(assert) {
  bs.positions = [];
  initializeCardBackgroundPositions();

  // Confirm that some of the cards' coordinates are correct
  assert.deepEqual(bs.positions[bs.SUITS.SPADE][bs.RANKS.JACK],
    new Position('-800px', '0px'), "Correct position: jack of spades");
  assert.deepEqual(bs.positions[bs.SUITS.HEART][bs.RANKS.KING],
    new Position('-960px', '-120px'), "Correct position: king of hearts");
  assert.deepEqual(bs.positions[bs.SUITS.CLUB][bs.RANKS.THREE],
    new Position('-160px', '-240px'), "Correct position: three of clubs");
  assert.deepEqual(bs.positions[bs.SUITS.DIAMOND][bs.RANKS.EIGHT],
    new Position('-560px', '-360px'), "Correct position: eight of diamond");
});

QUnit.test("generateDeck()", function(assert) {
  generateDeck();

  assert.deepEqual(bs.deck.length, bs.DECK_LENGTH,
    "bs.deck contains 52 cards");
});

QUnit.test("dealOutCards()", function(assert) {
  testDealOutCards(assert, 1);
  testDealOutCards(assert, 5);
  testDealOutCards(assert, 53);

  // Check the enforcement of the bs.players.length precondition
  bs.players = [];
  assert.deepEqual(dealOutCards(), shared.PRECONDITION_ERROR,
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
  assert.deepEqual(bs.deck.length, 0, "All cards were dealt");
}

QUnit.test("createPlayers()", function(assert) {
  // Create an artificial environment that obeys the preconditions
  bs.players = [];

  // check enforcement of (some) parameter requirements
  assert.deepEqual(createPlayers(-1), shared.PARAMETER_ERROR,
    "-1 should be a rejected parameter");
  assert.deepEqual(createPlayers(0), shared.PARAMETER_ERROR,
    "0 should be a rejected parameter");
  assert.deepEqual(createPlayers(shared.bs.MAX_NUMBER_OF_PLAYERS + 1),
    shared.PARAMETER_ERROR,
    "Any value above shared.bs.MAX_NUMBER_OF_PLAYERS" +
    " should be rejected parameter");

  // reset environment
  bs.players = [];

  var testValue = 5;
  createPlayers(testValue);
  assert.deepEqual(bs.players.length, testValue,
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

QUnit.test("updateCurrentRank()", function(assert) {
  assert.deepEqual(updateCurrentRank(bs.RANKS.ACE), bs.RANKS.TWO,
    "Normal increment from Ace to Two worked");
  assert.deepEqual(updateCurrentRank(bs.RANKS.TEN), bs.RANKS.JACK,
    "Normal increment from Ten to Jack worked");
  assert.deepEqual(updateCurrentRank(bs.RANKS.KING), bs.RANKS.ACE,
    "Wrap around 'increment' from King to Ace worked");
});

QUnit.test("waitForPlayer()", function(assert) {
  assert.deepEqual(waitForPlayer(0, "invalidPurpose", function() {}),
    shared.PARAMETER_ERROR, "Enforcement of valid parameter");
});

QUnit.test("displayableRank()", function(assert) {
  assert.deepEqual(displayableRank(bs.RANKS.SEVEN), "SEVEN",
    "Rank 7 is properly converted");
  assert.deepEqual(displayableRank(bs.RANKS.QUEEN), "QUEEN",
    "Rank Queen is properly converted");
});

QUnit.test("displayableSuit()", function(assert) {
  assert.deepEqual(displayableSuit(bs.SUITS.SPADE), "SPADE",
    "Suit Spade is properly converted");
  assert.deepEqual(displayableSuit(bs.SUITS.DIAMOND), "DIAMOND",
    "Rank Diamond is properly converted");
});

QUnit.test("isValidMove()", function(assert) {
  // Create artificial environment
  createArtificialPlayers(1);
  bs.currentPlayerIndex = 0;
  createArtificialCards(3, bs.currentPlayerIndex);

  assert.deepEqual(isValidMove(), false,
    "Requirement that at least one card be selected works");

  // The tested function checks if the user's cards have a certain
  // CSS class, which makes no sense to test here
});

QUnit.test("submitCards()", function(assert) {
  testSubmitCards(assert, 4, 1);
  testSubmitCards(assert, 3, 2);
  testSubmitCards(assert, 5, 5);
});

/*
  @pre none
  @post three tests have been run: a test of that submitCards()
  returns the correct number of submitted cards, a test of that the
  correct number of cards were taken away from the player, and a test
  of that the correct number of cards were given to the center pile
  @hasTest no
  @param assert mandatory parameter that allows user of unit testing
  methods
  @param numberOfCards to give the artificial player
  @param numberOfCardsToSubmit cannot exceed numberOfCards
  @returns nothing
  @throws nothing
*/
function testSubmitCards(assert, numberOfCards,
  numberOfCardsToSubmit) {
  // Create artificial environment
  createArtificialPlayers(1);
  bs.centerPile = [];
  bs.currentPlayerIndex = 0;
  createArtificialCards(numberOfCards, bs.currentPlayerIndex);

  // Create the illusion that some of the player's cards are selected
  $("#qunit-fixture").append("<div id='displayed-cards'></div>");
  for (var i = 0; i < numberOfCardsToSubmit; ++i)
    $("#displayed-cards").append("<div class='picked'></div>");

  assert.deepEqual(submitCards(), numberOfCardsToSubmit,
    "Function successfully returned the number of selected cards");
  assert.deepEqual(bs.players[bs.currentPlayerIndex].cards.length,
    (numberOfCards - numberOfCardsToSubmit),
    "Correct number of cards were still left to the player");
  assert.deepEqual(bs.centerPile.length, numberOfCardsToSubmit,
    "Correct number of cards were given to center pile");

  // So these tests of submitCards() don't affect the next tests
  // of submitCards()
  $("#qunit-fixture").empty();
}

/*
  @pre bs.currentRank is correct
  @post the requested artificial environment for testing the function
  isBS has been created with three cards
  @hasTest no
  @param firstIsBS true if first card should be given the non-current
  rank, false otherwise
  @param secondIsBS same as firstIsBS, but for second card
  @param thirdIsBS same as firstIsBS, but for third card
  @returns nothing
  @throws nothing
*/
function setUpTestIsBS(firstIsBS, secondIsBS, thirdIsBS) {
  // Empty the center pile
  bs.centerPile = [];

  // Make sure the rank to give the BS cards is different from
  // the current rank
  var bsRank = bs.RANKS.JACK;
  if (bs.currentRank === bs.RANKS.JACK)
    bsRank = bs.RANKS.QUEEN;

  var trivialSuit = bs.SUITS.HEART;

  if (firstIsBS)
    bs.centerPile.push(new Card(trivialSuit, bsRank));
  else
    bs.centerPile.push(new Card(trivialSuit, bs.currentRank));

  if (secondIsBS)
    bs.centerPile.push(new Card(trivialSuit, bsRank));
  else
    bs.centerPile.push(new Card(trivialSuit, bs.currentRank));

  if (thirdIsBS)
    bs.centerPile.push(new Card(trivialSuit, bsRank));
  else
    bs.centerPile.push(new Card(trivialSuit, bs.currentRank));
}

QUnit.test("isBS()", function(assert) {
  // Create aritifical environment
  bs.currentRank = bs.RANKS.JACK;
  bs.numberOfCardsSubmitted = 3;
  setUpTestIsBS(false, false, true);
  assert.deepEqual(isBS(), true, "BS due to one card was detected");
  setUpTestIsBS(true, true, true);
  assert.deepEqual(isBS(), true, "BS due to all bad cards was detected");
  setUpTestIsBS(false, false, false);
  assert.deepEqual(isBS(), false, "Lack of BS was detected");
});

QUnit.test("giveCenterPileTo()", function(assert) {
  // Create artificial center pile
  bs.centerPile = [];
  var numberOfCardsToTransfer = 5;
  for (var i = 0; i < numberOfCardsToTransfer; ++i) {
    bs.centerPile.push(new Card(bs.SUITS.HEART, bs.RANKS.ACE));
  }

  // Create artificial players
  createArtificialPlayers(3);
  var indexPlayerToTransferTo = 2;
  var originalNumberOfCards = 4;
  createArtificialCards(originalNumberOfCards, indexPlayerToTransferTo);

  assert.deepEqual(giveCenterPileTo(indexPlayerToTransferTo),
    numberOfCardsToTransfer, "Number of transferred cards is returned");
  assert.deepEqual(bs.centerPile.length, 0,
    "The center pile has been emptied");
  assert.deepEqual(bs.players[indexPlayerToTransferTo].cards.length,
    (numberOfCardsToTransfer + originalNumberOfCards),
    "The correct player has been given the correct number of cards");
});

QUnit.test("checkForWin()", function(assert) {
  // Create artificial environment in which there are three players
  // and in which only the second player has no cards
  createArtificialPlayers(3);
  createArtificialCards(5, 0);
  createArtificialCards(5, 2);
  bs.winningPlayerIndex = bs.NO_WINNER_INDEX;
  bs.isWinner = false;

  // Call the function and test the postcondition
  checkForWin();
  assert.deepEqual(bs.isWinner, true, "Winner is detected");
  assert.deepEqual(bs.winningPlayerIndex, 1,
    "bs.winningPlayerIndex is correctly associated with the winner");

  // Change the artificial environment so that none of the players
  // are winners
  createArtificialCards(5, 1);
  bs.winningPlayerIndex = bs.NO_WINNER_INDEX;
  bs.isWinner = true; // set to true so that a change can be detected

  // Call the function and test the postcondition
  checkForWin();
  assert.deepEqual(bs.isWinner, false, "Lack of winner is detected");
  assert.deepEqual(bs.winningPlayerIndex, bs.NO_WINNER_INDEX,
    "bs.winningPlayerIndex isn't affected if no winner");
});