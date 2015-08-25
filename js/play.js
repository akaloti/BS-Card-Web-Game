"use strict";

var bs = {};
bs.deck = [];
bs.centerPile = []; // players submit cards to this pile
bs.DECK_LENGTH = 52;
bs.players = [];
bs.currentPlayerIndex = 0;
bs.currentBSAskingIndex = 0; // current player whose being asked if
                             // wishes to call BS
bs.currentHoveredCardIndex = 0;
bs.SUITS = {SPADE : 0, HEART : 1, CLUB : 2, DIAMOND : 3};
bs.RANKS = {ACE : 1, TWO : 2, THREE : 3, FOUR : 4,
  FIVE : 5, SIX : 6, SEVEN : 7, EIGHT : 8, NINE : 9,
  TEN : 10, JACK : 11, QUEEN : 12, KING : 13};
bs.currentRank = bs.RANKS.ACE;
bs.isWinner = false;
bs.NO_WINNER_INDEX = -1;
bs.winningPlayerIndex = bs.NO_WINNER_INDEX;

/*
  @pre none
  @post instance of class Card created
  @hasTest no
  @param suit the suit of the card
  @param rank the rank of the card
  @returns nothing
  @throws nothing
*/
function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;

  // coordinates of image on sprite sheet
  // this.x = [get from list]
  // this.y = [get from list]
}

/*
  @pre none
  @post instance of class Player created
  @hasTest no
  @returns nothing
  @throws nothing
*/
function Player() {
  // this.name = name;

  this.cards = [];
}

/*
  @pre none
  @post bs.deck contains 52 unique instances of class Card,
  each representing a unique card.
  @hasTest yes
  @returns none
  @throws none
*/
function generateDeck() {
  // Empty the deck
  bs.deck = [];

  for (var s in bs.SUITS) {
    for (var r in bs.RANKS) {
      bs.deck.push(new Card(bs.SUITS[s], bs.RANKS[r]));
    }
  }
}

/*
  @pre  No player has any cards. Deck has been generated.
  bs.players.length > 0.
  @post The deck's cards have been randomly dealt to each player.
  The number of cards each player has should be equal as possible
  (within a tolerance of one). bs.deck is empty.
  @hasTest yes
  @returns return value of shared.preconditionError()
  if precondition error
  @throws (caught) exception if no players
*/
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
    return shared.preconditionError(err);
  }
}

/*
  @pre bs.players.length = 0.
  @post bs.players.length = numberOfPlayers
  @hasTest yes
  @param numberOfPlayers to create
  bs.MAX_NUMBER_OF_PLAYERS > numberOfPlayers > 0.
  @returns return value of shared.preconditionError()
  if precondition error
  @throws (caught) exception if invalid number of players
*/
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
    return shared.preconditionError(err);
  }
}

/*
  @pre none (empty arrays don't cause bugs)
  @post Each players' cards are sorted in order of rank
  @hasTest no
  @returns nothing
  @throws nothing
*/
function sortPlayersCards() {
  for (var i in bs.players)
    bs.players[i].cards = sortCards(bs.players[i].cards);
}

/*
  @pre none
  @post contents of arrayOfCards are sorted from lowest
  rank to highest rank (e.g. 2, 8, K), with no regard to suit.
  @hasTest yes
  @param arrayOfCards array of instances of Card
  @returns sorted version of arrayOfCards
  @throws nothing
*/
function sortCards(arrayOfCards) {
  return arrayOfCards.sort(determineHigherRank);
}

/*
  This is a compare function.
  @pre none
  @post none
  @hasTest yes
  @param firstCard instance of Card
  @param secondCard instance of Card
  @returns negative number if first's rank is below second's rank,
  zero if the ranks are the same, positive number otherwise
  @throws nothing
*/
function determineHigherRank(firstCard, secondCard) {
  // Recall that each rank is a numeric constant
  return firstCard.rank - secondCard.rank;
}

/*
  @pre there are players (i.e. bs.players.length > 0)
  @post bs.players has a random order
  @hasTest no (testing randomness isn't useful)
  @returns nothing
  @throws nothing
*/
function randomizePlayerOrder() {
  var resultantArray = [];
  var randomIndex = 0;

  // Randomly, singly move one object from bs.players to resultantArray
  while (bs.players.length > 0) {
    randomIndex = Math.floor(Math.random() * bs.players.length);
    resultantArray.push(bs.players.splice(randomIndex, 1).pop());
  }

  bs.players = resultantArray;
}

