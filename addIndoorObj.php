<html>
<head>
<title>add SmartObject</title>
</head>
<body onload="init()">
	<?php 
	session_start();
	$userid = 11;//$_SESSION['userid'];
	$con = mysql_connect('localhost', 'root', '');

	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("secedb", $con);

	$select = "select * from smartobj where userid = '".$userid."';";
	$selectResult = mysql_query($select, $con);
	$max = 0;
	while($selectRow = mysql_fetch_array($selectResult)){
		$max = max($max, (int)$selectRow['smartID']);
	}

	$smartid = $max + 1;

	$soname = $_POST['soname'];
	$sopositionlatlng = $_POST['sopositionlatlng'];
	$sopositionpix = $_POST['sopositionpix'];
	$roomname = $_POST['room'];

	$posnXY = explode(",",$sopositionpix);

	echo "<br>here<br>".$sopositionpix;
	$posnX = $posnXY[0];
	$posnY = $posnXY[1];

	$latlng = explode(",",$sopositionlatlng);
	$lat = $latlng[0];
	$lng = $latlng[1];

	echo "<input type = \"hidden\" id = \"posnX\" value = '".$posnX."'>";
	echo "<input type = \"hidden\" id = \"posnY\" value = '".$posnY."'>";

	$sql = "insert into smartobj values(".$userid.",'".$smartid."','".$soname."','".$lat."','".$lng."','".$_POST['soroom']."', 0);";

	$sql2 = "insert into pixref values('".$smartid."','".$posnX."','".$posnY."');";
	echo "<br>".$sql;
	echo "<br>".$sql2;

	mysql_query($sql, $con);
	mysql_query($sql2,$con);
	echo "here";
	header('Location:indoorindex.php?source=addIndoorObj');
	?>
</body>
</html>
