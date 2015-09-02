<!doctype html>
<html>
<head>

<!--
  Author: Aaron Kaloti
  Release number: 1.0
-->

<title>Play: BS</title>
<script
  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js">
</script>
<link rel="stylesheet" type="text/css" href="<?php echo $_POST['style']; ?>">

</head>
<body>

<!-- So the page can scroll to the top after a button is clicked. -->
<div id="top"></div>

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

  <div id="card-display">
    <p>Your cards:</p>
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