/*
  @pre none
  @post bs.currentPlayerIndex and bs.currentRank have
  each been correctly incremented (with wrap around, if necessary).
  bs.currentHoveredCardIndex has been reset to 0.
  @hasTest no
  @returns nothing
  @throws nothing
*/
function updateIndicators() {
  bs.currentPlayerIndex =
    getIncrementedPlayerIndex(bs.currentPlayerIndex);
  bs.currentRank = updateCurrentRank(bs.currentRank);
  bs.currentHoveredCardIndex = updateHoveredCard(
    bs.currentHoveredCardIndex, "reset");
}

/*
  @pre none
  @post correct card is hovered over by user's selector
  @hasTest yes
  @param index array index of currently selected card
  @param action indicates what to do and has any of the
  following values: "reset", "up", "down"
  @returns if "reset", then 0; if "up", then
  bs.currentHoveredCardIndex - 1; if "down", then
  bs.currentHoveredCardIndex + 1 (wrap around if necessary); if invalid
  value for action, return value of shared.preconditionError()
  @throws (caught) exception if invalid vlaue of action
*/
function updateHoveredCard(index, action) {
  try {
    $("#displayed-cards li:nth-child(" + (index + 1) + ')').
      removeClass("hovered");
    var newIndex = 0;

    if (action === "reset") {
      newIndex = 0;
    }
    else if (action === "up") {
      // Wrap around, if necessary
      if (index === 0)
        newIndex = bs.players[bs.currentPlayerIndex].cards.length - 1;
      else
        newIndex = (index - 1);
    }
    else if (action === "down") {
      // Wrap around, if necessary
      if (index + 1 === bs.players[bs.currentPlayerIndex].cards.length)
        newIndex = 0;
      else
        newIndex = (index + 1);
    }
    else {
      throw "Exception: Invalid argument for updateHoveredCard()";
    }

    $("#displayed-cards li:nth-child(" + (newIndex + 1) + ')').
      addClass("hovered");
    return newIndex;
  }
  catch(err) {
    return shared.preconditionError(err);
  }
}

/*
  @pre none
  @post n/a
  @hasTest yes
  @param index such that 0 <= index <= (bs.players.length - 1)
  @returns incremented version of argument index
  (with wrap around, if necessary)
  @throws nothing
*/
function getIncrementedPlayerIndex(index) {
  // Wrap around, if necessary
  if (index + 1 === bs.players.length)
    return 0;
  else
    return (index + 1);
}

/*
  @pre none
  @post n/a
  @hasTest yes
  @param  rank an object in bs.RANKS
  @returns incremented version of argument rank
  (with wrap around, if necessary)
  @throws nothing
*/
function updateCurrentRank(rank) {
  // Wrap around, if necessary
  if (rank === bs.RANKS.KING)
    return bs.RANKS.ACE;
  else
    return (rank + 1);
}

/*
  @pre none
  @post The current player indicator and the current card
  indicator have been updated (display-wise).
  @hasTest no
  @returns nothing
  @throws nothing
*/
function displayIndicators() {
  $("#current-player").html(bs.currentPlayerIndex + 1);
  $("#current-rank").html(displayableRank(bs.currentRank));
}

/*
  @pre none
  @post the indicators and the displayed cards have been
  updated; the first card is hovered over
  @hasTest no
  @returns nothing
  @throws nothing
*/
function nextTurn() {
  updateIndicators();
  displayIndicators();
  updateDisplayedCards(bs.currentPlayerIndex);
  bs.currentHoveredCardIndex = updateHoveredCard(
    bs.currentHoveredCardIndex, "reset");
}

/*
  @pre bs.currentPlayerIndex has been updated
  @post webpage displays list of current player's cards
  @hasTest yes
  @param playerIndex index of the player whose cards to display
  @returns nothing
  @throws nothing
*/
function updateDisplayedCards(playerIndex) {
  // Clear the previous list
  $("#displayed-cards").html("");

  // Create the current list
  var cards = bs.players[playerIndex].cards;
  for (var cardIndex in cards) {
    $("#displayed-cards").append("<li>" +
      displayableRank(cards[cardIndex].rank) + " of " +
      displayableSuit(cards[cardIndex].suit) + "</li>");
  }
}

/*
  @pre none
  @post n/a
  @hasTest yes
  @param rank one of the objects in bs.RANKS
  @returns a more reader-friendly version of rank
  @throws nothing
*/
function displayableRank(rank) {
  // This works because each rank equals a reasonably corresponding
  // numerical value (e.g. SEVEN = 7, QUEEN = 12).
  return Object.keys(bs.RANKS)[rank - 1];
}

