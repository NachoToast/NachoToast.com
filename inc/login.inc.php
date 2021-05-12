<?php
if (isset($_POST["submit_login"])) {

    // redirect
    if (isset($_GET["o"])) $redirect = "&o=" . $_GET["o"];
    else $redirect = "";

    if (isset($_POST["username"]) && isset($_POST["password"])) {
        $username = $_POST["username"];
        $password = $_POST["password"];
    } else {
        header("location: ../login.php?e=empty$redirect");
        exit();
    }

    if (empty($username) || empty($password)) {
        header("location: ../login.php?e=empty$redirect");
        exit();
    }

    // database read
    include_once "dbh.inc.php";
    $sql = $conn -> prepare("SELECT id, username, password, ip FROM `breadcrumbs` WHERE username = ? OR email = ?");
    $sql -> bind_param("ss", $username, $username);
    $sql -> execute();
    $result = mysqli_fetch_assoc($sql -> get_result());

    if ($result === NULL) {
        header("location: ../login.php?e=invalid$redirect");
        exit();
    }

    if (!password_verify($password, $result["password"])) {
        header("location: ../login.php?e=invalid$redirect");
        exit();
    }


    // session
    session_start();
    $_SESSION["id"] = $result["id"];
    $_SESSION["username"] = htmlspecialchars($result["username"]);

    // database write
    $now = time();
    $this_ip = $_SERVER["REMOTE_ADDR"];
    $sql = $conn -> prepare("UPDATE `breadcrumbs` SET ip = ?, lastonline = ? WHERE id = ?");
    $sql -> bind_param("sii", $this_ip, $now, $_SESSION["id"]);
    $sql -> execute();

    // exit
    if (strlen($redirect) > 0) {
        if ($redirect == "&o=ignominy") header("location: ../g/ignominy/index.php?s=login");
        exit();
    }
    header("location: ../index.php?s=login");
    exit();
}
header("location: ../login.php?e=wrongway");
exit();