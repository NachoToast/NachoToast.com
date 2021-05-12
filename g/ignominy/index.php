    <?php include_once 'head.html' ?>
    <meta property="og:title" content="NachoToast Ignominy Index Page">
    <meta property="og:description" content="Hub page for the game Ignominy, on the NachoToast website.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/g/ignominy/main.png">
    <title>Ignominy Index</title>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php';
        if (!isset($_SESSION["id"])) {
            ?>
                <div id="signup_notif">
                    <h1 class="noselect">Welcome to the Ignominy Index!</h1>
                    <a href="../../signup.php?o=ignominy" class="noselect">Please <span>register</span> an account to continue!</a>
                    <a href="../../login.php?o=ignominy" class="noselect">Or <span>log in</span> to a preexisting one.</a>
                    <a style='color: gray' href="g/ignominy/p" class="noselect">I'm just here to play the game.</a>
                </div>
            <?php
            exit();
        }
        if (isset($_SESSION["ignominy_id"])) {
            $acctype = "<span style='color: ";
            switch ($_SESSION["ignominy_account_type"]) {
                case 'mdev':
                    $acctype .= "gold'>Main Developer</span>";
                    break;
                case 'writer':
                    $acctype .= "aquamarine'>Writer";
                    break;
                default:
                    $acctype .= "pink'>Default";
                    break;
            }
            $acctype .= "</span>";
            ?>
                <div class='ii_main'>
                    <h1 class='noselect'>Ignominy Index</h1>
                    <a id='play' href='g/ignominy/p'>Play</a>
                    <p>Logged in as: <span style='color: pink'><?php echo $_SESSION["username"] ?><span></p>
                    <p>Account Type: <?php echo $acctype ?></p>
                </div>
                <div id="links">
                    <a href="https://github.com/NachoToast/Ignominy" title="GitHub Repo" target="_blank"><img src="/g/ignominy/play/img/ui/github.png">
                    <a href="https://discord.gg/PEGUcb4" title="Discord Server" target="_blank"><img src="/g/ignominy/play/img/ui/discord.png">
                </div>
            <?php
        }
    ?>
    <!--h1 style='margin-bottom: 5px; text-align: center' class='noselect'>Ignominy Hub</h1-->
    <script defer>document.body.addEventListener("keypress", function(e) {if (e.key == "Enter") document.getElementById("play").click()})</script>
</body>
</html>