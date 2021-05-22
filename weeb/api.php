<?php
    if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER["CONTENT_TYPE"] !== "application/json") {
        header($_SERVER['SERVER_PROTOCOL'] . " 400 Bad Request");
        exit();
    }
    include_once 'secret.php';
    $args = json_decode(file_get_contents('php://input'), true);
    if (!isset($args['toaster']) || $args['toaster'] !== $secret) {
        header($_SERVER['SERVER_PROTOCOL'] . " 401 Unauthorized");
        exit();
    }
    header($_SERVER['SERVER_PROTOCOL'] . " 200 POG");
    include_once '../inc/dbh.inc.php';
    if (!isset($args['tags'])) {
        $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_images`');
        $sql -> execute();
        $pool = mysqli_fetch_assoc($sql -> get_result())['COUNT(*)'];
        $random = rand(0, $pool - 1);
        // $random = 2253; // url errors // PASS
        $sql = $conn -> prepare("SELECT * FROM `weeb_images` LIMIT $random,1");
        //$sql = $conn -> prepare("SELECT * FROM `weeb_images` WHERE name = 'Arknights/EPRHrMPU8AA4S83.jpg'"); // jfif // PASS
        //$sql = $conn -> prepare("SELECT * FROM `weeb_images` WHERE name = 'Green_Haired_Bitch/105.png'"); // PASS
        // $sql = $conn -> prepare("SELECT * FROM `weeb_images` WHERE name = 'Backgrounds/Assassins_Creed_Origins/poster4.jpg'"); // 24MB

        $sql -> execute();
        $image = mysqli_fetch_assoc($sql -> get_result());
        $image['name'] = "https://nachotoast.com/weeb/database/" . $image['name'];
        $image['index'] = $random;
        echo json_encode($image);
        exit();
    }
    echo json_encode(array("Peter"=>35, "Ben"=>37, "Joe"=>43));
    exit();