"use strict";

/*
  Author: Aaron Kaloti
  Release number: 0.1
*/

/*
  @pre the stylesheet indicated by nameOfFile exists
  @post the stylesheet used by index.html has been switched to the
  one indicated by nameOfFile
  @hasTest no (only a jQuery function is used)
  @param nameOfFile the stylesheet to apply to the webpage
  @returns nothing
  @throws nothing
*/
function switchStylesheet(nameOfFile) {
  $("link[rel='stylesheet']").attr('href', nameOfFile);
}

/*
  @pre main menu hasn't been set up
  @post the form requesting settings appears if the user selects "Play"
  @hasTest no
  @returns nothing
  @throws nothing
*/
function setUpMenu() {
  $("a[href='#main-menu-options']").click(function() {
    $("form.not-displayed").removeClass('not-displayed');
  });
}

/*
  @pre none
  @post alert to browser if invalid form
  @hasTest no
  @returns true if number of players entered in form is valid;
  false otherwise
  @throws nothing
*/
function validatePlaySettingsForm() {
  var numberOfPlayers =
    document.forms["playSettings"]["number-of-players"].value;

  // Check that something was entered
  if (numberOfPlayers == null || numberOfPlayers == "") {
    alert("Number of Players must be filled out");
    return false;
  }
  // Check that a numerical value was entered
  else if (isNaN(numberOfPlayers)) {
    alert("Number of Players needs a numerical value");
    return false;
  }
  // Check that the number is within the appropriate range
  else if (numberOfPlayers < shared.bs.MIN_NUMBER_OF_PLAYERS) {
    alert("Not enough players");
    return false;
  }
  else if(numberOfPlayers > shared.bs.MAX_NUMBER_OF_PLAYERS) {
    alert("Too many players");
    return false;
  }

  return true;
}

$(document).ready(function(){
  if (!shared.isUnitTesting())
    setUpMenu();
});