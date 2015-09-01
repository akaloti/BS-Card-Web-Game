"use strict";

/*
  Author: Aaron Kaloti
  Release number: 0.1
*/

var bs = {};
bs.deck = [];
bs.centerPile = []; // players submit cards to this pile
bs.DECK_LENGTH = 52;
bs.positions = []; // of each card on sprite sheet
bs.players = [];
bs.currentPlayerIndex = 0;
bs.currentBSAskingIndex = 0; // current player whose being asked if
                             // wishes to call BS
bs.currentHoveredCardIndex = 0;
bs.canSelectCards = false;
bs.SUITS = {SPADE : 0, HEART : 1, CLUB : 2, DIAMOND : 3};
bs.RANKS = {ACE : 1, TWO : 2, THREE : 3, FOUR : 4,
  FIVE : 5, SIX : 6, SEVEN : 7, EIGHT : 8, NINE : 9,
  TEN : 10, JACK : 11, QUEEN : 12, KING : 13};
bs.currentRank = bs.RANKS.ACE;
bs.isWinner = false;
bs.NO_WINNER_INDEX = -1;
bs.winningPlayerIndex = bs.NO_WINNER_INDEX;
bs.numberOfCardsSubmitted = 0; // updated each turn

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
  @post see @returns
  @hasTest yes
  @param suit of the card
  @param rank of the card
  @returns the appropriate HTML id for the card specified by the
  suit and rank (e.g. "s0r1" for ace of spades)
  @throws nothing
*/
function getCardId(suit, rank) {
  return 's' + suit + 'r' + rank;
}

