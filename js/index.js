"use strict";

// Precondition: main menu hasn't been set up
// Postcondition: a form requesting settings appears if the user selects "Play"
function setUpMenu() {
  $("a[href='#main-menu-options']").click(function() {
    $(this).after("<form name='playSettings' action='play.php'" +
      " onsubmit='return validatePlaySettingsForm()' method='post'>" +
      "Number of Players: <input type='text' name='number-of-players' /><br>" +
      "<input type='submit' value='Play' /></form>");

    // don't let the user keep generating the text field
    $("a[href='#main-menu-options']").off('click');
  });
}

// Returns true if number of players entered in form is valid;
// returns false (and does alert message) otherwise
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

  return true;
}

$(document).ready(function(){
  if (!shared.isUnitTesting())
    setUpMenu();
});