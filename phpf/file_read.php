<?php
function get_file_summary($filename) {
    $file = fopen($filename, "r");
    $contents = strip_tags(fread($file, 350));
    fclose($file);
    $contents = trim(str_replace(["\n", "\r", "\t"], "", $contents));
    $contents = str_replace(["    ","   ", "  "], " ", $contents);
    $contents = str_replace(["    ","   ", "  "], " ", $contents);
    return substr($contents, 0, 252) . "...";
}

function get_file_title($filename) {
    $title = str_replace("_", " ", $filename);
    return ucwords($title);
}

function get_file_synopsis($filename) {
    $file = fopen($filename, "r");
    $contents = strip_tags(fread($file, filesize($filename)));
    fclose($file);
    $contents = trim(str_replace(["\n", "\r", "\t"], "", $contents));
    $contents = str_replace(["    ","   ", "  "], " ", $contents);
    $contents = str_replace(["    ","   ", "  "], " ", $contents);
    return substr($contents, 0, 500) . "...";
}