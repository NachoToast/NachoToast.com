<div id="header">
    <a href="" class='noselect'>Home</a>

    <?php
        if (isset($_GET["s"])) {
            if ($_GET["s"] == "signup") echo "<a class='n g' onclick='this.style.display = `none`'>Sign up successful!</a>";
            //else if ($_GET["s"] == "login") echo "<a class='n g' onclick='this.style.display = `none`'>Log in successful!</a>"; redundant
        }
        if (isset($_SESSION["id"])) {
            echo "<a class='noselect' href='g/ignominy'>Index</a>";
            if ($_SESSION["ignominy_account_type"] == "writer" || $_SESSION["ignominy_account_type"] == "mdev") echo "<a class='noselect' href='g/ignominy/w'>Writers Hub</a>";
            //echo "<a href='g/ignominy/play' class='noselect'>Play</a>";
            if (!isset($_SESSION["ignominy_id"])) include_once "../../inc/g/ignominy/signup_login.inc.php";
            //echo "<a class='noselect'>" . $_SESSION["username"] . "</a>";
        }
    ?>
</div>