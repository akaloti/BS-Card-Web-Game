"use strict";

// Precondition: main menu hasn't been set up
// Postcondition: a form requesting settings appears if the user selects "Play"
function setUpMenu() {
  $("a[href='#main-menu-options']").click(function() {
    $(this).after("<form action='play.php' method='post'>" +
      "Number of players: <input type='text' name='number-of-players' /><br>" +
      "<input type='submit' value='Play' /></form>");

    // don't let the user keep generating the text field
    $("a[href='#main-menu-options']").off('click');
  });
}

$(document).ready(function(){
  if (!shared.isUnitTesting())
    setUpMenu();
});