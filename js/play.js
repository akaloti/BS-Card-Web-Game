"use strict";

var bs = {};
bs.deck = [];
bs.DECK_LENGTH = 52;
bs.players = [];
bs.currentPlayerIndex = 0;
bs.SUITS = {SPADE : 'S', HEART : 'H', CLUB : 'C', DIAMOND : 'D'};
bs.RANKS = {ACE : 1, TWO : 2, THREE : 3, FOUR : 4,
  FIVE : 5, SIX : 6, SEVEN : 7, EIGHT : 8, NINE : 9,
  TEN : 10, JACK : 11, QUEEN : 12, KING : 13};
bs.currentRank = bs.RANKS.ACE;

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

function Player() {
  // this.name = name;

  this.cards = [];
}

// Preconditions: none
// Postconditions: bs.deck contains 52 unique instances of class Card,
// each representing a unique card.
// Note that bs.deck will be overritten.
function generateDeck() {
  // Empty the deck
  bs.deck = [];

  for (var s in bs.SUITS) {
    for (var r in bs.RANKS) {
      bs.deck.push(new Card(bs.SUITS[s], bs.RANKS[r]));
    }
  }
}

// Preconditions: No player has any cards. Deck has been generated.
// bs.players.length > 0.
// Postconditions: The deck's cards have been randomly dealt to each player.
// The number of cards each player has should be equal as possible (within
// a tolerance of one). bs.deck is empty.
// Returns false if exception thrown, otherwise returns nothing
function dealOutCards() {
  // enforce bs.players.length precondition to avoid infinite loop
  try {
    if (bs.players.length == 0)
      throw "Exception: There are no players yet. Cancelling dealOutCards()" +
        " to avoid infinite loop.";

    while (bs.deck.length > 0)
    {
      for (var j in bs.players)
      {
        if (bs.deck.length > 0)
        {
          var randomCardIndex = Math.floor(Math.random() * bs.deck.length);
          bs.players[j].cards.push(bs.deck.splice(randomCardIndex, 1).pop());
        }
        else
        {
          // console.log("deck emptied")
          break;
        }
      }
    }
  }
  catch(err) {
    console.log(err);
    return shared.PRECONDITION_ERROR;
  }
}

// Preconditions: bs.players.length = 0.
// bs.MAX_NUMBER_OF_PLAYERS > numberOfPlayers > 0.
// Postconditions: bs.players.length = numberOfPlayers
function createPlayers(numberOfPlayers) {
  try {
    // confirm valid numberOfPlayers
    if (numberOfPlayers > shared.bs.MAX_NUMBER_OF_PLAYERS ||
      numberOfPlayers <= 0)
      throw ("Exception: parameter numberOfPlayers falls outside" +
        " acceptable range.");

    for (var i = 0; i < numberOfPlayers; ++i)
    {
      bs.players.push(new Player());
    }
  }
  catch(err) {
    console.log(err);
    return shared.PRECONDITION_ERROR;
  }
}

// Preconditions: none (empty arrays don't cause bugs)
// Postconditions: Each players' cards are sorted in order of rank
function sortPlayersCards() {
  for (var i in bs.players)
    bs.players[i].cards = sortCards(bs.players[i].cards);
}

// Preconditions: arrayOfCards is an array of instances of Card
// Postcondition: contents of arrayOfCards are sorted from lowest
// rank to highest rank (e.g. 2, 8, K), with no regard to suit.
// Returns: sorted version of arrayOfCards
function sortCards(arrayOfCards) {
  return arrayOfCards.sort(determineHigherRank);
}

// This is a compare function.
// Preconditions: firstCard and secondCard are instances of Card
// Postconditions: none
// Returns: negative number if first's rank is below second's rank,
// zero if the ranks are the same, positive number otherwise
function determineHigherRank(firstCard, secondCard) {
  // Recall that each rank is a numeric constant
  return firstCard.rank - secondCard.rank;
}

// Precondition: there are players (i.e. bs.players.length > 0)
// Postcondition: bs.players has a random order
function randomizePlayerOrder() {
  var resultantArray = [];
  var randomIndex = 0;

  // Randomly, singly move one object from bs.players to resultantArray
  while (bs.players.length > 0) {
    randomIndex = Math.floor(Math.random() * bs.players.length);
    resultantArray.push(bs.players.splice(randomIndex, 1));
  }

  bs.players = resultantArray;
  console.log("sorted");
}

// Precondition: none
// Postcondition: bs.currentPlayerIndex and bs.currentRank have
// each been correctly incremented (with wrap around, if necessary)
function updateIndicators() {
  bs.currentPlayerIndex = updateCurrentPlayerIndex(bs.currentPlayerIndex);
  bs.currentRank = updateCurrentRank(bs.currentRank);
}

// Precondition: 0 <= index <= (bs.players.length - 1)
// Returns: incremented version of argument index
// (with wrap around, if necessary)
function updateCurrentPlayerIndex(index) {
  // Wrap around, if necessary
  if (index + 1 === bs.players.length)
    return 0;
  else
    return (index + 1);
}

// Precondition: rank equals an object in bs.RANKS
// Returns: incremented version of argument rank
// (with wrap around, if necessary)
function updateCurrentRank(rank) {
  // Wrap around, if necessary
  if (rank === bs.RANKS.KING)
    return bs.RANKS.ACE;
  else
    return (rank + 1);
}

// Precondition: None
// Postcondition: The current player indicator and the current card
// indicator have been updated (display-wise).
function displayIndicators() {
  $("#current-player").html(bs.currentPlayerIndex);
  $("#current-rank").html(displayableRank(bs.currentRank));
}

// Precondition: none
// Postcondition: the indicators and the displayed cards have been
// updated
function nextTurn() {
  updateIndicators();
  displayIndicators();
  // updateDisplayedCards();
}

// Precondition: rank === (one of the objects in bs.RANKS)
// Returns: a more reader-friendly version of rank
function displayableRank(rank) {
  // This works because each rank equals a reasonably corresponding
  // numerical value (e.g. SEVEN = 7, QUEEN = 12).
  return Object.keys(bs.RANKS)[rank - 1];
}

// Precondition: game is set up
// Postcondition: went to next turn if user had valid move; otherwise,
// stayed on same turn and alerted user
function submitTurn() {
  // if (validMove())
    nextTurn();
  // else
    // don't go next turn; alert user
}

// Precondition: game hasn't been set up
// Postcondition: functions that set the game up have been called
function setUpGame() {
  generateDeck();
  createPlayers(formData.numberOfPlayers);
  dealOutCards();
  sortPlayersCards();
  randomizePlayerOrder();
  displayIndicators();

  $("a[href='#submit']").click(submitTurn);
}

$(document).ready(function(){
  if (!shared.isUnitTesting()) {
    setUpGame();
  }
});