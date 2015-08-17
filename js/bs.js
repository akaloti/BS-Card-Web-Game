var bs = {};
bs.deck = [];
bs.DECK_LENGTH = 52;
bs.players = [];

function Card(name) {
  this.name = name;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

function Player() {
  this.name = name;

  this.cards = [];
}

// Precondition: none
// Postcondition: bs.deck contains 52 unique instances of class Card,
// each representing a unique card. Each instance's name consists of
// two letters, the former
// indicating the suit, and the latter indicating the rank.
// Note that bs.deck will be overritten.
function generateDeck() {
  // Empty the deck
  bs.deck = [];

  var suits = ['S', 'H', 'C', 'D'];
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J',
    'Q', 'K'];

  var cardName = "";
  for (var s in suits) {
    cardName += suits[s];
    for (var r in ranks) {
      // append the rank
      cardName += ranks[r];

      // console.log(cardName);
      bs.deck.push(new Card(cardName));

      // reset the card back to just the suit
      cardName = suits[s];
    }
    cardName = "";
  }
}

// Precondition: No player has any cards. Deck has been generated.
// bs.players.length > 0.
// Postcondition: The deck's cards have been randomly dealt to each player.
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
    return false;
  }
}

// Precondition: main menu hasn't been set up
// Postcondition: a form requesting settings appears if the user selects "Play"
function setUpMenu() {
  // $("a[href='#game']").click(function() {
  $("a[href='#main-menu-options']").click(function() {
    $(this).after("<form method='post'>" +
      "Number of players: <input type='text' name='number-of-players'><br>" +
      "</form>");
  });
}

function setUpGame() {
  generateDeck();
  for (var i = 0; i < 3; ++i)
  {
    var player = new Player();
    bs.players.push(player);
  }
  dealOutCards();
}

$(document).ready(function(){
  setUpMenu();
});