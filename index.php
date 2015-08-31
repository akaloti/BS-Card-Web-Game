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
<link rel="stylesheet" type="text/css" href="css/bs1.css">

<title>Main Menu</title>

</head>
<body>

<h1>BS</h1>

<ul id="main-menu-options">
  <li><a href="#main-menu-options">Play (Shared Computer)</a></li><br>
    <form class='not-displayed' name='playSettings' action='play.php'
      onsubmit='return validatePlaySettingsForm()' method='post'>

      Number of Players: <input type='text' name='number-of-players' />
      <br>

      <input type='radio' name='style' value='css/bs1.css'
        onclick="switchStylesheet('css/bs1.css');" checked />
        Style 1<br>
      <input type='radio' name='style' value='css/bs2.css'
        onclick="switchStylesheet('css/bs2.css');" />
        Style 2<br>

      <input type='submit' value='Play' />
    </form>
  <li><a>Play (Wireless Connection) (Coming Eventually)</a></li><br>
  <li><a href="settings.html">Settings (Coming Eventually)</a></li><br>
</ul>

<script src="js/shared.js"></script>
<script src="js/index.js"></script>
</body>
</html>