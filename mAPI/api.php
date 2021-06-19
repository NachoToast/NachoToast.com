<?php

$start = microtime(true);


// check if need to get verified or unverified
if (isset($_GET['unverified'])) {
  session_start();
  include_once 'verified_users.php';
  if (in_array($_SESSION['id'], $verifiedUsers)) {
    $verifyStatus = 0;
  }
  else {
    $verifyStatus = 1;
  }
}
else {
  $verifyStatus = 1;
}

// get random image
include_once '../inc/dbh.inc.php';
$sql = $conn -> prepare("SELECT COUNT(*) FROM `monkey_images` WHERE verified = $verifyStatus");
$sql -> execute();
$pool = mysqli_fetch_row($sql -> get_result())[0];

// catch no images
if ($pool < 1) {
  echo 'No Monkeys Found!';
  exit();
}

$random = rand(0, $pool - 1);
$sql = $conn -> prepare("SELECT * FROM `monkey_images` WHERE verified = $verifyStatus LIMIT $random, 1");
$sql -> execute();
$fullResponse = mysqli_fetch_assoc($sql -> get_result());

// construct reponse object
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
$response['image'] = $protocol . '://' . $_SERVER['HTTP_HOST'] . '/mAPI/database/' . $fullResponse['name'];
$response['uploaded'] = $fullResponse['added'];
$response['size'] = $fullResponse['size'];
$response['uploaderID'] = htmlspecialchars($fullResponse['uploader']);
$response['verifierID'] = htmlspecialchars($fullResponse['verified_by']);
$response['monkeyCount'] = $pool;

// get uploader
$sql = $conn -> prepare('SELECT username FROM `breadcrumbs` WHERE id = ?');
$sql -> bind_param('i', $fullResponse['uploader']);
$sql -> execute();
$response['uploader'] = mysqli_fetch_row($sql -> get_result())[0];

// get verifier
if ($verifyStatus === 1) {
  $sql = $conn -> prepare('SELECT username FROM `breadcrumbs` WHERE id = ?');
  $sql -> bind_param('i', $fullResponse['verified_by']);
  $sql -> execute();
  $response['verifier'] = mysqli_fetch_row($sql -> get_result())[0];
}
else {
  $response['verifier'] = 'None';
}

// done
$response['took'] = microtime(true) - $start;
echo json_encode($response);