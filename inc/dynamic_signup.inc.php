<?php
if (!isset($_POST["username"]) && !isset($_POST["email"])) {
    header("location: ../signup.php?e=wrongway");
    exit();
}
include_once "dbh.inc.php";
if (isset($_POST["username"])) $checking = $_POST["username"];
else $checking = $_POST["email"];

$sql = $conn -> prepare("SELECT username FROM `breadcrumbs` WHERE username = ? OR email = ?");
$sql -> bind_param("ss", $checking, $checking);
$sql -> execute();
$result = mysqli_num_rows($sql -> get_result());
if ($result > 0) echo "false";
else echo "true";
exit();

