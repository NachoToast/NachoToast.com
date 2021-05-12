<?php
if (isset($_SESSION["id"]) && !isset($_SESSION["ignominy_id"])) {
    include_once '../../inc/dbh.inc.php';

    // check if account already exists
    $sql = $conn -> prepare("SELECT id, account_status FROM `ignominy_players` WHERE id = ?");
    $sql -> bind_param("i", $_SESSION["id"]);
    $sql -> execute();
    $result = $sql -> get_result();

    // create new account if none exists
    if (mysqli_num_rows($result) < 1) {
        $sql = $conn -> prepare("INSERT INTO `ignominy_players` (id, account_status) VALUES (?, 'new_account')");
        $sql -> bind_param("i", $_SESSION["id"]);
        $sql -> execute();
        $_SESSION["ignominy_id"] = $_SESSION["id"];
        $_SESSION["ignominy_account_type"] = "new_account";
        echo "<a class='n a' onclick='this.style.display = `none`'>Ignominy account created!</a>";
    }

    // otherwise log in with preexisting account
    else {
        $profile = mysqli_fetch_array($result);
        $_SESSION["ignominy_id"] = $profile["id"];
        $_SESSION["ignominy_account_type"] = $profile["account_status"];
        echo "<a class='n a' onclick='this.style.display = `none`'>Ignominy login success!</a>";
    }
}