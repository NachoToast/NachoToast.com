<?php
if (!isset($_GET["user"])) {
    header("location: ../");
    exit();
}
include_once 'dbh.inc.php';
if (isset($_SESSION["id"]) && $_GET["user"] == $_SESSION["id"]) {$stmt = "SELECT username, email, password, registered, lastonline, extension, cpfp, description, usernamechanged FROM `breadcrumbs` WHERE id = ?"; $own = true;}
else {$stmt = "SELECT username, registered, lastonline, extension, cpfp, description, usernamechanged FROM `breadcrumbs` WHERE id = ?"; $own = false;}
$sql = $conn -> prepare($stmt);
$sql -> bind_param("i", $_GET["user"]);
$sql -> execute();
$profile = mysqli_fetch_array($sql -> get_result());

if (!is_null($profile)) {
    $username = htmlspecialchars($profile["username"]);
    $username_uc = ucfirst($username);
    $desc = trim(htmlspecialchars($profile["description"]));

    $reg = date("jS F Y", $profile["registered"]);
    if (substr($reg, -4) == date("Y")) $reg = substr($reg, 0, -4);

    $seen = date("jS F Y", $profile["lastonline"]);
    if (substr($seen, -4) == date("Y")) $seen = substr($seen, 0, -4);

    if ($profile["cpfp"]) $pfp = "uploads/profiles/" . $_GET["user"] . "." . $profile["extension"];
    else $pfp = "img/pfp_default.png";

    if ($profile["usernamechanged"] == $profile["registered"]) {$usc = "No username changes found."; $usc2 = "Never";}
    else {$usc = "Last changed on the " . date("jS F Y", $profile["usernamechanged"]); $usc2 = floor((time() - $profile["usernamechanged"]) / 86400) . " Days Ago";}
    if (substr($usc, -4) == date("Y")) $usc = substr($usc, 0, -4);

    if (time() - $profile["usernamechanged"] < 2592000 || time() - $profile["registered"] < 2592000) $changeable_username = false; // 30 days before you can change your username
    else $changeable_username = true;
}