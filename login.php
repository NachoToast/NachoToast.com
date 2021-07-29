    <?php include_once 'head.html' ?>
    <link href="css/forms.css" rel="stylesheet" type="text/css">
    <script defer src="js/login.js"></script>
    <meta property="og:title" content="NachoToast Login Page">
    <meta property="og:description" content="Login to your NachoToast account.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Login</title>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php';
        if (isset($_GET["o"])) $redirect = "?o=" . $_GET["o"];
        else $redirect = "";
        if (isset($redirect)) {
            $redirect = htmlspecialchars($redirect);
        }
    ?>
    <form action="inc/login.inc.php<?php echo $redirect ?>" method="post" class="form">
    <input name="username" id="login_username" placeholder="Username/Email" autofocus required oninput="update_form()">
    <input type="password" name="password" id="login_password" placeholder="Password" required oninput="update_form()">
    <?php 
        if (isset($_GET["e"])) {
            if ($_GET["e"] == "empty") echo "<p class='output'>Empty Fields!</p>";
            else if ($_GET["e"] == "invalid") echo "<p class='output'>Invalid Username or Password!</p>";
            else if ($_GET["e"] == "wrongway") echo "<p class='output'>Hello? My inputs are up here.</p>";
            else echo "<p class='output'>Unknown Error!</p>";
        }
    ?>
    <button type="submit" name="submit_login" id="login_submit" disabled>Continue</button>
    <p class="noselect">Don't have an account? <a id="request_account" href="signup.php<?php echo $redirect ?>">Make one.</a>
</form>
</body>
</html>