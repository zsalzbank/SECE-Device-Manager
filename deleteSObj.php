<html>
<head>
</head>
<body>

<?php 
session_start();
echo $_GET['id'];

$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secedb", $con);
$sql_dependent = "delete from pixref where smartID = '" .$_GET['id']."';";
$sql = "delete from smartobj where smartID = '" .$_GET['id']."';";
$init_query = mysql_query($sql_dependent, $con);
$putRes = mysql_query($sql, $con);
//$sql
header('Location: index.php');
?>

</body>
</html>
