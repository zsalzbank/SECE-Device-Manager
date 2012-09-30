<?php
session_start();
setcookie("sid", '', 1, '/');
header('Location:http://sece.cs.columbia.edu');
?>
