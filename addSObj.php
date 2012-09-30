<html>
<head>

</head>
<body>

<?php 
session_start();
echo "<h3>Placing object</h3>";
$userid = '11';//$_SESSION['userid'];
echo $userid."<br>";
echo $userid ."<br>";
echo $_POST['lat']."<br>";
echo $_POST['lng']."<br>";
echo $_POST['address']."<br>";

$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secedb", $con);

$select = "select * from smartobj;";
$selectResult = mysql_query($select, $con);
$max = 0;
while($selectRow = mysql_fetch_array($selectResult)){
	$max = max($max, (int)$selectRow['smartID']);
	echo $max;
}

$smartid = $max + 1;
echo $_POST['lat']."<br>";
echo $_POST['lng']."<br>";
echo $smartid;
$sql = "insert into smartobj values('".$userid."','".$smartid."','".$_POST['name']."',".$_POST['lat'].",".$_POST['lng'].",'', 0)";
echo $sql ."<br>";
$putRes = mysql_query($sql, $con);

$select =  "select * from smartobj;";
$result = mysql_query($select, $con);

if($row = mysql_fetch_array($result)){
	echo "the row: ".$row['userid']." ".$row['smartid']." ".$row['name']." ".$row['lat']." ".$row['lng']." ".$row['address']."<br>";
	header('Location: index.php');
}

else header('Location: index.php');
mysql_close($con);

?>
</form>
</body>
</html>
