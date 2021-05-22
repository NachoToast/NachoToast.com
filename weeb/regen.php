<?php
    $owner = 1;
    session_start();
    if (!isset($_GET["mode"]) || $_SESSION["id"] != $owner) { // 132 | 1
        header("location: index?e=na");
        exit();
    }
    // adding new images
    if ($_GET["mode"] == "add") {

        $started = microtime(true);
        // folder tag mapping
        function map_file_name_to_tags($str) {
            // because folder name != tag name
            $str = str_replace(["!", "+"], "", $str);
            switch ($str) {
                case 'Hatsune_Miku':
                    return ['hatsune_miku', 'vocaloid', 'dominos_pizza'];
                case 'Akama_Ga_Kill':
                    return ['akame_ga_kill'];
                case 'Green_Haired_Bitch':
                    return ['zero_two', 'darling_in_the_franxx'];
                case 'SAO':
                    return ['sword_art_online'];
                case 'NGNL':
                    return ['no_game_no_life'];
                case 'Pog':
                    return ['meme'];
                case 'Re-Zero':
                    return ['re:zero'];
                case 'Rin_and_Ishtar':
                    return ['rin_tohsaka'];
                case 'Saber_Saber_Alter':
                    return ['artoria_pendragon'];
                case 'Shield_Hero':
                    return ['rise_of_the_shield_hero'];
                case 'Quintissential Quintuplets':
                    return ['quintessential_quintuplets'];
                default:
                    return explode("__",strtolower(str_replace([" ", "-"], "_", $str)));
            }
        }
        // get folders recursively
        function get_folders($root) {
            $local_folders_array = array();

            foreach (glob("$root/*", GLOB_ONLYDIR) as $folder) {
                $safe = str_replace(" ", "_", $folder);
                if ($safe !== $folder) {
                    rename($folder, $safe);
                    $folder = $safe;
                }
                $tags = map_file_name_to_tags(pathinfo($folder)['basename']);
                array_push($local_folders_array, ['foldername' => $folder, 'tags' => $tags]);

                // recurse
                $arr2 = get_folders($folder);
                if (count($arr2) > 0) foreach($arr2 as $subfolder) {
                    array_push($local_folders_array, ['foldername' => $subfolder['foldername'], 'tags' => array_merge($tags, $subfolder['tags'])]);
                }
            }
            return $local_folders_array;
        }
        $folders = get_folders("database");

        // create new arrays
        $new_weeb_images = array(); // ['image1', 'image2', 'image3', ...]
        $new_weeb_tags = array(); // ['tag1', 'tag2', 'tag3', ...]
        $new_weeb_image_tags = array(); // [0 => ['filename' => 'image1', 'tags' => ['tag1', 'tag2']], 1 => ...]
        $new_weeb_tag_aliases = array(); // [ 0 => ['tag' => 'tag1', 'aliases' => ['tag1a', 'tag1b']], 1 => ...]

        { // array population from (all) read files
            function image_populate(array $array = array(), string $root = "database") {
                foreach(glob("$root/*.{*}", GLOB_BRACE) as $file) {
                    $ext = pathinfo($file)['extension'];
                    if (substr(pathinfo($file)['filename'], - 3) == "(1)" || substr(pathinfo($file)['filename'], -4) == "Copy") {
                        echo "Skipping possible duplicate: " . substr($file, 9) . "<br>";
                        continue;
                    }
                    
                    if ($ext !== "png" && $ext !== "jpg" && $ext !== "jfif") {
                        echo "Invalid file type: " . substr($file, 9) . "<br>";
                        continue;
                    }
                    if ($ext == "jfif") {
                        $jpegged = substr($file, 0, strlen($file) - 4) . "jpg";
                        rename($file, $jpegged);
                        $file = $jpegged;
                    }
                    $safe = str_replace(" ", "_", $file);
                    rename($file, $safe);
                    $file = $safe;
                    array_push($array, substr($file, 9));
                }
                return $array;
            }
            // non-nested files
            $new_weeb_images = image_populate($new_weeb_images);
            // nested files
            foreach ($folders as $folder) {
                // images
                $new_weeb_images = image_populate($new_weeb_images, $folder['foldername']);
    
                // tags
                $folder_specific_tags = array();
                foreach ($folder['tags'] as $tag) {
                    array_push($folder_specific_tags, $tag);
                    if (in_array($tag, $new_weeb_tags)) continue;
                    array_push($new_weeb_tags, $tag);
                }
                // image tag associations
    
                foreach (glob($folder['foldername'] . "/*.{*}", GLOB_BRACE) as $file) {
                    array_push($new_weeb_image_tags, ['filename' => substr($file, 9), 'tags' => $folder_specific_tags]);
                }
            }
        }

        { // tag aliases
            // mapping function
            function map_tag_aliases($tag) {
                switch ($tag) {
                    case 'akame_ga_kill':
                        return ['agk', 'akame_ga_kiru'];
                    case 'darling_in_the_franxx':
                        return ['ditf'];
                    case 'sword_art_online':
                        return ['sao'];
                    case 'no_game_no_life':
                        return ['ngnl'];
                    case 'konosuba':
                        return ['kono_suba', 'konosuba_gods_blessing_on_this_wonderful_world', 'give_blessings_to_this_wonderful_world'];
                    case 'backgrounds':
                        return ['bg'];
                    case 're:zero':
                        return ['re_zero', 're:zero_starting_life_in_another_world', 're:zero_kara_hajimeru_isekai_seikatsu'];
                    case 'rin_tohsaka':
                        return ['tohsaka_rin', 'rin', 'ishtar'];
                    case 'artoria_pendragon':
                        return ['prince_arthur', 'arutoria_pendoragon'];
                    case 'rise_of_the_shield_hero':
                        return ['shield_hero', 'the_rising_of_the_shield_hero', 'tate_no_yuusha'];
                    case 'astolfo':
                        return ['kuro_no_rider', 'rider_of_black'];
                    case 'quintessential_quintuplets':
                        return ['gotoubun_no_hanayome'];
                    default:
                        return [];
                }
            }
            // finding
            foreach ($new_weeb_tags as $tag) {
                // map
                $ta = map_tag_aliases($tag);
                if (count($ta) > 0) array_push($new_weeb_tag_aliases, ['tag' => $tag, 'aliases' => $ta]);
            }
        }

        echo "Checking " . count($new_weeb_images) . " images (" . count($new_weeb_image_tags) . " with tags).<br>";
        echo "Checking " . count($new_weeb_tags) . " tags";
        echo " (" . count($new_weeb_tag_aliases) . " with aliases).<br>";
        
        // database duplicate checking and other stat getting
        include_once '../inc/dbh.inc.php';
        $query_count = 0;

        { // duplicate filtering functions
            function remove_existing_weeb_images(object $conn, array $new_weeb_images) {
                $i = 0;
                $removed = array();
                $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_images` WHERE name = ?');
                foreach ($new_weeb_images as $new_image) {
                    $i++;
                    $sql -> bind_param("s", $new_image);
                    $sql -> execute();
                    $res = mysqli_fetch_assoc($sql -> get_result())['COUNT(*)'];
                    if ($res > 0) {
                        array_push($removed, $new_image);
                        array_splice($new_weeb_images, array_search($new_image, $new_weeb_images), 1);
                    }
                }
                return array($new_weeb_images, $removed, $i);
            }
    
            function remove_existing_weeb_tags(object $conn, array $new_weeb_tags) {
                $i = 0;
                $removed = array();
                $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_tags` WHERE tag = ?');
                foreach ($new_weeb_tags as $new_tag) {
                    $i++;
                    $sql -> bind_param("s", $new_tag);
                    $sql -> execute();
                    $res = mysqli_fetch_assoc($sql -> get_result())['COUNT(*)'];
                    if ($res > 0) {
                        array_push($removed, $new_tag);
                        array_splice($new_weeb_tags, array_search($new_tag, $new_weeb_tags), 1);
                    }
                }
                return array($new_weeb_tags, $removed, $i);
            }
    
            function remove_existing_weeb_image_tags(object $conn, array $new_weeb_image_tags) {
                $i = 0;
                $removed = array();
                $kept = array();
                $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_image_tags` WHERE image = ? AND tag = ?');
                foreach ($new_weeb_image_tags as $new_image_tag) {
                    foreach ($new_image_tag['tags'] as $tag) {
                        $i++;
                        $sql -> bind_param("ss", $new_image_tag['filename'], $tag);
                        $sql -> execute();
                        $res = mysqli_fetch_assoc($sql -> get_result())['COUNT(*)'];
                        if ($res > 0) array_push($removed, ['filename' => $new_image_tag['filename'], 'tag' => $tag]);
                        else array_push($kept, ['filename' => $new_image_tag['filename'], 'tag' => $tag]);
                    }
                }
                return array($kept, $removed, $i);
            }
    
            function remove_existing_weeb_tag_aliases(object $conn, array $new_weeb_tag_aliases) {
                $i = 0;
                $removed = array();
                $kept = array();
                $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_tag_aliases` WHERE alias = ?');
                foreach ($new_weeb_tag_aliases as $tag) {
                    foreach ($tag['aliases'] as $alias) {
                        $i++;
                        $sql -> bind_param("s", $alias);
                        $sql -> execute();
                        $res = mysqli_fetch_assoc($sql -> get_result())['COUNT(*)'];
                        if ($res > 0) array_push($removed, ['tag' => $tag['tag'], 'alias' => $alias]);
                        else array_push($kept, ['tag' => $tag['tag'], 'alias' => $alias]);
                    }
                }
                return array($kept, $removed, $i);
            }
        }

        { // images
            $combined_weeb_images = remove_existing_weeb_images($conn, $new_weeb_images);
            $unique_weeb_images = $combined_weeb_images[0];
            $removed_weeb_images = $combined_weeb_images[1];
            $query_count += $combined_weeb_images[2];
            echo "<br>Found " . count($unique_weeb_images) . " new images, " . count($removed_weeb_images) . " duplicate images (" . $combined_weeb_images[2] . " queries).";
        }
        { // tags
            $combined_weeb_tags = remove_existing_weeb_tags($conn, $new_weeb_tags);
            $unique_weeb_tags = $combined_weeb_tags[0];
            $removed_weeb_tags = $combined_weeb_tags[1];
            $query_count += $combined_weeb_tags[2];
            echo "<br>Found " . count($unique_weeb_tags) . " new tags, " . count($removed_weeb_tags) . " duplicate tags (" . $combined_weeb_tags[2] . " queries).";
        }
        { // image tags
            $combined_weeb_image_tags = remove_existing_weeb_image_tags($conn, $new_weeb_image_tags);
            $unique_weeb_image_tags = $combined_weeb_image_tags[0];
            $removed_weeb_image_tags = $combined_weeb_image_tags[1];
            $query_count += $combined_weeb_image_tags[2];
            echo "<br>Found " . count($unique_weeb_image_tags) . " new image-tag relations, " . count($removed_weeb_image_tags) . " duplicate image-tag relations (" . $combined_weeb_image_tags[2] . " queries).";
        }
        { // tag aliases
            $combined_weeb_tag_aliases = remove_existing_weeb_tag_aliases($conn, $new_weeb_tag_aliases);
            $unique_weeb_tag_aliases = $combined_weeb_tag_aliases[0];
            $removed_weeb_tag_aliases = $combined_weeb_tag_aliases[1];
            $query_count += $combined_weeb_tag_aliases[2];
            echo "<br>Found " . count($unique_weeb_tag_aliases) . " new tag aliases, " . count($removed_weeb_tag_aliases) . " duplicate tag aliases (" . $combined_weeb_tag_aliases[2] . " queries).";
        }


        // insertion
        $now = time();

        { // database insertion functions
            function insert_unique_weeb_images(object $conn, array $images, int $time, int $author) {
                $i = 0;
                $sql = $conn -> prepare('INSERT INTO `weeb_images` (name, added, uploader, size) VALUES (?, ?, ?, ?)');
                foreach ($images as $image) {
                    $i++;
                    $size = filesize("database/$image") / 1024;
                    $size = ceil($size);
                    $sql -> bind_param("siii", $image, $time, $author, $size);
                    $sql -> execute();
                }
                return $i;
            }
            function insert_unique_weeb_tags(object $conn, array $tags) {
                $i = 0;
                $sql = $conn -> prepare('INSERT INTO `weeb_tags` (tag) VALUES (?)');
                foreach ($tags as $tag) {
                    $i++;
                    $sql -> bind_param("s", $tag);
                    $sql -> execute();
                }
                return $i;
            }
            function insert_unique_weeb_image_tags(object $conn, array $image_tag_array) {
                $i = 0;
                $sql = $conn -> prepare('INSERT INTO `weeb_image_tags` (image, tag) VALUES (?, ?)');
                foreach ($image_tag_array as $image_tag) {
                    $i++;
                    $sql -> bind_param("ss", $image_tag['filename'], $image_tag['tag']);
                    $sql -> execute();
                }
                return $i;
            }
            function insert_unique_weeb_tag_aliases(object $conn, array $aliases_array) {
                $i = 0;
                $sql = $conn -> prepare('INSERT INTO `weeb_tag_aliases` (alias, tag) VALUES (?, ?)');
                foreach ($aliases_array as $tag_alias) {
                    $i++;
                    $sql -> bind_param("ss", $tag_alias['alias'], $tag_alias['tag']);
                    $sql -> execute();
                }
                return $i;
            }
        }

        $weeb_image_inserts = insert_unique_weeb_images($conn, $unique_weeb_images, $now, $owner);
        echo "<br>$weeb_image_inserts successful image inserts.";
        $weeb_tag_inserts = insert_unique_weeb_tags($conn, $unique_weeb_tags);
        echo "<br>$weeb_tag_inserts successful image inserts.";
        $weeb_image_tag_inserts = insert_unique_weeb_image_tags($conn, $unique_weeb_image_tags);
        echo "<br>$weeb_image_tag_inserts successful image-tag inserts.";
        $weeb_tag_alias_inserts = insert_unique_weeb_tag_aliases($conn, $unique_weeb_tag_aliases);
        echo "<br>$weeb_tag_inserts successful tag alias inserts.";
        $insertion_count = $weeb_image_inserts + $weeb_tag_inserts + $weeb_image_tag_inserts + $weeb_tag_alias_inserts;
        $total_query_count = $query_count + $insertion_count;

        echo "<br><br>Total $query_count check queries, $insertion_count insert queries ($total_query_count total).";
        echo "<br><br>Done in " . round(microtime(true) - $started, 3) . " seconds (" . round( 1000000 * (microtime(true) - $started) / $total_query_count, 0) . " μs/query).";

        { // extra analytics
            echo "<br><br><br><br>";

            // tags
            $lt = array(0, "");
            foreach ($new_weeb_tags as $tag) {
                if (strlen($tag) > $lt[0]) $lt = array(strlen($tag), $tag);
            }
            foreach ($new_weeb_tag_aliases as $tap) foreach ($tap['aliases'] as $alias) if (strlen($alias) > $lt[0]) $lt = array(strlen($alias), $alias);
            echo "<br>Longest Tag: " . $lt[1] . " (" . $lt[0] . "<b>/</b>63)";
    
            // images
            $lf = array(0, "");
            $total_size = 0;
            foreach ($new_weeb_images as $image) {
                $size = filesize("database/$image");
                $total_size += $size;
                if ($size > $lf[0]) $lf = array($size, $image);
            }
            echo "<br>Largest File: " . $lf[1] . " - " . round($lf[0] / 1048576, 2) . " MB";
            echo "<br>Total Database Size: " . round($total_size / 1048576, 2) . " MB";

            // validation
            { // whitespace
                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images` WHERE name like '% %' UNION SELECT count(*) FROM `weeb_image_tags` WHERE tag like '% %'");
                $sql -> execute();
                $whitespaces = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>Whitespaces Found: $whitespaces";
            }
            { // extensions
                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images`");
                $sql -> execute();
                $total_image_count = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>Total Image Count: $total_image_count";

                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images` WHERE name like '%.png'");
                $sql -> execute();
                $pngs = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>PNG: $pngs";

                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images` WHERE name like '%.jpg'");
                $sql -> execute();
                $jpgs = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>JPG: $jpgs";

                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images` WHERE name like '%.jpeg'");
                $sql -> execute();
                $jpegs = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>JPEG: $jpegs";

                $sql = $conn -> prepare("SELECT count(*) FROM `weeb_images` WHERE name like '%.jfif'");
                $sql -> execute();
                $jfifs = mysqli_fetch_assoc($sql -> get_result())['count(*)'];
                echo "<br>JFIF: $jfifs";

                echo "<br>Other: " . $total_image_count - $pngs - $jpgs - $jpegs - $jfifs;
            }


    
        }
        exit();
    }
    echo "Invalid mode.";