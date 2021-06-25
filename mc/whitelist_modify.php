<?php

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
if (count($body) < 1) {
  echo 'No commands specified.';
  exit();
}

// dependencies
require_once '../inc/dbh.inc.php';
require_once 'rcon.class.php';
require_once 'secret.php';
$r = new Rcon($RCON_HOST, $RCON_PORT, $RCON_PASSWORD, $RCON_TIMEOUT);

if (!($r -> connect())) {
  echo 'Unable to authenticate RCON.';
  exit();
}

$now = time();

// command organisation
$successfulOperations = 0;
$whitelistOps = [];
$rejectOps = [];

/// command handling
foreach ($body as $task) {
  if ($task['command'] === 'whitelist' && $task['action'] === 'add') {
    array_push($whitelistOps, $task);
  }
  else if ($task['command'] === 'whitelist' && $task['action'] === 'reject') {
    array_push($rejectOps, $task);
  }
}

if (count($whitelistOps) > 0) {
  $sql = $conn -> prepare("UPDATE `mc_players` SET accepted = ?, accepted_by = ?, status = 'Approved Whitelist Application' WHERE discord = ?");
  foreach($whitelistOps as $op) {
    $sql -> bind_param('iis', $now, $_SESSION['id'], $op['target']);
    if ($sql -> execute()) {
      $r -> sendCommand('whitelist ' . $op['action'] . ' ' . $op['targetName']);
      $successfulOperations++;
    }
  }
}

if (count($rejectOps) > 0) {
  $sql = $conn -> prepare("UPDATE `mc_players` SET accepted = ?, accepted_by = ?, status = 'Rejected Whitelist Application' WHERE discord = ?");
  foreach($rejectOps as $op) {
    $sql -> bind_param('iis', $now, $_SESSION['id'], $op['target']);
    if ($sql -> execute()) {
      $successfulOperations++;
    }
  }
}

echo json_encode(array(
  'successes' => $successfulOperations,
  'total' => count($body)
));