/*
  @pre none
  @post n/a
  @hasTest yes
  @param suit one of the objects in bs.SUITS
  @returns a more reader-friendly version of suit
  @throws nothing
*/
function displayableSuit(suit) {
  return Object.keys(bs.SUITS)[suit];
}

/*
  @pre game is set up
  @post went to next turn if user had valid move; otherwise,
  stayed on same turn and alerted user
  @hasTest no
  @returns nothing
  @throws nothing
*/
function submitTurn() {
  if (isValidMove()) {
    announceSubmission(submitCards());

    bs.currentBSAskingIndex =
      getIncrementedPlayerIndex(bs.currentPlayerIndex);
    askIfCallBS(bs.currentBSAskingIndex);

    // checkForWin();

    // if (bs.isWinner) {
      // updateWebpageForWinner();
    // }
    // else
      // nextTurn();
  }
  else
    alert("Invalid move: please pick at least one card");
}

/*
  @pre user submitted cards that he/she owns, game indicators
  (e.g. current player) are correct
  @post n/a
  @hasTest yes
  @returns true if user submitted at least one card; false otherwise
  @throws nothing
*/
function isValidMove() {
  if ($("#displayed-cards li.picked").length === 0)
    return false;
  else
    return true;
}

/*
  @pre game indicators (e.g. current player) are correct; at least
  one of the current player's cards is selected
  @post current player's selected cards have been transferred
  to the center pile
  @hasTest yes
  @returns number of cards transferred
  @throws nothing
*/
function submitCards() {
  var cssClassPicked = "picked";
  var numberOfCardsSubmitted = 0;
  var indexesOfSubmittedCards = [];

  // Traverse the list of the player's cards; figure out which ones
  // have the class "picked"
  for (var i = 0; i < bs.players[bs.currentPlayerIndex].cards.length;
    ++i)
  {
    var cardToTest = "#displayed-cards li:nth-child(" + (
      i + 1) + ')';
    if ($(cardToTest).hasClass(cssClassPicked)) {
      // mark the index of the card to remove from the player
      indexesOfSubmittedCards.push(i);
    }
  }

  // Transfer the picked cards from the current
  // player to the center pile
  for (var j = 0; j < indexesOfSubmittedCards.length; ++j) {
    // The index must be adjusted to account for already removed
    // elements (i.e. if two cards are removed, the indexes of
    // the later cards drop by 2)
    var indexOfSubmittedCard = indexesOfSubmittedCards[j] - j;

    bs.centerPile.push(bs.players[bs.currentPlayerIndex].cards.
      splice(indexOfSubmittedCard, 1).pop());
    ++numberOfCardsSubmitted;
  }

  return numberOfCardsSubmitted;
}

/*
  @pre game indicators are correct
  @post the webpage says how many cards were submitted by the current
  player and what rank the cards were
  @hasTest no
  @param numberOfCardsSubmitted by the player who has submitted
  his choice
  @returns nothing
  @throws nothing
*/
function announceSubmission(numberOfCardsSubmitted) {
  var output = "Player " + (bs.currentPlayerIndex + 1) + " has " +
    "submitted " + numberOfCardsSubmitted + " cards of rank " +
    displayableRank(bs.currentRank);
  $("#announcement").html(output);
}

/*
  @pre none besides the obvious (e.g. players exist)
  @post each player (besides the current turn's player) has been
  asked (in order) if she wants to call BS
  @hasTest no
  @returns none
  @throws none
*/
function checkForCallsBS() {
  for (var i = 0; i < bs.players.length; ++i) {
    if (i != bs.currentPlayerIndex) {
      askIfCallBS(i);
    }
  }
}

/*
  @pre none
  @post the player indicated by playerIndex has been shown his cards
  and asked if he wants to call "BS" on the current player's move
  @hasTest no
  @param playerIndex the index in bs.players of the player to ask;
  playerIndex != bs.currentPlayerIndex
  @returns nothing
  @throws nothing
*/
function askIfCallBS(playerIndex) {
  // replace the current turn's player's cards by the asked player's
  // cards
  updateDisplayedCards(playerIndex);

  // generate the prompt
  $("#prompt").html("Player " + (playerIndex + 1) +
    ", would you like to call BS?");

  // temporarily hide the submit button
  createSubmitButton(false);

  // temporarily disable event handlers
  enableResponseToKeyPresses(false);

  // add yes and no buttons;
  // if the yes button is clicked, the call of BS is checked and
  // evaluated, then a win is checked, and if there is no win, the
  // game continues and the submit button is returned
  // if the no button is called, the next player index is checked
  // to determine whether to check for a win and (if there is no win)
  // return the submit button, or to determine whether to call
  // this function again with the next index.
}

