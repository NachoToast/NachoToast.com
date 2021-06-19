<?php

/// validation

// request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo 'Invalid request method, expected POST but got ' . $_SERVER['REQUEST_METHOD'] . '.';
  exit();
}

// no content type
if (isset($_SERVER['Content-Type'])) {
  echo 'No content type specified, please upload using application/json.';
  exit();
}

// wrong content type
if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
  echo 'Invalid content type, expected application/json but got ' . $_SERVER['CONTENT_TYPE'] . '.';
  exit();
}

// not logged in
session_start();
if (!isset($_SESSION['id'])) {
  echo 'You must be logged in to do this.';
  exit(); 
}

// invalid authorization
include_once 'verified_users.php';
if (!in_array($_SESSION['id'], $verifiedUsers, true)) {
  echo 'You do not have permission to verify monkeys.';
  exit(); 
}

/// processing request

$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['action'])) {
  echo 'No \'action\' key in request body, should either be \'Accept\' or \'Reject\'';
  exit();
}
// $body['name']
// $body['action']

include_once '../inc/dbh.inc.php';

if ($body['action'] === 'Accept') {
  $sql = $conn -> prepare('UPDATE `monkey_images` SET verified = 1, verified_by = ? WHERE name = ?');
  $sql -> bind_param('is', $_SESSION['id'], $body['name']);
  $sql -> execute();
}
else if ($body['action'] === 'Reject') {
  $sql = $conn -> prepare('DELETE FROM `monkey_images` WHERE name = ?');
  $sql -> bind_param('s', $body['name']);
  $sql -> execute();

  // remove file
  if (!unlink('database/' . $body['name'])) {
    echo 'File deletion failure.';
    exit();
  }
}

echo $body['action'] . ' Complete';