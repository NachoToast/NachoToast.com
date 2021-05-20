<?php include_once 'head.html' ?>
    <meta property="og:title" content="NachoToast Home Page">
    <meta property="og:description" content="Home page for the NachoToast website.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Home</title>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php' ;
    ?>
    <h1 style='margin-bottom: 5px; text-align: center'>Welcome to <span style='color: gold'>NachoToast.com</span></h1>
    <p style='margin: 0; color: gray;'>Now with meta!</p>
    <h2 style='margin-bottom: 5px; margin-top: 35px'>Website Roadmap:</h2>
    <p style='margin: 0; color: gray;'>From highest to lowest priority.</p>
        <p class="complete"><a href="https://github.com/NachoToast/NachoToast.com" target="_blank">Make GitHub Repo</a></p>
        <p class="complete"><a href="users.php">Users Page</a></p>
        <p class="complete"><a href="changelog">Changelog</a></p>
        <p class='complete'><a href='about'>About Page</a></p>
        <p class='complete'><a href='g/ignominy/'>Ignominy Hub</a></p>
        <p style='text-decoration:line-through'>Roadmap Page</p>
        <p>Online Users</p>
        <p>Chat Forums</p>
        <p>Email Integration</p>
        <p class='complete'><a href='changelog'>API Stuff???</a></p>
</body>
</html>