"use strict";

var bs = {};
bs.deck = [];
bs.DECK_LENGTH = 52;
bs.players = [];
bs.MAX_NUMBER_OF_PLAYERS = 6;

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

  var suits = ['S', 'H', 'C', 'D'];
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J',
    'Q', 'K'];

  for (var s in suits) {
    for (var r in ranks) {
      // console.log(cardName);
      bs.deck.push(new Card(suits[s], ranks[r]));
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


  for (var i = 0; i < numberOfPlayers; ++i)
  {
    // var player = new Player();
    bs.players.push(new Player());
  }
}

function setUpGame() {
  generateDeck();
  createPlayers();
  dealOutCards();
}

$(document).ready(function(){
  setUpGame();
});