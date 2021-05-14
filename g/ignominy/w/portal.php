    <?php
    session_start();
    if (!isset($_SESSION["ignominy_account_type"]) || $_SESSION["ignominy_account_type"] != "writer" && $_SESSION["ignominy_account_type"] != "mdev") {
        header("location: ../index.php?e=noaccess");
        exit();
    }
    if (!isset($_GET["o"]) || !isset($_GET["t"])) {
        echo "<p>No destination link specified, or invalid destination address. Taking you back to hub page.</p><meta http-equiv='refresh' content=\"3 url='index'\">";
        echo "<p>Or <a href=\"index\">click here</a> if that doesn't work.</p>";
        exit();
    }
    ?>
    <link href="writers.css" rel="stylesheet" type="text/css">
    <?php include_once '../head.html' ?>
    <meta property="og:title" content="Ignominy Writers Portal">
    <meta property="og:description" content="Ignominy writers portal.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/g/ignominy/main.png">
    <base href="/g/ignominy/w/portal">
    <title>Writers Index</title>
</head>
<body>
        <?php
            include_once '../header.php';
            echo '<div id="portal_content">';
            $path = $_GET["o"];
            $type = $_GET["t"];
            if ($type == "piece") {
                $filename = $_GET["o"] . ".txt";
                $file = fopen($filename, "r");
                $contents = strip_tags(fread($file, filesize($filename)));
                fclose($file);
                $contents = str_replace("\n", "</p><p>", $contents);
                echo "<div id='piece'><p>" . $contents . "</p></div>";
            }
            else if ($_GET["t"] == "data") {
                $filename = $_GET["o"] . ".html";
                $file = fopen($filename, "r");
                $contents = fread($file, filesize($filename));
                fclose($file);
                $link_replace = "href=\"/g/ignominy/w/portal?o=" . $_GET["o"] . "&t=" . $_GET["t"] . "#";
                $contents = str_replace("href=\"#", $link_replace, $contents);
                echo $contents;
            }
            else if ($_GET["t"] == "other") {
                if (isset($_GET["f"]) && $_GET["f"] == "pdf") echo "<script defer src='/g/ignominy/w/pdf.js'></script>";
                echo "<embed class=\"other_embed\" src=\"/g/ignominy/w/" . $_GET["o"] . "\">";
            }
            echo '</div>';
        ?>
</body>
</html>