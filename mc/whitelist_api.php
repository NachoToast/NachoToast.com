<?php
// this endpoint lists whitelist users and the time they were were whitelisted, for NachoBot scraping purposes

/// verification
header('Content-Type: application/json');
// bad request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode('Invalid request method, expected POST but got ' . $_SERVER['REQUEST_METHOD']);
  exit();
}
// bad content type
if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
  echo json_encode('Invalid content type, expected application/json but got ' . $_SERVER['CONTENT_TYPE']);
  exit(); 
}
// no post body
$body = json_decode(file_get_contents('php://input'), true);
if (count($body) < 1 || !isset($body['secret']) || !isset($body['minTimestamp'])) {
  echo json_encode('Missing post body, please include a \'secret\' field (string) and a \'minTimestamp\' field (int).');
  exit();
}
include_once 'secret.php';
// invalid secret
if (!in_array($body['secret'], $VALID_TOKENS, true)) {
  echo json_encode('Invalid secret.');
  exit();
}

include_once '../inc/dbh.inc.php';
$furthest = time() - $body['minTimestamp'];
$sql = $conn -> prepare("SELECT discord, minecraft FROM `mc_players` WHERE status = 'Approved Whitelist Application' AND accepted >= ?");
$sql -> bind_param('i', $furthest);

if (!($sql -> execute())) {
  echo json_encode('Request failed.');
  exit();
}

$result = mysqli_fetch_all($sql -> get_result());

echo json_encode($result);