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

/*
QUnit.test( "a basic test example", function( assert ) {
  var value = "hello";
  assert.equal( value, "hello", "We expect value to be hello" );

  assert.ok(false, "false fails");
  assert.ok(true, "true succeeds");
});
*/