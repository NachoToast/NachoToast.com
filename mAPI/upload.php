<?php

/// validation

// request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo 'Invalid request method, expected POST but got ' . $_SERVER['REQUEST_METHOD'] . '.';
  exit();
}

// no content type
if (isset($_SERVER['Content-Type'])) {
  echo 'No content type specified, please upload using multipart/form-data.';
  exit();
}

// wrong content type
if (substr($_SERVER['CONTENT_TYPE'], 0, 19) !== 'multipart/form-data') {
  echo 'Invalid content type, expected multipart/form-data but got ' . $_SERVER['CONTENT_TYPE'] . '.';
  exit();
}

// not logged in
session_start();
if (!isset($_SESSION['id'])) {
  echo 'You must be logged in to upload monkeys.';
  exit(); 
}


/// file processing and validation
$validMonkeys = [];
$invalidMonkeys = [];

for ($i = 0, $len = count($_FILES['monkeyFiles']['name']); $i < $len; $i++) {
  // fake images
  if (getimagesize($_FILES['monkeyFiles']['tmp_name'][$i]) == false) {
    array_push($invalidMonkeys, 'Not Image: ' . $_FILES['monkeyFiles']['name'][$i]);
    continue;
  }

  // > 8 MB
  if ($_FILES['monkeyFiles']['size'][$i] > 8000000) {
    array_push($invalidMonkeys, 'Too Large: ' . $_FILES['monkeyFiles']['name'][$i]);
    continue;
  }

  // wrong type
  $type = strtolower(pathinfo($_FILES['monkeyFiles']['name'][$i], PATHINFO_EXTENSION));
  if ($type !== 'jpg' && $type !== 'png') {
    array_push($invalidMonkeys, 'Invalid Image Type: ' . $_FILES['monkeyFiles']['name'][$i]);
    continue;
  }
  
  // name validation
  $name = htmlspecialchars(str_replace(" ", "_", $_FILES['monkeyFiles']['name'][$i]));

  array_push($validMonkeys, ['name' => $name, 'type' =>  $type, 'temp' =>  $_FILES['monkeyFiles']['tmp_name'][$i], 'size' =>  $_FILES['monkeyFiles']['size'][$i]]);

}

if (count($validMonkeys) < 1) {
  echo json_encode([$validMonkeys, $invalidMonkeys]);
  exit();
}

// duplicate checking
include_once '../inc/dbh.inc.php';
$sql = $conn -> prepare('SELECT COUNT(*) FROM `monkey_images` WHERE name = ?');

foreach ($validMonkeys as $image) {
  $sql -> bind_param('s', $image['name']);
  $sql -> execute();
  $duplicate = mysqli_fetch_row($sql -> get_result())[0] > 0;
  if ($duplicate) {
    array_push($invalidMonkeys, 'Duplicate: ' . $image['name']);
    array_splice($validMonkeys, array_search($image, $validMonkeys), 1);
  }
}

if (count($validMonkeys) < 1) {
  echo json_encode([$validMonkeys, $invalidMonkeys]);
  exit();
}

// quota checking
$sql = $conn -> prepare('SELECT COUNT(*) FROM `monkey_images` WHERE uploader = ? AND verified = 0');
$sql -> bind_param('i', $_SESSION['id']);
$sql -> execute();
$pastUploads = mysqli_fetch_row($sql -> get_result())[0];

if ($pastUploads >= 50) {
  echo 'Maximum monkey quota exceeded.';
  exit();
}

if ($pastUploads + count($validMonkeys) > 50) {
  $toKeep = min(50 - $pastUploads, count($validMonkeys));
  $removed = array_splice($validMonkeys, $toKeep);
  array_push($invalidMonkeys, 'Above Quota: ' . count($removed));
}

// check user self-authorization
include_once 'verified_users.php';
if (in_array($_SESSION['id'], $verifiedUsers, true)) {
  $verified = 1;
  $verifiedBy = $_SESSION['id'];
}
else {
  $verified = 0;
  $verifiedBy = NULL;
}

// move files to permanent location and update database
$now = time();

$sql = $conn -> prepare('INSERT INTO `monkey_images` (name, added, uploader, size, verified, verified_by) VALUES (?, ?, ?, ?, ?, ?)');

foreach ($validMonkeys as $image) {
  if (move_uploaded_file($image['temp'], 'database/' . $image['name'])) {
    $size = ceil(filesize('database/' . $image['name']) / 1024);
    $sql -> bind_param('siiiii', $image['name'], $now, $_SESSION['id'], $size, $verified, $verifiedBy);
    $sql -> execute();
  }
  else {
    array_push($invalidMonkeys, 'File Move Error: ' . $image['name']);
    array_splice($validMonkeys, array_search($image, $validMonkeys), 1);
  }
}

echo json_encode([$validMonkeys, $invalidMonkeys]);