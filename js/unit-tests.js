"use strict";

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

// Helper function for unit testing of dealOutCards()
function testDealOutCards(assert, numberOfArtificialPlayers) {
  // create an artificial environment with players and that obeys
  // the preconditions
  generateDeck();
  bs.players = [];
  for (var i = 0; i < numberOfArtificialPlayers; ++i)
    bs.players.push(new Player());

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

QUnit.test("updateCurrentPlayerIndex()", function(assert) {
  // Create three players
  bs.players = [];
  for (var i = 0; i < 5; ++i)
    bs.players.push(new Player());

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

/*
QUnit.test( "a basic test example", function( assert ) {
  var value = "hello";
  assert.equal( value, "hello", "We expect value to be hello" );

  assert.ok(false, "false fails");
  assert.ok(true, "true succeeds");
});
*/