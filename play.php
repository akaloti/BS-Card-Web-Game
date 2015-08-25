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

<p>Current player: <span id="current-player"></span></p>
<p>Current rank: <span id="current-rank"></span></p>

<p id="announcement"></p>

<div>Your cards:
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