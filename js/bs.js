var bs = {};
bs.deck = [];

function Card(name) {
  this.name = name;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

// Precondition: none
// Postcondition: bs.deck contains 52 unique strings, each representing
// a unique card. Each string consists of two letters, the former
// indicating the suit, and the latter indicating the rank.
function generateDeck() {
  var suits = ['S', 'H', 'C', 'D'];
  var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J',
    'Q', 'K'];

  var output = "";
  for (var s in suits) {
    output += suits[s];
    for (var r in ranks) {
      // append the rank
      output += ranks[r];

      console.log(output);
      bs.deck.push(output);

      // reset the card back to just the suit
      output = suits[s];
    }
    output = "";
  }
}

$(document).ready(function(){
  generateDeck();
});