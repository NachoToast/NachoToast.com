    <?php include_once '../head.html' ?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script defer src="weeb/api.js"></script>
    <meta property="og:title" content="NachoToast Home Page">
    <meta property="og:description" content="Home page for the NachoToast website.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Weeb</title>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
        include_once 'secret.php';
        $url = "http://localhost/weeb/api";
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode(array(
            'toaster' => $secret
        )));
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        $out = curl_exec($curl);
        $response_code = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
        if ($response_code !== 200) {
            echo $out;
        }
        else {
            $res = json_decode($out, true);
            echo "<img src='" . $res['name'] . "' style='max-width: 100vw; height: auto;'>";
            echo $res['name'] . " (" . $res['size'] . "KB)";
            echo "<br> Index: " . $res['index'];
        }
    ?>
    <h1>Making an API???</h1>
</body>
</html>