<div id="header">
    <a href="" class='noselect'>Home</a>

    <?php
        if (isset($_SESSION["id"])) {
            echo "<a class='noselect' href='g/ignominy'>Index</a>";
            $sm = "";
            if (!isset($_SESSION["ignominy_id"])) include_once "../../inc/g/ignominy/signup_login.inc.php";
            //echo "<a href='g/ignominy/play' class='noselect'>Play</a>";
            if ($_SESSION["ignominy_account_type"] == "writer" || $_SESSION["ignominy_account_type"] == "mdev") echo "<a class='noselect' href='g/ignominy/w'>Writers Hub</a>";
            //echo "<a class='noselect'>" . $_SESSION["username"] . "</a>";
            if (isset($_GET["s"]) && $_GET["s"] == "signup") echo "<a class='n g' onclick='this.style.display = `none`'>Sign up successful!</a>";
            else if ($sm == "l") echo "<a class='n a' onclick='this.style.display = `none`'>Ignominy login success!</a>";
            else if ($sm == "s") echo "<a class='n a' onclick='this.style.display = `none`'>Ignominy account created!</a>";
        }
        else if (isset($_GET["s"]) && $_GET["s"] == "logout") echo "<a class='n g' onclick='this.style.display = `none`'>Log out successful!</a>";
        else if (isset($_GET["e"]) && $_GET["e"] == "noaccess") echo "<a class='n r' onclick='this.style.display = `none`'>You don't have access to this resource!</a>";
    ?>
</div>