    <link href="css/forms.css" rel="stylesheet" type="text/css">
    <link href="css/profile.css" rel="stylesheet" type="text/css">
    <script defer src="js/settings.js"></script>
    <?php
        if (isset($_GET["s"]) || isset($_GET["e"])) echo "<script>var already_open = true</script>";
        else echo "<script>var already_open = false</script>";
        if ($own) echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>';
    ?>
    <meta property="og:title" content="<?php echo $username . "'s Profile" ?>">
    <meta property="og:description" content="<?php echo $desc ?>">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/<?php echo $pfp ?>">
    <title><?php echo $username . "'s Profile" ?></title>
</head>
<body>
    <?php include_once 'header.php'?>
    <div id="profile">
        <h1><span title='<?php echo $usc?>'><?php echo $username ?></span></h1>
        <img src="<?php echo $pfp ?>">
        <p <?php if(strlen($desc) < 1) echo "style='display: none'"?> ><?php echo $desc ?></p>
        <p class='ts'>Last Online: <?php echo $seen ?></p>
        <p class='ts'>Registered: <?php echo $reg ?></p>
    </div>
    <?php
        if ($own) {
            ?>
                <div id="settings">
                    <h1 onclick="toggle_settings(this)" class='noselect' id="settings_main_button">Settings</h1>
                    <form class='form' action="inc/settings.inc.php?user=<?php echo $_GET["user"] ?>" method="post">
                        <h2>Username</h2>
                        <p style='text-align: center'>Last Changed: <?php echo $usc2 ?></p>
                        <?php
                            if ($changeable_username) {
                                ?>
                                    <p>Username change <span class='usc' title='You can change your username every 30 days.' style='color: lightgreen'>available</span>.</p>
                                    <p class='output output2' id='output_username'></p>
                                    <input placeholder="New Username" minlength="3" maxlength="20" required oninput="check_username(this.value)" name="new_username">
                                    <button type="submit" name="uc_submit" id="uc_submit_button" disabled>Change</button>
                                <?php
                            } else if (!(isset($_GET["s"]) && $_GET["s"] == "username")) echo "<p>Username change <span class='usc' style='color: lightcoral' title='You changed your username < 30 days ago.'>unavailable</span>.</p>";
                            if (isset($_GET["s"]) && $_GET["s"] == "username") echo "<p style='color: lightgreen'>Username change successful!</p>";
                        ?>
                    </form>
                    <form class='form' action="inc/settings.inc.php?user=<?php echo $_GET["user"] ?>" method="post">
                        <h2>Password</h2>
                        <input type="password" placeholder="Current Password" name="old_password" required>
                        <input type="password" minlength="5" maxlength="255" placeholder="New Password" required name="new_password" class="input_password" oninput="update_password(this.value)">
                        <p class='output output2 output_password'></p>
                        <input type="password" minlength="5" maxlength="255" placeholder="Confirm Password" required name="new_password_confirm" class="input_password" oninput="update_password_confirm(this.value)">
                        <p class='output output2 output_password'></p>
                        <button type="submit" disabled id="pc_submit_button" name="pc_submit">Submit</button>
                        <?php
                            if (isset($_GET["s"]) && $_GET["s"] == "password") echo "<p style='color: lightgreen'>Password change successful!</p>";
                            if (isset($_GET["e"])) {
                                if ($_GET["e"] == "password_incorrect") echo "<p class='output'>Incorrect Password!</p>";
                            }
                        ?>
                    </form>
                    <form class='form' action="inc/settings.inc.php?user=<?php echo $_GET["user"] ?>" method="post" enctype="multipart/form-data">
                            <h2>Profile Picture</h2>
                            <input type="file" name="new_pfp" accept=".jpg, .jpeg, .png" required style='display: none' id="new_pfp" onchange="check_pfp(this.files[0])">
                            <label for="new_pfp" class='upload_file'>Select File</label>
                            <label for="new_pfp" class="upload_file"><img src="<?php echo $pfp ?>" class="img_preview"></label>
                            <?php
                                if (isset($_GET["s"]) && $_GET["s"] == "pfp") echo "<p style='color: lightgreen'>Profile Picture Updated!</p>";
                                if (isset($_GET["e"])) {
                                    if ($_GET["e"] == "pfp_deleteold") echo "<p class='output'>Error Deleting Old File!</p>";
                                    else if ($_GET["e"] == "pfp_move") echo "<p class='output'>Error Uploading File!</p>"; 
                                }
                            ?>
                            <button name="pfp_submit" id="pfp_submit_button" disabled>Submit</button>
                    </form>
                </div>
            <?php
        }
    ?>
    <!--a id='settings_back' href="profiles.php">Go To Users List</a-->
</body>
</html>