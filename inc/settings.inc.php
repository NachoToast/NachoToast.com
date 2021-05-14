<?php
if (!isset($_GET["user"])) {
    header("location: ../users.php");
    exit();
}
$redirect = $_GET["user"];
// right user check
session_start();
if ($_SESSION["id"] != $_GET["user"]) {header("location: ../users.php?user=$redirect&e=na"); exit();}

if (isset($_POST["uc_submit"]) && isset($_POST["new_username"])) { // change username

    $username = trim($_POST["new_username"]);

    // empty
    if (empty($username)) {header("location: ../users.php?user=$redirect&e=username_empty"); exit();}

    // invalid
    if (!preg_match("/^[a-zA-Z0-9]*$/", $username) || strlen($username) > 20 || strlen($username) < 3) {header("location: ../users.php?user=$redirect&e=username_invalid"); exit();}

    // duplicate check
    include_once 'dbh.inc.php';
    $sql = $conn -> prepare("SELECT username FROM `breadcrumbs` WHERE username = ?");
    $sql -> bind_param("s", $username);
    $sql -> execute();
    $result = mysqli_num_rows($sql -> get_result());
    if ($result > 0) {header("location: ../users.php?user=$redirect&e=username_taken"); exit();}

    // too soon check
    $sql = $conn -> prepare("SELECT usernamechanged, registered FROM `breadcrumbs` WHERE id = ?");
    $sql -> bind_param("i", $_SESSION["id"]);
    $sql -> execute();
    $result = mysqli_fetch_array($sql -> get_result());
    if (time() - $result["usernamechanged"] < 259200 || time() - $result["registered"] < 259200) {header("location: ../users.php?user=$redirect&e=username_toosoon"); exit();
    }

    // database write
    $now = time();
    $sql = $conn -> prepare("UPDATE `breadcrumbs` SET username = ?, usernamechanged = ? WHERE id = ?");
    $sql -> bind_param("sii", $username, $now, $_SESSION["id"]);
    $sql -> execute();
    header("location: ../users.php?user=$redirect&s=username");
    exit();
} else if (isset($_POST["pc_submit"]) && isset($_POST["old_password"]) && isset($_POST["new_password"]) && isset($_POST["new_password_confirm"])) { // change password
    $old = $_POST["old_password"];
    $new = $_POST["new_password"];
    $new2 = $_POST["new_password_confirm"];
    
    if (strlen($new) > 255 || strlen($new) > 255 || $new !== $new2 || empty($new)) {header("location: ../users.php?user=$redirect&e=password_invalid"); exit();}

    // database read
    include_once 'dbh.inc.php';
    $sql = $conn -> prepare("SELECT password FROM `breadcrumbs` WHERE id = ?");
    $sql -> bind_param("i", $_SESSION["id"]);
    $sql -> execute();
    $online_hashed = mysqli_fetch_array($sql -> get_result())["password"];
    if (!password_verify($old, $online_hashed)) {header("location: ../users.php?user=$redirect&e=password_incorrect"); exit();}

    // database write
    $sql = $conn -> prepare("UPDATE `breadcrumbs` SET password = ? WHERE id = ?");
    $sql -> bind_param("si", password_hash($new, PASSWORD_DEFAULT), $_SESSION["id"]);
    $sql -> execute();
    header("location: ../users.php?user=$redirect&s=password");
    exit();
} else if (isset($_POST["pfp_submit"])) { // change pfp
    $base_directory = "../uploads/profiles/";
    $file_name = $base_directory . basename($_FILES["new_pfp"]["name"]);
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $new_file_name = $base_directory . $_SESSION["id"] . "." . $file_extension;

    // actual image
    if (getimagesize($_FILES["new_pfp"]["tmp_name"]) == false) {
        header("location: ../users.php?user=$redirect&e=pfp_bad");
        exit();
    }

    // size (2mb)
    if ($_FILES["new_pfp"]["size"] > 2000000) {
        header("location: ../users.php?user=$redirect&e=pfp_toobig");
    }

    // extension
    if ($file_extension !== "jpg" && $file_extension !== "png" && $file_extension !== "jpeg") {
        header("location: ../users.php?user=$redirect&e=pfp_invalid");
        exit();
    }

    // move temp -> actual
    if (move_uploaded_file($_FILES["new_pfp"]["tmp_name"], $new_file_name)) {
        // database read
        include_once "dbh.inc.php";
        $sql = $conn -> prepare("SELECT extension, cpfp FROM `breadcrumbs` WHERE id = ?");
        $sql -> bind_param("i", $_SESSION["id"]);
        $sql -> execute();
        $result = mysqli_fetch_array($sql -> get_result());
        $db_cpfp = $result["cpfp"];
        $db_ext = $result["extension"];
        if ($db_cpfp == 1 && $db_ext !== $file_extension) { // delete previous if extension different
            if (!unlink($base_directory . $_SESSION["id"] . "." . $db_ext)) {
                header("location: ../users.php?user=$redirect&e=pfp_deleteold");
                exit();
            }
        }

        // database write
        if ($db_cpfp == 0 || $db_ext !== $file_extension) {
            $sql = $conn -> prepare("UPDATE `breadcrumbs` SET extension = ?, cpfp = b'1' WHERE id = ?");
            $sql -> bind_param("si", $file_extension, $_SESSION["id"]);
            $sql -> execute();
        }
        header("location: ../users.php?user=$redirect&s=pfp");
        exit();
    } else { // move failure
        header("location: ../users.php?user=$redirect&e=pfp_move");
        exit();
    }
} 
// change description
else if (isset($_POST["desc_submit"]) && isset($_POST["new_desc"])) {

    $desc = trim($_POST["new_desc"]);

    // empty
    if (empty($desc)) {header("location: ../users.php?user=$redirect&e=desc_empty"); exit();}

    // length
    if (strlen($desc) > 255) {header("location: ../users.php?user=$redirect&e=desc_invalid"); exit();}

    // database write
    include_once 'dbh.inc.php';
    $sql = $conn -> prepare("UPDATE `breadcrumbs` SET description = ? WHERE id = ?");
    $sql -> bind_param("si", $desc, $_SESSION["id"]);
    $sql -> execute();
    header("location: ../users.php?user=$redirect&s=desc");
    exit();
}
else {
    header("location: ../users.php?user=$redirect");
    exit();
}