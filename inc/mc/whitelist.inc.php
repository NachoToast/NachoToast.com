<?php

/// validation

// request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo 'Invalid request method, expected POST but got ' . $_SERVER['REQUEST_METHOD'] . '.';
  exit();
}

// no content type
if (isset($_SERVER['Content-Type'])) {
  echo 'No content type specified, please upload using application/x-www-form-urlencoded.';
  exit();
}

// wrong content type
if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
  echo 'Invalid content type, expected application/x-www-form-urlencoded but got ' . $_SERVER['CONTENT_TYPE'] . '.';
  exit();
}

// discordID
if (!isset($_POST['discordID']) || empty($_POST['discordID']) || !preg_match("/^[0-9]*$/", $_POST['discordID']) || strlen($_POST['discordID']) > 18 || strlen($_POST['discordID']) < 17) {
  echo 'Invalid Discord ID.';
  exit();
}

// mcUsername
if (!isset($_POST['mcUsername']) || empty($_POST['mcUsername']) || strlen($_POST['mcUsername']) > 16 || strlen($_POST['mcUsername']) < 1) {
  echo 'Invalid Minecraft username.';
  exit();
}

// text responses
if (strlen($_POST['opinionPrevBad']) > 255 || strlen($_POST['opinionPrevGood']) > 255 || strlen($_POST['other']) > 255) {
  echo 'One or more text responses are more than 255 characters long.';
  exit();
} 

// g-recaptcha-response
include_once '../../phpf/captcha.php';
$captchaResult = verify_captcha($_POST['g-recaptcha-response']);
if ($captchaResult !== true) {
  echo 'Invalid captcha: ' . $captchaResult;
  exit();
}

/// duplicate checking
include_once '../dbh.inc.php';

// discordID
{
  $sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE discord = ? LIMIT 1");
  $sql -> bind_param("s", $_POST['discordID']);
  $sql -> execute();
  if (mysqli_fetch_row($sql -> get_result())[0] > 0) {
    echo 'Discord ID taken.';
    exit();
  }
}

// mcUsername
{
  $sql = $conn -> prepare("SELECT COUNT(*) FROM `mc_players` WHERE minecraft = ? LIMIT 1");
  $sql -> bind_param("s", $_POST['mcUsername']);
  $sql -> execute();
  if (mysqli_fetch_row($sql -> get_result())[0] > 0) {
    echo 'Minecraft username taken.';
    exit();
  }
}

/// database insertion

// player DB
isset($_POST['mcVersion']) ? $version = 1 : $version = 0;
$now = time();
$sql = $conn -> prepare("INSERT INTO `mc_players` (discord, minecraft, java, applied) VALUES (?, ?, ?, ?)");
$sql -> bind_param('ssii', $_POST['discordID'], $_POST['mcUsername'], $version, $now);
if (!($sql -> execute())) {
  echo 'Error inserting into player database.';
  exit();
}
// polling DB
$sql = $conn -> prepare("INSERT INTO `mc_polls` (username, caves, incendium, extras, prev_bad, prev_good, game_night, griefing, pvp, faculty, nacho, other) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
isset($_POST['mcCaves']) ? $caves = 1 : $caves = 0;
$testInt = 1;
$sql -> bind_param('siiissiiiiis', $_POST['mcUsername'], $caves, $_POST['opinionIncendium'], $_POST['opinionExtras'], $_POST['opinionPrevBad'], $_POST['opinionPrevGood'], $_POST['gameNight'], $_POST['griefing'], $_POST['pvp'], $_POST['faculty'], $_POST['opinionNacho'], $_POST['other']);

if (!($sql -> execute())) {
  echo 'Error inserting into polling database.';
  exit();
}

header('location: ../../mc/whitelist?success');
exit();
