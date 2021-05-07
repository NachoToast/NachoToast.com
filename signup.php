<?php include_once 'head.html' ?>
    <link href="css/forms.css" rel="stylesheet" type="text/css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script defer src="js/signup.js"></script>
    <script defer src="https://www.google.com/recaptcha/api.js"></script>
    <meta property="og:title" content="NachoToast Signup Page">
    <meta property="og:description" content="Register an account on NachoToast.com">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Sign Up</title>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php' ;
    ?>
    <form action="inc/signup.inc.php" method="post" class="form" id="signup_form">
    <p class='output output2'>Username Too Short!</p>
    <input name="username" id="signup_username" placeholder="Username" autofocus required oninput="update_username(this.value)" minlength=3 maxlength=20>
    <p class='output output2'>Email Taken!</p>
    <input name="email" id="signup_email" placeholder="Email" autofocus require oninput="update_email(this.value)" maxlength="128">
    <p class='output output2'>Password Too Short!</p>
    <input type="password" name="password" id="signup_password" placeholder="Password" required oninput="update_password(this.value)" minlength=5 maxlength=255>
    <p class='output output2'>Passwords Don't Match!</p> 
    <input type="password" name="password_confirm" id="signup_password_confirm" placeholder="Confirm Password" required oninput="update_password_confirm(this.value)">
    <?php 
        if (isset($_GET["e"])) {
            if ($_GET["e"] == "empty") echo "<p class='output'>Empty Username or Password!</p>";
            else if ($_GET["e"] == "invalid") echo "<p class='output'>Invalid Username or Password!</p>";
            else if ($_GET["e"] == "wrongway") echo "<p class='output'>Hello? My inputs are up here.</p>";
            else if ($_GET["e"] == "captchaexpired") echo "<p class='output'>Captcha Expired, Try Again.</p>";
            else if ($_GET["e"] == "taken") echo "<p class='output'>Username or Email Taken!</p>";
            else if ($_GET["e"] == "ip") echo "<p class='output'>Too Many Accounts!</p>";
            else if ($_GET["e"] == "email") echo "<p class='output'>Invalid Email!</p>";
            else echo "<p class='output'>Unknown Error!</p>";
        }
    ?>
    <button type="submit" id="signup_submit" disabled class="g-recaptcha" data-sitekey="6LcmnGkaAAAAAK1xje2-NrSsgCQUsd7y-woMPTgs" data-callback="onSubmit" data-action="submit">Continue</button>
</form>
</body>
</html>