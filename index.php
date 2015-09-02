<!doctype html>
<html lang="en">
<head>

<!--
  Author: Aaron Kaloti
  Release number: 1.0
-->

<script
  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js">
</script>
<link rel="stylesheet" type="text/css" href="css/bs1.css">

<title>Main Menu</title>

</head>
<body>

<h1 id="main-menu-header">BS</h1>

<div class='card' id='sample-card'></div>
<div class='card picked' id='sample-card'></div>

<ul id="main-menu-options">
  <li><a href="#main-menu-options">Play (Shared Computer)</a>
    <form class='not-displayed' name='playSettings' action='play.php'
      onsubmit='return validatePlaySettingsForm()' method='post'>

      <br>
      Number of Players: <input type='text' name='number-of-players' />
      <br>

      <input type='radio' name='style' value='css/bs1.css'
        onclick="switchStylesheet('css/bs1.css');" checked />
        Style 1<br>
      <input type='radio' name='style' value='css/bs2.css'
        onclick="switchStylesheet('css/bs2.css');" />
        Style 2<br>
      <input type='radio' name='style' value='css/bs3.css'
        onclick="switchStylesheet('css/bs3.css');" />
        Style 3<br>

      <input class='button' type='submit' value='Play' />
    </form>
  </li><br>
  <li><a>Play (Wireless Connection) (Coming Eventually)</a></li><br>
</ul>

<audio id="background-music">
  <source src="audio/barrel_blast.mp3" />

  <!-- For browsers that don't support the audio element -->
  Your browser does not support the audio element.
</audio>

<script src="js/shared.js"></script>
<script src="js/index.js"></script>
</body>
</html>