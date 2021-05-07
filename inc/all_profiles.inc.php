<?php
if (!isset($_POST["mode"])) {
    header("location: ../profiles.php?e=wrongway");
    exit();
}
if ($_POST["mode"] == "search") {
    session_start();
    if (!isset($_SESSION["id"])) {
        header ("location: ../profiles.php?e=login");
        exit();
    }
    $stmt = "SELECT id, username, lastonline, extension, cpfp, description FROM `breadcrumbs` WHERE username LIKE ? LIMIT ? OFFSET ?";
    $loggedin = true;

} else {$stmt = "SELECT id, username, lastonline, extension, cpfp, description FROM `breadcrumbs` LIMIT ? OFFSET ?"; $loggedin = false;}

// limit
if (!isset($_POST["users_per_page"])) {header("location: ../profiles.php?e=usersperpage"); exit();}
if ($_POST["users_per_page"] == 10) $limit = 10;
else if ($_POST["users_per_page"] == 20) $limit = 20;
else if ($_POST["users_per_page"] == 50) $limit = 50;
else $limit = 100;

// offset
if (!isset($_POST["page"])) {header("location: ../profiles.php?e=page"); exit();}
$offset = $_POST["page"] * $limit;

include_once 'dbh.inc.php';
$sql = $conn -> prepare($stmt);
if ($loggedin) {
    $search_string = "%" . $_POST["input"] . "%";
    $sql -> bind_param("sii", $search_string, $limit, $offset);
}
else $sql -> bind_param("ii", $limit, $offset);

$now = time();
$sql -> execute();
$result = $sql -> get_result();
while ($profile = mysqli_fetch_array($result)) {
    if ($profile["cpfp"] == 0) $src = "img/pfp_default.png";
    else $src = "uploads/profiles/" . $profile["id"] . "." . $profile["extension"];
    $ts = floor(($now - $profile["lastonline"]) / 86400);
    if ($ts < 1) $ts = "Today";
    else if ($ts < 2) $ts = "1 day ago";
    else $ts = $ts . " days ago";
    echo "<a class='profile_card' href='profiles.php?user=" . $profile["id"] . "'>
            <img src=" . $src .">
            <div>
                <p>" . $profile["username"] . " <span style='font-weight: lighter; color: gray;'>($ts)</span></p>
                <p>" . $profile["description"] . "</p>
            </div>
        </a>";
}