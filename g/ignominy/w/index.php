    <link href="writers.css" rel="stylesheet" type="text/css">
    <script src="files.php"></script>
    <script defer src="display.js"></script>
    <?php
    session_start();
    if (!isset($_SESSION["ignominy_account_type"]) || $_SESSION["ignominy_account_type"] != "writer" && $_SESSION["ignominy_account_type"] != "mdev") {
        header("location: ../index.php?e=noaccess");
        exit();
    }
    include_once '../head.html' ?>
    <meta property="og:title" content="NachoToast Ignominy Writers Hub">
    <meta property="og:description" content="Hub resource page for the writers on the game Ignominy.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/g/ignominy/main.png">
    <title>Writers Index</title>
</head>
<body>
    <?php
        include_once '../header.php';
    ?>
    <h1 class='noselect' style='text-align: center'>Ignominy Writers Resource Hub</h1>
    <div id="item_select"></div>
    <p>More stuff coming soon.</p>
    <div id="resource_container">
        <div id="documents">
            <h2>Documents</h2>
        </div>
        <div id="stories">
            <h2>Stories</h2>
        </div>
        <div id="other">
            <h2>Other Files</h2>
        </div>
    </div>
</body>
</html>