/*
  @pre none
  @post instance of class Positions created
  @hasTest no
  @param x x-coordinate of the position (with suffix (e.g. 'px') at
  end if needed)
  @param y y-coordinate of the position (with suffix at end if needed)
  @returns nothing
  @throws nothing
*/
function Position(x, y) {
  this.x = x;
  this.y = y;
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
  @pre bs.positions is an empty array
  @post bs.positions has coordinates of sprite for each
  card in spritesheet
  @hasTest yes
  @returns nothing
  @throws nothing
*/
function initializeCardBackgroundPositions() {
  var y = 0;
  var CARD_HEIGHT = 120;
  var x = 0;
  var CARD_WIDTH = 80;

  for (var s in bs.SUITS) {
    bs.positions[bs.SUITS[s]] = [];
    x = 0;

    for (var r in bs.RANKS) {
      bs.positions[bs.SUITS[s]][bs.RANKS[r]] =
        new Position(x + 'px', y + 'px');
      x -= CARD_WIDTH;
    }
    y -= CARD_HEIGHT;
  }
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
          break;
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
  @returns return value of shared.parameterError()
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
    return shared.parameterError(err);
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
  waitForPlayer(bs.currentPlayerIndex, "pick", function() {
    displayIndicators();
    displayCards("displayed-cards",
      bs.players[bs.currentPlayerIndex].cards);
    promptPickCards();
  });
}

/*
  @pre none
  @post the webpage informs the player to pick cards
  @hasTest no
  @returns nothing
  @throws nothing
*/
function promptPickCards() {
  $("#announcement").html("Please pick cards and hit Submit.");
}

/*
  @pre none
  @post webpage is hidden, except for a message telling the demanded
  player (indicatd by playerIndex) to press spacebar
  @hasTest yes (but only for parameter enforcement)
  @param playerIndex the index in bs.players of the player who is
  being waited for
  @param purpose "pick" if purpose is to let the player pick cards;
  "ask" if purpose is to ask if the player wants to call BS
  @param endCallback code (e.g. function) specifying what to do
  after the player indicated by playerIndex presses the key
  @returns nothing
  @throws nothing
*/
function waitForPlayer(playerIndex, purpose, endCallback) {
  $("#game").addClass("invisible");
  enableGameResponseToKeyPresses(false);

  try {
    if (purpose === "pick") {
      $("#between-turns-announcements").html(
        "<p id='interim'>Please have player " + (playerIndex + 1) +
        " press the spacebar so he/she can pick cards. " +
        "Everyone else should look away once" +
        " he/she presses this key.</p>");
    }
    else if (purpose === "ask") {
      $("#between-turns-announcements").html(
        "<p id='interim'>Please have player " + (playerIndex + 1) +
        " press the spacebar so he/she can decide whether" +
        " or not to call BS. " +
        "Everyone else should look away once" +
        " he/she presses this key.</p>");
    }
    else {
      throw "Exception: Invalid value for parameter purpose in" +
        " waitForPlayer()";
    }
  }
  catch(err) {
    return shared.parameterError(err);
  }

  // set event handler that contains function to make webpage
  // reappear and enable key interaction
  $(document).on("keydown", function(e) {
    var keyCodeSpace = 32;
    if (e.which === keyCodeSpace) {
      $(document).off("keydown");
      $("#between-turns-announcements").html("");
      $("#game").removeClass("invisible");
      enableGameResponseToKeyPresses(true);

      // Remove the BS announcement
      $("#everyone-announcement").html("");
      revealSubmittedCards(false);

      endCallback();
    }
  });
}

/*
  @pre bs.positions is correct
  @post elements have been appended to the element noted by divId
  so that each card in arrayOfCards is graphically displayed in
  that noted element
  @hasTest no (because, for the most part, only other functions
  are called)
  @param divId id (without the '#') of the element to attach the
  cards to
  @param arrayOfCards the cards to display
  @returns nothing
  @throws nothing
*/
function displayCards(divId, arrayOfCards) {
  // Clear any already existing display
  $('#' + divId).html("");

  // variables for positioning each sprite
  var HORIZONTAL_GAP = 100; // horizontal distance between cards
  var left = HORIZONTAL_GAP;
  var VERTICAL_GAP = 150; // vertical distance between cards
  var top = 0;

  for (var cardIndex in arrayOfCards) {
    var suit = arrayOfCards[cardIndex].suit;
    var rank = arrayOfCards[cardIndex].rank;
    var spriteBackgroundPosition = bs.positions[suit][rank].x +
      ' ' + bs.positions[suit][rank].y;
    var id = getCardId(suit, rank);

    // It's okay for submitted cards to have this onclick attribute
    // because whether or not a player can select cards is stored
    // in bs.canSelectCards, which is checked by selectOrUnselectCard()
    var onclickValue = "selectOrUnselectCard('" + id + "')";

    $('#' + divId).append("<div class='card' onclick=" +
      onclickValue + " id=" + id + "></div>");
    $("#" + id).css({"background-position" : spriteBackgroundPosition,
      "left" : (left + "px"), "top" : (top + "px")});

    left += HORIZONTAL_GAP;
    if ((left + 80 + HORIZONTAL_GAP) > $(window).width()) {
      left = HORIZONTAL_GAP;
      top += VERTICAL_GAP;
    }
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
    bs.numberOfCardsSubmitted = submitCards();
    announceSubmission(bs.numberOfCardsSubmitted);

    bs.currentBSAskingIndex =
      getIncrementedPlayerIndex(bs.currentPlayerIndex);
    askIfCallBS();
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
  if ($("#displayed-cards div.picked").length === 0)
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
    var cardToTest = "#displayed-cards div:nth-child(" + (
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
  @pre bs.currentBSAskingIndex is correct
  @post the player indicated by playerIndex has been shown his cards
  and asked if he wants to call "BS" on the current player's move
  @hasTest no
  @returns nothing
  @throws nothing
*/
function askIfCallBS() {
  waitForPlayer(bs.currentBSAskingIndex, "ask", function() {
    prepareWebpageForGaming(false);
    prepareWebpageForAskBS(true);
  });
}

/*
  @pre none
  @post see @param
  @hasTest no
  @param bool true to prepare webpage for continuing the game (i.e.
  moving from the state of prompting players to call BS); false
  to unprepare the webpage
  @returns nothing
  @throws nothing
*/
function prepareWebpageForGaming(bool) {
  createSubmitButton(bool);
  enableGameResponseToKeyPresses(bool);
}

/*
  @pre bs.currentBSAskingIndex is correct
  @post see @param
  @hasTest no
  @param bool true to set up the webpage to ask a player if she wants
  to call BS; false to remove those elements regarding that setup
  @returns nothing
  @throws nothing
*/
function prepareWebpageForAskBS(bool) {
  if (bool) {
    // replace the current turn's player's cards by the asked player's
    // cards
    displayCards("displayed-cards",
      bs.players[bs.currentBSAskingIndex].cards);

    // generate the prompt
    $("#call-bs-prompt").html("Player " +
      (bs.currentBSAskingIndex + 1) + ", would you like to call BS?");

    createBSCallButtons(true);
  }
  else {
    // remove the prompt
    $("#call-bs-prompt").html("");

    createBSCallButtons(false);
  }
}

/*
  @pre bs.currentPlayerIndex and bs.currentBSAskingIndex are correct
  @post see @param
  @hasTest no
  @param bool true if a player is calling BS, so the game will resolve
  this call; false if player isn't calling BS, so the game will either
  ask the next player, check for a win, or go to the next turn
  @returns nothing
  @throws nothing
*/
function callBS(bool) {
  if (bool) {
    prepareWebpageForAskBS(false);
    revealSubmittedCards(true);

    var wasBS = announceCallBS();

    resolveBSCall(wasBS);
  }
  else {
    // if the no button is called, the next player index is checked
    // to determine whether to check for a win and (if there is no win)
    // return the submit button, or to determine whether to call
    // this function again with the next index.

    bs.currentBSAskingIndex =
      getIncrementedPlayerIndex(bs.currentBSAskingIndex);

    if (bs.currentBSAskingIndex === bs.currentPlayerIndex) {
      // each of the applicable players have been asked if
      // he/she wants to call BS

      continueGameFromBSPrompting()
    }
    else {
      // ask the next player if she wants to call BS;
      // update the prompt
      prepareWebpageForAskBS(false);
      askIfCallBS();
    }
  }
}

/*
  @pre bs.currentPlayerIndex and bs.currentBSAskingIndex are correct
  @post the result of a player's calling BS has been announced
  @hasTest no (because returns result of isBS(), which is tested)
  @returns true if the current player was lying, false otherwise
  @throws nothing
*/
function announceCallBS() {
  // The difference in verb tense is for the sake of avoiding
  // conflicting names
  var wasBS = isBS();
  if (wasBS) {
    $("#everyone-announcement").html(
      "<b>" +
      "Player " + (bs.currentPlayerIndex + 1) +
      " was lying! He/she gets the center pile.</b>");
  }
  else {
    $("#everyone-announcement").html(
      "<b>" +
      "Player " + (bs.currentPlayerIndex + 1) +
      " wasn't lying! Player " + (bs.currentBSAskingIndex + 1) +
      " gets the center pile.</b>");
  }

  return wasBS;
}

/*
  @pre bs.currentPlayerIndex and bs.currentBSAskingIndex are correct
  @post the center pile has been given to whoever deserves it based
  on whether the call of BS was correct, and the game is set up to
  continue, either by responding to a victory or going on to the next
  turn
  @hasTest no (because this function practically only calls other
  functions)
  @param wasLie true if the player who submitted cards was lying;
  false if he was telling the truth
  @returns nothing
  @throws nothing
*/
function resolveBSCall(wasLie) {
  if (wasLie) {
    giveCenterPileTo(bs.currentPlayerIndex);
  }
  else {
    giveCenterPileTo(bs.currentBSAskingIndex);
  }

  continueGameFromBSPrompting();
}

/*
  @pre none
  @post the game is set up to continue, either by responding to victory
  or by going on to the next turn
  @hasTest no (because calls other functions only)
  @returns nothing
  @throws nothing
*/
function continueGameFromBSPrompting() {
  // Fix the webpage
  prepareWebpageForAskBS(false);
  $("#announcement").html("");

  checkForWin();
  if (bs.isWinner) {
    updateWebpageForWinner();
  }
  else {
    // continue game
    prepareWebpageForGaming(true);
    nextTurn();
  }
}

/*
  @pre bs.currentRank, bs.numberOfCardsSubmitted, and bs.centerPile
  are correct
  @post n/a
  @hasTest yes
  @returns true if not all of the submitted cards are of the current
  rank; false otherwise
  @throws nothing
*/
function isBS() {
  // Check a number of cards at the top of the center pile equal
  // to the number of cards submitted
  for (var i = 0; i < bs.numberOfCardsSubmitted; ++i) {
    var cardToCheck = bs.centerPile[bs.centerPile.length - 1 - i];
    if (cardToCheck.rank !== bs.currentRank)
      return true;
  }
  return false;
}

/*
  @pre bs.numberOfCardsSubmitted, bs.currentPlayerIndex, and
  bs.centerPile are correct
  @post the webpage displays the submitted cards
  @hasTest no
  @param bool true if wish to show submitted cards; false to remove
  the display
  @returns nothing
  @throws nothing
*/
function revealSubmittedCards(bool) {
  if (bool) {
    $("#submission-display").append("<p>Player " +
      (bs.currentPlayerIndex + 1) + " submitted the following:</p>");
    var cardsToDisplay = bs.centerPile.slice(
      (bs.centerPile.length - bs.numberOfCardsSubmitted));
    $("#submission-display").append("<div id='submitted-cards'></div>");
    displayCards("submitted-cards", cardsToDisplay);
  }
  else
    $("#submission-display").empty();
}

/*
  @pre bs.centerPile is correct
  @post all the cards in bs.centerPile have been transferred to the
  player indicated by playerIndex, and that player's cards have
  been sorted
  @hasTest yes
  @param playerIndex the index of the player in bs.players that will
  receive the cards that are in bs.centerPile
  @returns number of cards transferred
  @throws nothing
*/
function giveCenterPileTo(playerIndex) {
  var numberOfCardsTransferred = bs.centerPile.length;

  // Transfer the cards
  bs.players[playerIndex].cards = bs.players[playerIndex].cards.concat(
    bs.centerPile.splice(0, bs.centerPile.length));

  bs.players[playerIndex].cards =
    sortCards(bs.players[playerIndex].cards);

  return numberOfCardsTransferred;
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
  $("h1").html("");
  $("#game-indicators").remove();
  $("#card-display").remove();
  prepareWebpageForGaming(false);
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
  randomizePlayerOrder();
  dealOutCards();
  sortPlayersCards();
  displayIndicators();

  // Note that waitForPlayer() calls a function to bind functions
  // to certain key presses, allowing continuation of the game
  // from here
  waitForPlayer(bs.currentPlayerIndex, "pick", function() {
    displayCards("displayed-cards",
      bs.players[bs.currentPlayerIndex].cards);
    createSubmitButton(true);
    promptPickCards();
  });
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
      "<a href='#top'>Submit</a>");
    $("#submit-button a[href='#top']").click(submitTurn);
  }
  else
    $("#submit-button").empty();
}

/*
  @pre none
  @post see @param
  @hasTest no
  @param bool true to enable game-affecting responses to key presses;
  false otherwise
  @returns nothing
  @throws nothing
*/
function enableGameResponseToKeyPresses(bool) {
  bs.canSelectCards = bool;
}

/*
  @pre none
  @post see @param
  @hasTest no
  @param bool true if wish to generate "yes" and "no" buttons for
  calling BS; false if wish to delete those buttons
  @returns nothing
  @throws nothing
*/
function createBSCallButtons(bool) {
  if (bool) {
    $("#bs-call-buttons").append(
      "<a id='bs-yes' href='#top'>Yes</a> ").
      append("<a id='bs-no' href='#top'>No</a>");
    $("#bs-yes").click(function() {
      callBS(true);
    });
    $("#bs-no").click(function() {
      callBS(false);
    });
  }
  else
    $("#bs-call-buttons").empty();
}

/*
  @pre bs.currentHoveredCardIndex and bs.canSelectCards are updated
  @post if selecting cards is allowed, the card marked by divId
  will be selected (or unselected if it is already selected); if
  selecting cards isn't allowed, nothing will happen
  @hasTest no
  @param divId id of the card to affect (without the '#')
  @returns nothing
  @throws nothing
*/
function selectOrUnselectCard(divId) {
  if (!bs.canSelectCards)
    return;

  var cardToAffect = $('#' + divId);
  var cssClassPicked = "picked";

  if (cardToAffect.hasClass(cssClassPicked)) {
    // deselect if card already is picked
    cardToAffect.removeClass(cssClassPicked);
  }
  else {
    // select an unselected card
    cardToAffect.addClass(cssClassPicked);
  }
}

$(document).ready(function(){
  if (!shared.isUnitTesting()) {
    initializeCardBackgroundPositions();
    setUpGame();
  }
});