<?php
  /// verification
  require_once 'secret.php';
  session_start();
  // logged in
  if (!isset($_SESSION["id"])) {
    echo 'Please log in to do this.';
    exit();
  }
  // allowed user
  if (!in_array($_SESSION["id"], $ALLOWED_USERS, true)) {
    echo 'You lack to authorization to do this.';
    exit();
  }


?>
  <script defer src='manage.js'></script>
  <link href='manage.css' rel='stylesheet' type='text/css'>
  <?php include_once '../head.html' ?>
  <meta property="og:title" content="MC Server Manager">
  <meta property="og:description" content="Page for managing backend aspects of Minecraft server, such as whitelist application forms.">
  <meta property="og:site_name" content="NachoToast">
  <meta property="og:image" content="/s/c/cool/14.png">
  <title>Manage</title>
</head>
<body>
  <?php include_once '../header.php' ?>
  <h1>Server Management</h1>
  <?php
  {
    require_once 'rcon.class.php';

    $rcon = new Rcon($RCON_HOST, $RCON_PORT, $RCON_PASSWORD, $RCON_TIMEOUT);

    if ($rcon -> connect()) {
      $tps = str_replace(['§a', '§6'], '', $rcon -> sendCommand('tps'));
    }
  }  
  ?>
  <div>
    <div id='serverMeta'>
      <p>Server Online</p>
      <p><?php echo $tps ?></p>
      <p>10 Players Online</p>
      <ul class='special_scroll'>
        <li>NachoToast</li>
        <li>ToastNacho</li>
        <li>NachoToast</li>
        <li>ToastNacho</li>
        <li>NachoToast</li>
        <li>ToastNacho</li>
        <li>NachoToast</li>
        <li>ToastNacho</li>
      </ul>
    </div>
    <div id='whitelistManager'>
      <h2>Manage Whitelist</h2>
      <p>Page <input type='number' id='page' value="0"> of <span id='maxPage'>4</span>, showing <select id='perPage'>
        <option value='10'>10</option>
        <option value='20' selected>20</option>
        <option value='50'>50</option>
      </select>results per page.</p>
      <label for='statusSelect'>Showing </label>
      <select id='statusSelect' name='status'>
        <option value='pendingWhitelistApplication'>pending whitelist applications</option>
        <option value='approvedWhitelistApplication'>approved whitelist applications</option>
        <option value='rejectedWhitelistApplication'>rejected whitelist applications</option>
        <option value='other'>other applications</option>
      </select>
      <table id='whitelistTable'>
      </table>
    </div>
  </div>
  <div id='queue'>
    <h2 id='queueHeader'>Queue (2)</h2>
    <div id='queueList'>
      <p>Whitelist add: NachoToast</p>
      <p>Whitelist remove: NachoToast</p>
    </div>
    <button id='queueGo'>Process Queue</button>
  </div>
</body>
</html>