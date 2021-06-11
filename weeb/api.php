<?php
    
    if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER["CONTENT_TYPE"] !== "application/json") {
        header($_SERVER['SERVER_PROTOCOL'] . " 400 Bad Request");
        exit();
    }
    include_once 'secret.php';
    
    $body = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($body['toaster']) || $body['toaster'] !== $secret) {
        header($_SERVER['SERVER_PROTOCOL'] . " 401 Unauthorized");
        exit();
    }
    
    header($_SERVER['SERVER_PROTOCOL'] . " 200 POG");
    $start = microtime(true);

    function get_tags_array(object $conn, string $image) {
        $sql = $conn -> prepare("SELECT tag FROM `weeb_image_tags` WHERE image = ?");
        $sql -> bind_param("s", $image);
        $sql -> execute();
        $tags_array = array_map(fn($a) => ucwords(str_replace("_", " ", $a[0])), mysqli_fetch_all($sql -> get_result()));
        if (count($tags_array) < 1) return ["None"];
        return $tags_array;
    }

    function get_uploader(object $conn, int $id) {
        $sql = $conn -> prepare("SELECT username FROM `breadcrumbs` WHERE id = ?");
        $sql -> bind_param("i", $id);
        $sql -> execute();
        $res = mysqli_fetch_row($sql -> get_result())[0];
        return $res;
    }

    function submit_response(object $conn, array $response, int $start) {
        $response['tags'] = get_tags_array($conn, $response['name']);
        $response['name'] = 'https://nachotoast.com/weeb/database/' . $response['name'];
        //$response['name'] = 'http://localhost/weeb/database/' . $response['name'];
        $response['uploader'] = get_uploader($conn, $response['uploader']);
        $response['took'] = microtime(true) - $start;
        echo json_encode($response);
        exit();
    }

    function submit_failure(string $reason, int $start) {
        $response = array('fail' => $reason, 'took' => microtime(true) - $start);
        echo json_encode($response);
        exit();
    }

    { // Tag Validation
        function validate_tag(object $conn, array $input_tags_array, int $start, bool $from_super = false) {
            // marks validity of tag, 'tag' => 'tag1', 'confidence' => 'validity', 'type' => ''
            // Validity: Direct Tag > Direct Alias > Indirect Alias > INT (% Confidence Guess) > FAIL
            // Type: inclusive (default - only images with this tag), exclusive (only images WITHOUT this tag)
            $output_tags = array();
            $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_tags` WHERE tag = ?');
            foreach ($input_tags_array as $tag) {
                if (substr($tag, 0, 1) == "!") {
                    $tag = substr($tag, 1);
                    $type = 'exclusive';
                }
                else $type = 'inclusive';
                $sql -> bind_param("s", $tag);
                $sql -> execute();
                $tag_count = mysqli_fetch_row($sql -> get_result())[0];
                if ($tag_count == 0) {
                    $better_tag = find_tag_aliases($conn, $tag, $start, $from_super);
                    array_push($output_tags, array_merge($better_tag, ['type' => $type]));
                }
                else array_push($output_tags, ['tag' => $tag, 'confidence' => 'Direct Tag', 'type' => $type]);
            }
            return $output_tags;
        }
        function find_tag_aliases(object $conn, string $bad_tag, int $start, bool $from_super) {
            $sql = $conn -> prepare("SELECT tag FROM `weeb_tag_aliases` WHERE alias = ?");
            $sql -> bind_param("s", $bad_tag);
            $sql -> execute();
            $res = mysqli_fetch_row($sql -> get_result());
            if ($res === null) {
                if ($from_super) submit_failure("Very bad error occured trying to find the right tag, this should never occur.", $start);
                return medium_find_tag_aliases($conn, $bad_tag, $start);
            }
            return array('tag' => $res[0], 'confidence' => 'Direct Alias');
        }
        function medium_find_tag_aliases(object $conn, string $bad_tag, int $start) {
            $sql = $conn -> prepare("SELECT tag FROM `weeb_tags` WHERE tag like ? UNION SELECT tag FROM `weeb_tag_aliases` WHERE alias like ?");
            $tested_tag = "%$bad_tag%";
            $sql -> bind_param("ss", $tested_tag, $tested_tag);
            $sql -> execute();
            $res = mysqli_fetch_all($sql -> get_result());
            if ($res == null) return super_find_tag_aliases($conn, $bad_tag, $start);
            return array('tag' => $res[0][0], 'confidence' => 'Indirect Alias');
        }
        function super_find_tag_aliases(object $conn, string $bad_tag, int $start) {
            // not sustainable
            $sql = $conn -> prepare("SELECT tag FROM `weeb_tags` UNION SELECT alias FROM `weeb_tag_aliases`");
            $sql -> execute();
            $all_tags = mysqli_fetch_all($sql -> get_result());
            $searched = array();
            foreach ($all_tags as $tag) {
                array_push($searched, ['tag' => $tag[0], 'diff' => levenshtein($tag[0], $bad_tag, 3, 9, 1)]);
            }
            usort($searched, fn($a, $b) => $a['diff'] - $b['diff']);
            if ($searched[0]['diff'] <= 6) {
                $found = validate_tag($conn, array($searched[0]['tag']), $start, true)[0]['tag'];
                return array('tag' => $found, 'confidence' => $searched[0]['diff']);
            }
            return array('tag' => 'FAIL', 'confidence' => $bad_tag);
        }

        function organise_tags(array $tags, array $old_tags) {
            $i = 0;
            $tag_info = array();
            $inclusive_tags = array();
            $exclusive_tags = array();
            foreach ($tags as $tag) { // since order is direct > alias > indirect alias, only the most confident of duplicate tags are kept
                if (in_array($tag['tag'], $inclusive_tags) || in_array($tag['tag'], $exclusive_tags)) {
                    array_push($tag_info, ['tag' => $tag['tag'], 'status' => 'Duplicate']);
                    $i++;
                    continue;
                };
                if ($tag['tag'] === 'FAIL') array_push($tag_info, ['tag' => $old_tags[$i], 'status' => 'Unknown']);
                else {
                    if ($tag['type'] === 'inclusive') array_push($inclusive_tags, $tag['tag']);
                    else array_push($exclusive_tags, $tag['tag']);
                    if (gettype($tag['confidence']) === 'integer') {
                        $confidence = floor(100 * (255 - $tag['confidence']) / 255);
                        array_push($tag_info, ['tag' => $tag['tag'], 'status' => 'Guessed', 'confidence' => $confidence, 'was' => $old_tags[$i]]);
                    }
                    else if ($tag['confidence'] === 'Indirect Alias') array_push($tag_info, ['tag' => $tag['tag'], 'status' => 'Indirect Alias', 'was' => $old_tags[$i]]);
                    else array_push($tag_info, ['tag' => $old_tags[$i], 'status' => $tag['confidence']]);
                }
                $i++;
            }
            return array($tag_info, $inclusive_tags, $exclusive_tags);
        }
    }

    include_once '../inc/dbh.inc.php';

    // no tags or args specified
    if (!isset($body['tags']) && !isset($body['args'])) {
        $sql = $conn -> prepare('SELECT COUNT(*) FROM `weeb_images`');
        $sql -> execute();
        $pool = mysqli_fetch_row($sql -> get_result())[0];
        $random = rand(0, $pool - 1);
        $sql = $conn -> prepare("SELECT * FROM `weeb_images` LIMIT $random,1");
        //$sql = $conn -> prepare("SELECT * FROM `weeb_images` WHERE name = 'KonoSuba/Megumin/vuPd40td5GojfOW4Azj9k4R8ggXsV3xwZJFiCrWJ4BY.jpg'");
        $sql -> execute();
        $response = mysqli_fetch_assoc($sql -> get_result());
        $response['pool_size'] = $pool;
        submit_response($conn, $response, $start);
    }

    // filtered content
    $sql = $conn -> prepare('CREATE TEMPORARY TABLE `filtered_images` SELECT * FROM `weeb_images`');
    $sql -> execute();
    //header($_SERVER['SERVER_PROTOCOL'] . " 401 Unauthorized");
    
    { // args
        if (isset($body['args']['size'])) { // file size (KB)
            $sizes = explode("..", $body['args']['size']);
            $min = intval($sizes[0]);
            $max = intval($sizes[1]);
            if ($max == 0) $max = 999999;
            if ($max < $min) {
                $temp = $max;
                $max = $min;
                $min = $temp;
            }
            $sql = $conn -> prepare('DELETE FROM `filtered_images` WHERE size NOT BETWEEN ? AND ?');
            $sql -> bind_param("ii", $min, $max);
            $sql -> execute();
        }
        if (isset($body['args']['added'])) { // how recent (days ago)
            $sizes = explode("..", $body['args']['added']);
            $min = intval($sizes[0]) * 86400;
            $max = intval($sizes[1]) * 86400;
            if ($max == 0) $max = $now;
            if ($max < $min) {
                $temp = $max;
                $max = $min;
                $min = $temp;
            }
            $temp = $max;
            $max = $start - $min;
            $min = $start - $temp;
            $sql = $conn -> prepare('DELETE FROM `filtered_images` WHERE added NOT BETWEEN ? AND ?');
            $sql -> bind_param("ii", $min, $max);
            $sql -> execute();
        }
    }

    // tags
    if (isset($body['tags']) && count($body['tags']) > 0) {
        $checked_tags = validate_tag($conn, $body['tags'], $start);
        $organised_tags = organise_tags($checked_tags, $body['tags']);
        $tag_info = $organised_tags[0];
        $inclusive = $organised_tags[1];
        $exclusive = $organised_tags[2];
        if (count($inclusive) + count($exclusive) == 0) submit_failure("None of the requested tags could be found on the database.", $start);

        if (count($exclusive) > 0) {
            $sql = $conn -> prepare("DELETE FROM `filtered_images` WHERE name IN (SELECT image FROM `weeb_image_tags` WHERE image = `filtered_images`.name AND tag = ?)");
            foreach ($exclusive as $tag) {
                $sql -> bind_param("s", $tag);
                $sql -> execute();
            }
        }
        if (count($inclusive) > 0) {
            $sql = $conn -> prepare("DELETE FROM `filtered_images` WHERE name NOT IN (SELECT image FROM `weeb_image_tags` WHERE image = `filtered_images`.name AND tag = ?)");
            foreach ($inclusive as $tag) {
                $sql -> bind_param("s", $tag);
                $sql -> execute();
            }
        }
    }

    $sql = $conn -> prepare('SELECT COUNT(*) FROM `filtered_images`');
    $sql -> execute();
    $pool = mysqli_fetch_row($sql -> get_result())[0];
    if ($pool == 0) submit_failure("Couldn't find any images that matched the search conditions.", $start);
    $random = rand(0, $pool - 1);
    $sql = $conn -> prepare("SELECT * FROM `filtered_images` LIMIT $random,1");
    $sql -> execute();
    $response = mysqli_fetch_assoc($sql -> get_result());
    if (isset($tag_info)) $response['tag_info'] = $tag_info;
    $response['pool_size'] = $pool;
    submit_response($conn, $response, $start);
    /*
    name: path to image
    added: added image in unix timestamp (s)
    uploader: id of user who uploaded it
    source: source of image
    size: size of image in kb

    tags: array of tags the image has
    */