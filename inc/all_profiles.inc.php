<?php
if (!isset($_POST["mode"])) {
    header("location: ../users.php?e=wrongway");
    exit();
}

// limit
if (!isset($_POST["users_per_page"])) {header("location: ../users.php?e=usersperpage"); exit();}
if ($_POST["users_per_page"] == 10) $limit = 10;
else if ($_POST["users_per_page"] == 20) $limit = 20;
else if ($_POST["users_per_page"] == 50) $limit = 50;
else $limit = 50;

// offset
if (!isset($_POST["page"])) {header("location: ../users.php?e=page"); exit();}
$offset = $_POST["page"] * $limit;

// init connection
include_once 'dbh.inc.php';

// search mode
if ($_POST["mode"] == "search") {
    session_start();
    if (!isset($_SESSION["id"])) {
        header ("location: ../users.php?e=login");
        exit();
    }
    // limited relevant results
    $stmt = "SELECT id, username, lastonline, extension, cpfp, description FROM `breadcrumbs` WHERE username LIKE ? LIMIT ? OFFSET ?";
    $search_string = "%" . $_POST["input"] . "%";
    $sql = $conn -> prepare($stmt);
    $sql -> bind_param("sii", $search_string, $limit, $offset);
    // all relevant results
    $stmt2 = "SELECT id FROM `breadcrumbs` WHERE username LIKE ?";
    $sql2 = $conn -> prepare($stmt2);
    $sql2 -> bind_param("s", $search_string);
    $sql2 -> execute();
    $totalresults = mysqli_num_rows($sql2 -> get_result());

} else {
    // limited relevant results
    $stmt = "SELECT id, username, lastonline, extension, cpfp, description FROM `breadcrumbs` LIMIT ? OFFSET ?";
    $sql = $conn -> prepare($stmt);
    $sql -> bind_param("ii", $limit, $offset);
    // all relevant results
    $stmt2 = "SELECT id FROM `breadcrumbs`";
    $sql2 = $conn -> prepare($stmt2);
    $sql2 -> execute();
    $totalresults = mysqli_num_rows($sql2 -> get_result());
}

// collating results
$now = time();
$output = "";
$sql -> execute();
$result = $sql -> get_result();
$displaying = mysqli_num_rows($result);
while ($profile = mysqli_fetch_array($result)) {
    if ($profile["cpfp"] == 0) $src = "img/pfp_default.png";
    else $src = htmlspecialchars("uploads/profiles/" . $profile["id"] . "." . $profile["extension"]);
    $ts = floor(($now - $profile["lastonline"]) / 86400);
    if ($ts < 1) $ts = "Today";
    else if ($ts < 2) $ts = "1 day ago";
    else $ts = $ts . " days ago";
    $output .= "<a class='profile_card' href='users.php?user=" . $profile["id"] . "'>
            <img src=" . $src .">
            <div>
                <p>" . htmlspecialchars($profile["username"]) . " <span style='font-weight: lighter; color: gray;'>($ts)</span></p>
                <p>" . htmlspecialchars($profile["description"]) . "</p>
            </div>
        </a>";
}
echo json_encode(array($output, $displaying, $totalresults));