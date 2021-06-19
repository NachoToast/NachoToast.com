  <script defer src='index.js'></script>
  <link rel="stylesheet" href='index.css' type='text/css'>
  <?php include_once '../head.html' ?>
  <meta property='og:title' content='Monkey API'>
  <meta property='og:description' content='Monkey image API for the NachoToast website.'>
  <meta property='og:site_name' content='NachoToast'>
  <meta property='og:image' content='https://www.nachotoast.com/img/main.png'>
  <title>Monkey</title>
</head>
<body>
  <?php
    session_start();
    include_once '../header.php';

    // verify mode option
    include_once 'verified_users.php';
    if (isset($_SESSION["id"]) && in_array($_SESSION['id'], $verifiedUsers, true)) {
      echo '<script> const verifyPossible = true</script>';
    } else {
      echo '<script>const verifyPossible = false</script>';
    }
  ?>
    <h1>Monkey API</h1>
    <div id='outputMonkey'>
      <img id='outputMonkeyImage' class='noselect'>
      <p id='outputMonkeyMeta'></p>
      <div id='verify' style='display: none'>
        <input type='checkbox' id='verifyingMonkeys'>
        <label for='verifyingMonkeys' class='noselect'><u>V</u>erification Mode</label>
      </div>
    </div>
  <form method='POST' id='uploadMonkeyForm' enctype='multipart/form-data'>
    <input type='file' id='uploadMonkeyInput' accept='.png, .jpg' multiple name='monkeyFiles[]'>
    <label for='uploadMonkeyInput' id='uploadMonkeyLabel' class='noselect'>Upload Monkeys</label>
  </form>
  <div id='uploadMonkeyOutput' style='display: none' class='special_scroll'>
  </div>
</body>
</html>