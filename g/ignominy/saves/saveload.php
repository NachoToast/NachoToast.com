<?php
    session_start();
    if (!isset($_SESSION["ignominy_id"]) || !isset($_SESSION["id"])) exit();
    if (isset($_POST["player"])) {
        $filename = $_SESSION["id"] . ".ignosave";
        $contents = $_POST["player"];
        $save_file = fopen($filename, "w") or die("Unable to open file!");
        fwrite($save_file, $contents, 1000000);
        fclose($save_file);
        $filesize = filesize($filename);
        include_once '../../../inc/dbh.inc.php';
        $sql = $conn -> prepare("UPDATE `ignominy_players` SET save_size = ? WHERE id = ?");
        $sql -> bind_param("ii", $filesize, $_SESSION["ignominy_id"]);
        $sql -> execute();
        if ($filesize >= 1000000) echo "Filesize > 1 MB!";
        else echo "success";
        exit();
    }
    $filename = $_SESSION["id"] . ".ignosave";
    if (!file_exists($filename)) {echo "Save not found!"; exit();}
    echo file_get_contents($filename);