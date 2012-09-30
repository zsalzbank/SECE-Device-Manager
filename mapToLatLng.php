<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link rel ="stylesheet" type = "text/css" href= "./css/bootstrap.css">
    <link rel ="stylesheet" type = "text/css" href= "./css/styles.css">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true">
    </script>
    <script type = "text/javascript" src = "./js/indoorSObjs.js"></script>
  </head>
  <body onload = "initialize()">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="container">
          <a class= "brand" href= "index.php"> SECE </a>
          <ul class="nav">
            <li class="active">
              <a href="index.php">Home</a>
            </li>
            <li><a href="newSObj.php">Add SmartObject</a></li>
            <li><a href="indoorcheck.php">Indoor Maps</a></li>
          </ul>
          <ul class = "nav pull-right"><a href = "logout.php"><li> Logout </a></li></ul>
        </div>
      </div>
    </div>
    <div class = "container">
      <div class = "row-fluid">
        <div class = "span3" id = "sidebar">
          &nbsp 
          <p>
            <h3>Select 2 Sets of Points:</h3>
            <p>
              (Select a point on the map following the corresponding point on the floor plan. Select two point in this way)
            </p>
            <p>
              <h4>Points Selected:</h4>
              <br><br>
              <div id="disp-points1"></div>
              <div id = "disp-points2"></div>
            </p>
          </p>
          <form id="serchAddr" method="post" action="indoorindex.php">
            <input type="hidden" id="latlng" value="" name="latlng"> 
            <input type="hidden" id="pixDist" name = "pixDist"> 
            <input type="hidden" id="actDist" name = "actDist">
            <input type="submit" value="Submit Points" > <input type="reset" onclick="clearpt()">
        </div>
        <div class = "span4">
          <?php

          session_start();
          $userid = $_SESSION['userid'];
          
          if($_GET['img_path'] == null){
            echo "please upload a floor plan <a href = \"upload1.html\">here</a> to continue<br>";
          }
          else{
            echo "<div class = 'image' id = 'img'><img src = '".$_GET['img_path']."' height = '500px' width = '500px'></div><br>";
            $_SESSION['img_path'] = $_GET['img_path'];
          }

          ?>
        </div>
        <div class = "span4">
          <div id="map_canvas" class = "map"></div> 
        </div>
      </div>
    </div>
  </body>
</html>