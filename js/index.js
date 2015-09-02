"use strict";

/*
  Author: Aaron Kaloti
  Release number: 2.0
*/

var mainMenu = {};
mainMenu.currentAudioTrack = 1;

/*
  @pre the stylesheet indicated by nameOfFile exists
  @post the stylesheet used by index.php has been switched to the
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
  @pre the audio track represented by audioNumber exists
  @post the audio track currently played by index.php has been
  paused; the audio track indicated by audioNumber has been played
  one represented by audioNumber; mainMenu.currentAudioTrack has
  been updated
  @hasTest no
  @param audioNumber the number of the audio track to play, or
  has value "none" to indicate no background music
  @returns nothing
  @throws nothing
*/
function switchAudio(audioNumber) {
  document.getElementById("background-music-" +
    mainMenu.currentAudioTrack).pause();

  if (audioNumber !== "none") {
    document.getElementById("background-music-" + audioNumber).play();
    mainMenu.currentAudioTrack = audioNumber;
  }
}

/*
  @pre main menu hasn't been set up
  @post the form requesting settings appears if the user selects "Play";
  the default background music is playing
  @hasTest no
  @returns nothing
  @throws nothing
*/
function setUpMenu() {
  $("a[href='#main-menu-options']").click(function() {
    $("form.not-displayed").removeClass('not-displayed');
  });

  document.getElementById("background-music-1").play();
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