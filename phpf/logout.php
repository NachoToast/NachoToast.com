<?php
session_start();
session_unset();
session_destroy();
if (isset($_GET["o"]) && $_GET["o"] == "ignominy") header("location: ../g/ignominy/index.php?s=logout");
else header("location: ../index.php?s=logout");
exit();