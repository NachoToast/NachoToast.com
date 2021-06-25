<?php
// DEPRECATED
// this endpoint enables the whitelisting of players for the Minecraft server via RCON
// this should only called via xhr through manage.php

/// verification
include_once 'secret.php';
session_start();
// logged in
if (!isset($_SESSION["id"])) {
  echo 'Please log in to do this.';
  exit();
}
// allowed user
if (!in_array($_SESSION["id"], $ALLOWED_USERS, true)) {
  echo 'You lack to authorization to do this.';
  exit();
}

include_once 'rcon.class.php';

//$r = new rcon('192.168.1.73', $RCON_PORT, $RCON_PASSWORD);

// if ($r -> Auth()) {
//   $r -> rconCommand('say pogchamp!');
//   echo $r -> rconCommand('list');
// }

echo "hi";