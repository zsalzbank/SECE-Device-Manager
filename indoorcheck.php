<?php
//session_start();
$userid = '11';//$_SESSION['userid'];
$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secedb", $con);
$select = "select * from indoormaps where UserId = ".$userid.";";
$selectResult = mysql_query($select, $con);
echo "here";
echo $selectResult;
if (mysql_fetch_array($selectResult) == "")	
	header("location: upload.html");
else
	header("location: indoorindex.php");
?>