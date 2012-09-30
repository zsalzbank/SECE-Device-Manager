<html>
<head>
<title>Delete SmartObject</title>
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
	echo $_GET['smartid'];
	$deletepixref = "delete from pixref where smartID = '".$_GET['smartid']."';";
	mysql_query($deletepixref, $con);
	$delete = "delete from smartobj where smartID = '".$_GET['smartid']."';";
	mysql_query($delete, $con);
	
	header('Location:indoorindex.php?source=delindoorobj');
	?>
</body>
</html>
