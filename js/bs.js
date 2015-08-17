var bs = {};
bs.deck = [];

function Card(name) {
  this.name = name;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

// Precondition: bs.deck is empty
// Postcondition: bs.deck contains 52 unique strings, each representing
// a unique card. Each string consists of two letters, the former
// indicating the suit, and the latter indicating the rank.
function generateDeck() {
  var suits = ['S', 'H', 'C', 'D'];
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J',
    'Q', 'K'];

  var card = "";
  for (var s in suits) {
    card += suits[s];
    for (var r in ranks) {
      // append the rank
      card += ranks[r];

      console.log(card);
      bs.deck.push(card);

      // reset the card back to just the suit
      card = suits[s];
    }
    card = "";
  }
}

$(document).ready(function(){
  generateDeck();
});