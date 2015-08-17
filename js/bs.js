var bs = {};
bs.deck = [];

function Card(name) {
  this.name = name;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

// Precondition: bs.deck is empty
// Postcondition: bs.deck contains 52 unique instances of class Card,
// each representing a unique card. Each instance's name consists of
// two letters, the former
// indicating the suit, and the latter indicating the rank.
function generateDeck() {
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

$(document).ready(function(){
  generateDeck();
});