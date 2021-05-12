<?php
if (isset($_POST["g-recaptcha-response"])) {

    // redirect
    if (isset($_GET["o"])) $redirect = "&o=" . $_GET["o"];
    else $redirect = "";

    // captcha
    include_once "../phpf/captcha.php";
    $result = verify_captcha($_POST["g-recaptcha-response"]);
    if ($result !== true) {
        header("location: ../signup.php?e=captcha$result$redirect");
        exit();
    }

    // declared
    if (isset($_POST["username"]) && isset($_POST["password"]) && isset($_POST["password_confirm"]) && isset($_POST["email"])) {
        $username = trim($_POST["username"]);
        $password = $_POST["password"];
        $password2 = $_POST["password_confirm"];
        $email = $_POST["email"];
    } else {
        header("location: ../signup.php?e=empty$redirect");
        exit();
    }

    // empty
    if (empty($username) || empty($password) || empty($email)) {
        header("location: ../signup.php?e=empty$redirect");
        exit();
    }

    // invalid username
    if (!preg_match("/^[a-zA-Z0-9]*$/", $username) || strlen($username) > 20 || strlen($username) < 3) {
        header("location: ../signup.php?e=invalid$redirect");
        exit();
    }

    // invalid email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 128) {
        header("location: ../signup.php?e=email$redirect");
        exit();
    }

    // invalid password
    if (strlen($password) > 255 || strlen($password) < 5) {
        header("location: ../signup.php?e=invalid$redirect");
        exit();
    }
    if ($password !== $password2) {
        header("location: ../signup.php?e=invalid$redirect");
        exit();
    }

    // duplicate check
    include_once "dbh.inc.php";
    $this_ip = $_SERVER["REMOTE_ADDR"];
    $sql = $conn -> prepare("SELECT username, ip, email FROM `breadcrumbs` WHERE username = ? OR ip = ? OR email = ?");
    $sql -> bind_param("sss", $username, $this_ip, $email);
    $sql -> execute();
    $result = $sql -> get_result();
    while ($duplicate = mysqli_fetch_array($result)) {
        if ($duplicate["username"] == $username || $duplicate["email"] == $email) {header("location: ../signup.php?e=taken$redirect"); exit();}
        if ($duplicate["ip"] == $this_ip && $this_ip != "::1" && $this_ip != "192.168.1.254") {header("location: ../signup.php?e=ip$redirect"); exit();};
    }

    // database write
    $now = time();
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $sql = $conn -> prepare("INSERT INTO `breadcrumbs` (username, email, password, registered, lastonline, usernamechanged, ip) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $sql -> bind_param("sssiiis", $username, $email, $hashed, $now, $now, $now, $this_ip);
    $sql -> execute();

    // database read
    $sql = $conn -> prepare("SELECT id, username FROM `breadcrumbs` WHERE username = ?");
    $sql -> bind_param("s", $username);
    $sql -> execute();
    $result = mysqli_fetch_array($sql -> get_result());
    
    // session
    session_start();
    $_SESSION["id"] = $result["id"];
    $_SESSION["username"] = $result["username"];
    if (strlen($redirect) > 0) {
        if ($redirect == "&o=ignominy") header("location: ../g/ignominy/index.php?s=signup");
        exit();
    }
    header("location: ../index.php?s=signup");
    exit();
}
header("location: ../signup.php?e=wrongway");
exit();