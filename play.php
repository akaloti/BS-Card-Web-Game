<!doctype html>
<html>
<head>
<script
  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js">
</script>
<link rel="stylesheet" type="text/css" href="css/bs.css">

<title>Play: BS</title>

</head>
<body>

<div id="game-indicators">
  <p>Current player: <span id="current-player"></span></p>
  <p>Current rank: <span id="current-rank"></span></p>
</div>

<p id="announcement"></p>

<div id="card-display">Your cards:
  <ul id="displayed-cards">
  </ul>
</div>

<a id="submit" href="#submit">Submit</a>

<script>
  // To get around not being able to use PHP in a JavaScript file
  var formData = {};
  formData.numberOfPlayers = "<?php echo $_POST['number-of-players']; ?>";
</script>
<script src="js/shared.js"></script>
<script src="js/play.js"></script>
</body>
</html>