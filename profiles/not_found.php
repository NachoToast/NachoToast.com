    <meta property="og:title" content="NachoToast User Not Found">
    <meta property="og:description" content="Couldn't find the specified user!">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/good_boye.jpg">
    <title>User Not Found</title>
</head>
<body>
    <?php include_once 'header.php' ?>
    <h1>User not found!</h1>
    <!--a href='profiles.php'>Back</a-->
    <p>Couldn't find a user with ID <?php echo htmlspecialchars($_GET["user"]) ?>.</p>
    <p>¯\_(ツ)_/¯</p>
</body>
</html>