/*
  @pre nothing significant (e.g. players exist); can't be more than
  one player with no cards (which would be impossible in the game)
  @post if a player has no cards left, he's marked as the winner
  through an update of bs.winningPlayerIndex, and the game is
  told that a winner exists through an update of bs.isWinner
  @hasTest yes
  @returns nothing
  @throws nothing
*/
function checkForWin() {
  for (var i = 0; i < bs.players.length; ++i) {
    if (bs.players[i].cards.length === 0) {
      bs.isWinner = true;
      bs.winningPlayerIndex = i;
      return;
    }
  }

  bs.isWinner = false;
  bs.winningPlayerIndex = bs.NO_WINNER_INDEX;
}

/*
  @pre there is a winner
  @post webpage is redesigned in a way that makes it clear who the
  winner is
  @hasTest no
  @returns nothing
  @throws nothing
*/
function updateWebpageForWinner() {
  announceWinner();
  removeCardInteraction();
}

/*
  @pre bs.winningPlayerIndex is updated
  @post the winning player is announced on the webpage
  @hasTest no (because testing the use of a jQuery function isn't
  useful)
  @returns nothing
  @throws nothing
*/
function announceWinner() {
  $("#announcement").html("The winner is: Player " +
    (bs.winningPlayerIndex + 1));
}

/*
  @pre none
  @post any means that the players can use to interact with cards
  has been removed
  @hasTest no
  @returns nothing
  @throws nothing
*/
function removeCardInteraction() {
  $("#game-indicators").remove();
  $("#card-display").remove();
  createSubmitButton(false);
}

/*
  @pre game hasn't been set up
  @post functions that set the game up have been called
  @hasTest no
  @returns nothing
  @throws nothing
*/
function setUpGame() {
  generateDeck();
  createPlayers(formData.numberOfPlayers);
  dealOutCards();
  sortPlayersCards();
  randomizePlayerOrder();
  displayIndicators();
  updateDisplayedCards(bs.currentPlayerIndex);
  $("#displayed-cards li:first-child").
      addClass("hovered");

  createSubmitButton(true);
  enableResponseToKeyPresses(true);
}

/*
  @pre none
  @post see @param
  @hasTest no
  @param bool true if want to generate submit button and click handler;
  false if want to remove it
  @returns nothing
  @throws nothing
*/
function createSubmitButton(bool) {
  if (bool) {
    $("#submit-button").append(
      "<a href='#submit-button'>Submit</a>");
    $("a[href='#submit-button']").click(submitTurn);
  }
  else
    $("#submit-button").empty();
}

/*
  @pre none
  @post see @param
  @hasTest no
  @param bool true to enable responses to key presses; false otherwise
  @returns nothing
  @throws nothing
*/
function enableResponseToKeyPresses(bool) {
  if (bool)
    $(document).on("keydown", function(e) {
      var keyCodeDown = 40;
      var keyCodeUp = 38;
      var keyCodeSpace = 32;
      if (e.which === keyCodeDown)
        bs.currentHoveredCardIndex = updateHoveredCard(
          bs.currentHoveredCardIndex, "down");
      else if (e.which === keyCodeUp)
        bs.currentHoveredCardIndex = updateHoveredCard(
          bs.currentHoveredCardIndex, "up");
      else if (e.which === keyCodeSpace)
        selectOrUnselectCard();
    });
  else
    $(document).off("keydown");
}

/*
  @pre bs.currentHoveredCardIndex is updated
  @post if user can select the card marked by
  bs.currentHoveredCardIndex, the card will be selected; if the card
  was already selected, it will be unselected
  @hasTest no
  @returns nothing
  @throws nothing
*/
function selectOrUnselectCard() {
  var cardToAffect = "#displayed-cards li:nth-child(" + (
    bs.currentHoveredCardIndex + 1) + ')';
  var cssClassPicked = "picked";

  if ($(cardToAffect).hasClass(cssClassPicked)) {
    // deselect if card already is picked
    $(cardToAffect).removeClass(cssClassPicked);
  }
  else {
    // select an unselected card
    $(cardToAffect).addClass(cssClassPicked);
  }
}

$(document).ready(function(){
  if (!shared.isUnitTesting()) {
    setUpGame();
  }
});