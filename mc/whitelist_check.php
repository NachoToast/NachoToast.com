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

if (!isset($_POST['discordID']) || !isset($_POST['mcUsername']) || !isset($_POST['email'])) {
    echo 'Missing POST fields, need: discordID, mcUsername, and email.';
    exit();
}

header('Content-Type: application/json');
include_once '../inc/dbh.inc.php';

$response = [];

// checking discord id
$sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE discord = ? LIMIT 1");
$sql -> bind_param("s", $_POST['discordID']);
$sql -> execute();
$response['discordID'] = mysqli_fetch_row($sql -> get_result())[0] == 0;

// checking username
$sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE minecraft = ? LIMIT 1");
$sql -> bind_param("s", $_POST['mcUsername']);
$sql -> execute();
$response['mcUsername'] = mysqli_fetch_row($sql -> get_result())[0] == 0;

// checking email
$sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE email = ? LIMIT 1");
$sql -> bind_param("s", $_POST['email']);
$sql -> execute();
$response['email'] = mysqli_fetch_row($sql -> get_result())[0] == 0;

echo json_encode($response);
