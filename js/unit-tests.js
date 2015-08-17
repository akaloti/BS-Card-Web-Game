QUnit.test("generateDeck()", function(assert) {
  generateDeck();

  assert.equal(bs.deck.length, bs.DECK_LENGTH,
    "bs.deck contains 52 cards");
});

QUnit.test("dealOutCards()", function(assert) {
  testDealOutCards(assert, 3);
  testDealOutCards(assert, 5);
  testDealOutCards(assert, 15);
});

function testDealOutCards(assert, numberOfArtificalPlayers) {
  // create an artificial environment with players
  generateDeck();
  bs.players = [];
  for (var i = 0; i < numberOfArtificalPlayers; ++i)
    bs.players.push(new Player());

  // call the function
  dealOutCards();

  // check for (practical) equality of number of cards each player has
  var tolerance = (bs.DECK_LENGTH % numberOfArtificalPlayers == 0) ?
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

  assert.ok(toleranceSatisfied, "Cards distributed as equally as possible");
  assert.equal(bs.deck.length, 0, "All cards were dealt");
}

/*
QUnit.test( "a basic test example", function( assert ) {
  var value = "hello";
  assert.equal( value, "hello", "We expect value to be hello" );

  assert.ok(false, "false fails");
  assert.ok(true, "true succeeds");
});
*/