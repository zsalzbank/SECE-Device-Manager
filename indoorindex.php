<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link rel ="stylesheet" type = "text/css" href= "./css/bootstrap.css">
    <link rel ="stylesheet" type = "text/css" href= "./css/styles.css">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true&libraries=geometry">
    </script>
    <script type = "text/javascript" src = "./js/sObjLocation.js"></script>
  </head>
  <body onload = "init()">
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
          <h3>Add new SmartObjects by clicking on the position in which they
              exist on the floor-plan:</h3><br><br>
          <form class = "form-vertical" id="rooms" action="addIndoorObj.php" method="post">
              <input type="text" size="20" name="soname" placeholder = "SmartObject's Name"> 
              <input type="text" size="20" name="soroom" placeholder = "Room Where SmartObject Belongs"> 
              <h4>Endpoint Selected:</h4>
              <div id="pixels"></div>
              <div id="hidden"></div>
              <br>
              <input type="submit" value="Add smartObject" onclick="addRoom()"> 
              <input type="reset" onclick="clearpt()">
          </form>
        </div>
        <div class = "span4">
          <?php
          session_start();
          $uid = '11';//$_SESSION['userid'];;

          $con = mysql_connect('localhost', 'root', '');

          if (!$con)
          {
            die('Could not connect: ' . mysql_error());
          }

          mysql_select_db("secedb", $con);
        
          if ($_POST['latlng'] != null){
            $mapping = $_POST['latlng'];
            $pixdist = $_POST['pixDist'];
            $actdist = $_POST['actDist'];
            $imgpath = $_SESSION['img_path'];

            $allmaps = explode(":",$mapping);
            $indvmap1 = explode(";",$allmaps[0]);
            $indvmap2 =  explode(";",$allmaps[1]);

            $latlng = explode(",",$indvmap1[0]);
            $pixels = explode(",",$indvmap1[1]);

            $lat1 = $latlng[0];
            $lng1 = $latlng[1];
            $pixelX1 = $pixels[0];
            $pixelY1 = $pixels[1];

            $latlng = explode(",",$indvmap2[0]);
            $pixels = explode(",",$indvmap2[1]);

            $lat2 = $latlng[0];
            $lng2 = $latlng[1];
            $pixelX2 = $pixels[0];
            $pixelY2 = $pixels[1];
            $sqlstmt = "insert into indoormaps values(".$uid.",'".$imgpath."',".$pixelX1.",".$pixelY1.",".$pixelX2.",".intval($pixelY2).",'".floatval($lat1)."','".floatval($lng1)."','".floatval($lat2)."','".floatval($lng2)."',".$pixdist.",".$actdist.");";
            $result = mysql_query($sqlstmt, $con);
          }


          $sql = "select * from indoormaps where UserId = ".$uid.";";
          $result = mysql_query($sql, $con);


          if($row = mysql_fetch_array($result)){

            $_SESSION['lat1'] = $row['lat1'];
            $_SESSION['lng1'] = $row['lng1'];
            $_SESSION['pixelX1'] = $row['pixelX1'];
            $_SESSION['pixelY1'] = $row['pixelY1'];
            $_SESSION['lat2'] = $row['lat2'];
            $_SESSION['lng2'] = $row['lng2'];
            $_SESSION['pixelX2'] = $row['pixelX2'];
            $_SESSION['pixelY2'] = $row['pixelY2'];
            $_SESSION['pixDist'] = $row['pixDist'];
            $_SESSION['actDist'] = $row['actDist'];

            echo "<input type = 'hidden' id = 'lat1' value = '".($_SESSION['lat1'])."'>";
            echo "<input type = 'hidden' id = 'lng1' value = '".($_SESSION['lng1'])."'>";
            echo "<input type = 'hidden' id = 'pxX1' value = '".($_SESSION['pixelX1'])."'>";
            echo "<input type = 'hidden' id = 'pxY1' value = '".($_SESSION['pixelY1'])."'>";
            echo "<input type = 'hidden' id = 'lat2' value = '".($_SESSION['lat2'])."'>";
            echo "<input type = 'hidden' id = 'lng2' value = '".($_SESSION['lng2'])."'>";
            echo "<input type = 'hidden' id = 'pxX2' value = '".($_SESSION['pixelX2'])."'>";
            echo "<input type = 'hidden' id = 'pxY2' value = '".($_SESSION['pixelY2'])."'>";
            echo "<input type = 'hidden' id = 'pixDist' value = '".($_SESSION['pixDist'])."'>";
            echo "<input type = 'hidden' id = 'actDist' value = '".($_SESSION['actDist'])."'>";

            $showobjects = "select smartID from smartobj where UserId = '".$uid."';";
            $smartobjs = mysql_query($showobjects, $con);

            echo "<div id = \"img\"><img src = ".$row['imgpath']." width = \"500\" height = \"500\" ></div>";
            while($row = mysql_fetch_array($smartobjs)){
              $getpix = "select * from pixref where smartID = '".$row['smartID']."';";
              $pixels = mysql_query($getpix, $con);
              if($row2 = mysql_fetch_array($pixels))
                echo "<img src = './img/m-blue.png' style = 'position:absolute; top:".($row2['pixvalY']-35)."px; left:".($row2['pixvalX']-15)."px; z-index:1000'>"; 
            }
          
            echo "</div>";
            echo "<div class = 'span4'>";
            echo "<table class = 'table table-hover'>";  
            echo "<tr>";
            echo "<th>SmartID";
            echo "<th>Name";
            echo "<th>Lat - long";
            echo "<th>Location";
            echo "<th>delete";
            echo "</tr>";

            $sqltodisp = "select * from smartobj where UserId = '".$uid."';";
            $dispobjs = mysql_query($sqltodisp, $con);

            while($row = mysql_fetch_array($dispobjs)){
              echo "<tr>";
              echo "<td>".$row['smartID']."</td>";
              echo "<td>".$row['name']."</td>";
              echo "<td>".$row['lat']."</td";
              echo "<td>".$row['lng']."</td>";
              echo "<td>".$row['position']."</td>";
              echo "<td><a href = 'delindoorobj.php?smartid=".$row['smartID']."'><i class='icon-trash'></i></a></td>";
              echo "</tr>";
            }
              echo "</table>";
            echo "</div>";
          }

          else{
            echo "Please Add a Floor-plan to Map Indoor SmartObjects";
          }
          ?>
        </div>
      </div>
    </div>
  </body>
</html>