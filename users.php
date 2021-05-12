<?php
    include_once 'head.html';
    session_start();
    if (isset($_GET["user"])) { // looking at a profile page
           include_once 'inc/profiles.inc.php';
           if (is_null($profile)) {
               //include_once 'header.php';
               include_once 'profiles/not_found.php';
           } else {
               //include_once 'header.php';
               include_once 'profiles/single.profile.php';
           }
    } else {
        //include_once 'header.php';
        include_once 'profiles/all.php';
    }
?>