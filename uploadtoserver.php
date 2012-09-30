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
    <script type = "text/javascript" src = "./js/putMarkers.js"></script>
  </head>
  <body>
    <div class="navbar">
      <div class="navbar-inner">
        <div class="container">
          <a class= "brand" href= "#"> SECE </a>
          <ul class="nav">
            <li class="active">
              <a href="#">Home</a>
            </li>
            <li><a href="newSObj.php">Add SmartObject</a></li>
            <li><a href="indoorcheck.php">Indoor Maps</a></li>
          </ul>
          <ul class = "nav pull-right"><a href = "logout.php"><li> Logout </a></li></ul>
        </div>
      </div>
    </div>
    <div class = "container">
      <div class = "span4" id = "sidebar">
      </div>
      <div class = "span8" id = "upload">
        <?php
        session_start();
        $uid = $_SESSION['userid'];;
        $target_path = ".\uploads\\";
        $target_path = $target_path.basename( $_FILES['fileselect']['name']);
        $img_path = "./uploads/".basename( $_FILES['fileselect']['name']);
        
        if(move_uploaded_file($_FILES['fileselect']['tmp_name'], $target_path)) {
          echo "<div id = \"img\"><br><img src = ".$img_path." width = \"500\" height = \"500\" ></div>";
          header('Location: mapToLatLng.php?img_path='.$img_path);
        }

        else{
          echo "There was an error uploading the file, please try again!";
          echo $_FILES['fileselect']['error']."<br>";
        }
        
        ?>
      </div>   
    </div>
  </div>
  </body>
</html>