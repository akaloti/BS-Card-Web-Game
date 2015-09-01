<!doctype html>

<!--
  Author: Aaron Kaloti
  Release number: 0.1
-->

<html>
<head>
<script
  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js">
</script>
<link rel="stylesheet" type="text/css" href="<?php echo $_POST['style']; ?>">

<title>Play: BS</title>

</head>
<body>

<!-- So the page can scroll to the top after a button is clicked. -->
<h1 id="top">Use arrow keys and spacebar to pick cards.</h1>

<div id="for-everyone">
  <div id="between-turns-announcements">
  </div>

  <div id="everyone-announcement">
  </div>

  <div id="submission-display">
  </div>
</div>

<section id="game">
  <div id="game-indicators">
    <p>Current player: <span id="current-player"></span></p>
    <p>Current rank: <span id="current-rank"></span></p>
  </div>

  <!-- Elements that deal solely with prompting a player about
    whether or not he wants to call BS -->
  <div id="prompting-for-call-bs">
    <p id="call-bs-prompt"></p>
    <div id="bs-call-buttons">
    </div>
  </div>

  <p id="announcement"></p>

  <div id="submit-button">
  </div>
  <br>

  <div id="card-display">Your cards:
    <div id="displayed-cards">
    </div>
  </div>
</section>

<script>
  // To get around not being able to use PHP in a JavaScript file
  var formData = {};
  formData.numberOfPlayers = "<?php echo $_POST['number-of-players']; ?>";
</script>
<script src="js/shared.js"></script>
<script src="js/play.js"></script>
</body>
</html>