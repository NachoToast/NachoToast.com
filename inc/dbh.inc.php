<?php
$db_server = 'localhost';
$db_user = 'root';
$db_password = '';
$db_database = 'toaster';

$conn = mysqli_connect($db_server, $db_user, $db_password, $db_database);

if (!$conn) die('Connection failed: ' . mysqli_connect_error());