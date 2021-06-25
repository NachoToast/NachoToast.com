<?php
// this endpoint is used by the manage.php page to read from the mc players database

/// verification
header('Content-Type: application/json');
include_once 'secret.php';
session_start();
// not logged in
if (!isset($_SESSION["id"])) {
  echo 'Please log in to do this.';
  exit();
}
// not allowed user
if (!in_array($_SESSION["id"], $ALLOWED_USERS, true)) {
  echo 'You lack to authorization to do this.';
  exit();
}
// bad request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo 'Invalid request method, expected POST but got ' . $_SERVER['REQUEST_METHOD'];
  exit();
}
// bad content type
if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
  echo 'Invalid content type, expected application/json but got ' . $_SERVER['CONTENT_TYPE'];
  exit(); 
}
// no post body
$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['field']) || !isset($body['descending']) || !isset($body['status']) || !isset($body['page']) || !isset($body['perPage'])) {
  echo 'Missing fields in post body, expected \'field\' (string), \'descending\' (bool), \'page\' (int), \'perPage\' (int), and \'status\' (string), got ' . json_encode(array_keys($body));
  exit();
}

// invalid post body
try {
  $page = intval($body['page']);
  $perPage = intval($body['perPage']);
} catch (\Throwable $th) {
  echo 'page and perPage fields must be integers.';
  exit();
}
if ($page < 0 || $perPage > 50 || $perPage < 0) {
  echo 'page and perPage fields must be valid integers.';
  exit();
}

if (!is_int($page) || !is_int($perPage)) {
  echo 'Page and perPage fields must be integers.';
  exit();
}

if ($body['descending']) {
  $order = 'DESC';
}
else {
  $order = 'ASC';
}


$offset = $page * $perPage;


/// can't prepare ORDER BY or LIMIT fields, so switch is needed for sanitization

// search 'term'
switch ($body['field']) {
  case 'Minecraft':
    $term = 'minecraft';
  case 'Java':
    $term = 'java';
  case 'Applied':
    $term = 'applied';
  case 'Accepted':
    $term = 'accepted';
  case 'Accepted By':
    $term = 'accepted_by';
  case 'Status':
    $term = 'status';
  default:
    $term = 'discord';
    break;
}
// 'status' filter
switch ($body['status']) {
  case 'approvedWhitelistApplication':
    $status = 'Approved Whitelist Application';
    break;
  case 'rejectedWhitelistApplication':
    $status = 'Rejected Whitelist Application';
    break;
  default:
  $status = 'Pending Whitelist Application';
  break;
}



include_once '../inc/dbh.inc.php';
if ($body['status'] !== 'other') {
  $sql = $conn -> prepare("SELECT * FROM `mc_players` WHERE status = ? ORDER BY $term $order LIMIT $offset, $perPage");
  $sql -> bind_param('s', $status);
}
else {
  $sql = $conn -> prepare("SELECT * FROM `mc_players` ORDER BY $term $order LIMIT $offset, $perPage");
}

if (!($sql -> execute())) {
  echo 'Primary request failed.';
  exit();
}

$result = $sql -> get_result();
$result = mysqli_fetch_all($result);

// getting count of all matches (used for pagination)
if ($body['status'] !== 'other') {
  $sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE status = ?");
  $sql -> bind_param('s', $status);
}
else {
  $sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players`");
}

if (!($sql -> execute())) {
  echo 'Secondary request failed.';
  exit();
}

$countInfo = mysqli_fetch_row($sql -> get_result())[0];

array_push($result, $countInfo);

echo json_encode($result);