    <link rel="stylesheet" href="solarized-dark.css" type="text/css">
    <script defer src="highlight.pack.js"></script>
    <link href="stylesheet.css" rel="stylesheet" type="text/css">
    <script>const resources = [
        <?php
            session_start();
            $revision_exercise_files = array();
            $i = 0;
            foreach(glob('revision_exercises/*.html') as $filename) {
                $p = pathinfo($filename);
                $n = $p['filename'];
                $n = str_replace('_', ' ', $n);
                $n = ucwords($n);
                $fs = filesize($filename);
                $file = fopen($filename, "r");
                $contents = fread($file, $fs);
                fclose($file);
                $revision_exercise_files[$i]['name'] = $n;
                $arr = explode("<pre>", $contents);
                array_shift($arr);
                $revision_exercise_files[$i]['contents'] = $arr;
                $revision_exercise_files[$i]['size'] = $fs;
                $revision_exercise_files[$i]['order'] = floatval(substr($contents, 0, 2));
                $i++;
            }
            function cmp($a, $b) {
                return $a['order'] - $b['order'];
            }

            usort($revision_exercise_files, "cmp");
            echo json_encode($revision_exercise_files);
        ?>,
        <?php
            $assessments_files = array();
            $i = 0;
            foreach(glob('assessments/*.html') as $filename) {
                $p = pathinfo($filename);
                $n = $p['filename'];
                $n = str_replace('_', ' ', $n);
                $n = ucwords($n);
                $fs = filesize($filename);
                $file = fopen($filename, "r");
                $contents = fread($file, $fs);
                fclose($file);
                $assessments_files[$i]['name'] = $n;
                $arr = explode("<pre>", $contents);
                array_shift($arr);
                $assessments_files[$i]['contents'] = $arr;
                $assessments_files[$i]['size'] = $fs;
                $assessments_files[$i]['order'] = floatval(substr($contents, 0, 2));
                $i++;
            }

            usort($assessments_files, "cmp");
            echo json_encode($assessments_files);
        ?>]
    </script>
    <script defer src='display_files.js'></script>
    <?php
        if (isset($_GET["q"]) && isset($_GET["p"]) && isset($_GET["t"])) {
            if ($_GET["t"] == 0) $files = $revision_exercise_files;
            else if ($_GET["t"] == 1) $files = $assessments_files;
            ?>
                <script>const from_url = true; url_data = {type: <?php echo $_GET["t"]?>,question:<?php echo $_GET["q"] ?>, page:<?php echo $_GET["p"] ?>} </script>
                <meta property="og:title" content="<?php echo $files[$_GET["p"] - 1]['name'] . ', Question ' . $_GET["q"]?>">
                <meta property="og:description" content="<?php
                            $output = $files[$_GET["p"] - 1]['contents'][$_GET["q"]];
                            $output = substr($output, 6, -10);
                            $output = nl2br($output);
                            $output = htmlentities($output);
                            echo $output;
                    ?>">
            <?php
        }
        else {
            ?>
                <meta property="og:title" content="CompSci101 Index">
                <meta property="og:description" content="Index page for the CompSci101 resource hub on the NachoToast website.">
                <script>const from_url = false</script>
            <?php
        }
        include_once '../head.html';
    ?>
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>101 Index</title>
</head>
<body>
    <?php
        include_once '../header.php' ;
    ?>
    <h1 class='noselect'>CompSci 101 Index</h1>
    <div id='global_notification_box'>
        <?php
            if (!isset($_COOKIE["17/05_update"])) echo "<p class='noselect' id='17/05_update'>17/05 Update: Lecture 25 exercises are now available, also big thanks to AzureSky for pointing out some bugs.</p>";
            if (!isset($_COOKIE["site_cookie_notification"])) echo "<p class='noselect' id='site_cookie_notification'>This site now uses cookies. You can click here to remove this notification.</p>";
        ?>

    </div>
    <div id='resource_container'>
        <div id='quick_links'>
            <h2 class='noselect'>Quick Links</h2>
            <a class="noselect" target="_blank" href="https://uoa.tukib.org/">Bryn's Dashboard</a>
            <a class="noselect" target="_blank" href="https://notes.joewuthrich.com/compsci101">Joe's Notes</a>
            <a class="noselect" target="_blank" href="https://coderunner.auckland.ac.nz/moodle/course/view.php?id=3391">Coderunner</a>
            <a class="noselect" target="_blank" href="https://canvas.auckland.ac.nz/courses/60604">Canvas</a>
            <a class="noselect" target="_blank" href="https://discord.gg/QZgUWJQhJ7">Discord</a>
            <a class="noselect" target="_blank" href="https://www.library.auckland.ac.nz/exam-papers/subject/Computer%20Science/COMPSCI%20101">Past Papers</a>
        </div>
        <div id='revision_exercises' class='noselect special_scroll'>
            <!--h2 id='revision_exercise_heading'>Revision Exercise Answers</h2-->
        </div>
        <div id='assessments' class='noselect special_scroll'>
            <!--h2 id='assessments_heading'>Assessment Answers</h2-->
        </div>
    </div>
    <div id="output_container">

    </div>
</body>
</html>