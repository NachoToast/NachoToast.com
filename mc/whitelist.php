  <?php
    if (!isset($_GET['success'])) {
      echo '<script defer src=\'whitelist.js\'></script>';
      echo '<script defer src=\'https://www.google.com/recaptcha/api.js\'></script>';
    }
  ?>
  <link href='whitelist.css' rel='stylesheet' type='text/css'>
  <?php include_once '../head.html' ?>
  <meta property="og:title" content="MC Whitelist Form">
  <meta property="og:description" content="Whitelist application form for NachoToast's Minecraft server.">
  <meta property="og:site_name" content="NachoToast">
  <meta property="og:image" content="/s/c/cool/7.png">
  <title>Whitelist</title>
</head>
<body>
  <?php
    include_once '../header.php';
    if (isset($_GET['success'])) {
      echo '<h1 style=\'color: lightgreen\'>Success!</h1>';
      echo '<p style=\'color: rgb(255, 238, 139); font-size: 18px\'>Your whitelist application has been successfully uploaded, all you need to do now is wait!</p>';
      exit();
    }
  ?>
  <h1>Whitelist Application Form</h1>
  <?php
    if (!isset($_GET['d'])) {
      echo '<p>Couldn\'t get your Discord ID, were you linked by NachoBot?</p>';
    }
  ?>
  <form id='mainForm' method='post' action='inc/mc/whitelist.inc.php'>
    <div class='short'>
      <div>
        <input name='discordID' placeholder='e.g. 240312568273436674' required id='discordID' maxlength="18" minlength="17" <?php
          if (isset($_GET['d'])) {
            echo 'disabled';
            echo ' value = \'' . htmlspecialchars($_GET['d']) . '\'';
          }
        ?>>
      </div>
      <label for='discordID' id='discordIDL'>Discord ID</label>
    </div>
    <div class='short'>
      <div>
        <input name='mcUsername' placeholder='e.g. NachoToast' required id='mcUsername' maxlength="16" minlength="1" autofocus>
      </div>
      <label for='mcUsername' id='mcUsernameL'>Minecraft Username</label>
    </div>
    <div class='short'>
      <div>
        <input name='email' required id='email' maxlength="128" minlength="5" placeholder='e.g. nacho@toast.com'>
      </div>
      <label for='email' id='emailL'>Email</label>
    </div>
    <div class='medium'>
      <input type='checkbox' id='mcVersion' name='mcVersion' value='true' checked>
      <label for='mcVersion' class='noselect'>I Have Java Edition</label>
    </div>
    <div class='medium'>
      <input type='checkbox' name='mcCaves' value='true' checked id='mcCaves'>
      <label for='mcCaves' class='noselect'>I Want 1.18 Cave Generation</label>
    </div>
    <div>
      <p>How would you feel about the inclusion of the <a href='https://www.planetminecraft.com/data-pack/incendium-nether-expansion/' target='_blank'>Incendium</a> datapack? A complete overhaul of the nether which adds new structures, biomes, mobs, boss fights, and weapons.</p>
      <div>
        <label for='opinionIncendium'>Strongly Against</label>
        <input type='range' name='opinionIncendium' min="1" max="5" step="1" id='opinionIncendium'>
        <label for='opinionIncendium'>Strongly For</label>
      </div>
    </div>
    <div>
      <p>How would you feel about the inclusion of slightly less-than-vanilla mechanics, such as bows with mending and infinity, armour that increases health/other attributes, spellcasting, and/or custom crafting?</p>
      <div>
        <label for='opinionExtras'>Strongly Against</label>
        <input type='range' name='opinionExtras' min="1" max="5" step="1" id='opinionExtras'>
        <label for='opinionExtras'>Strongly For</label>
      </div>
    </div>
    <div>
      <p>If you played on the previous server, what do you think could have been improved or changed?</p>
      <textarea name='opinionPrevBad' placeholder='255 Words Max' maxlength="255"></textarea>
    </div>
    <div>
      <p>If you played on the previous server, what features did you like?</p>
      <textarea name='opinionPrevGood' placeholder='255 Words Max' maxlength="255"></textarea>
    </div>
    <div class='medium medium2'>
      <p>Should we have 'game nights', where NachoToast or another admin hosts events and minigames such as hunger games, bed wars, pvp tournaments, etc.</p>
      <input name='gameNight' type='radio' value='0' id='gameNight0'>
      <label for='gameNight0' class='noselect'>No</label>
      <input name='gameNight' type='radio' value='1' id='gameNight1'>
      <label for='gameNight1' class='noselect'>Yes</label>
      <input name='gameNight' type='radio' value='2' id='gameNight2' checked>
      <label for='gameNight2' class='noselect'>Neutral</label>
    </div>
    <div class='medium medium2'>
      <p>Do you think griefing and stealing should be allowed on the new server?</p>
      <input name='griefing' type='radio' value='0' id='griefing0' checked>
      <label for='griefing0' class='noselect'>No</label>
      <input name='griefing' type='radio' value='1' id='griefing1'>
      <label for='griefing1' class='noselect'>Yes</label>
      <input name='griefing' type='radio' value='2' id='griefing2'>
      <label for='griefing2' class='noselect'>It should be opt-in</label>
    </div>
    <div class='medium medium2'>
      <p>Do you think pvping should be allowed on the new server?</p>
      <input name='pvp' type='radio' value='0' id='pvp0' checked>
      <label for='pvp0' class='noselect'>No</label>
      <input name='pvp' type='radio' value='1' id='pvp1'>
      <label for='pvp1' class='noselect'>Yes</label>
      <input name='pvp' type='radio' value='2' id='pvp2'>
      <label for='pvp2' class='noselect'>In an designated area only</label>
    </div>
    <div class='medium medium2'>
      <p>Do you think faculty roles (e.g. science, arts, engineering) are a good idea?</p>
      <input name='faculty' type='radio' value='0' id='faculty0' checked>
      <label for='faculty0' class='noselect'>No</label>
      <input name='faculty' type='radio' value='1' id='faculty1'>
      <label for='faculty1' class='noselect'>Yes</label>
      <input name='faculty' type='radio' value='2' id='faculty2'>
      <label for='faculty2' class='noselect'>Yes, but only for large events</label>
    </div>
    <div>
      <p>What kind of rules or other suggestions do you have for the server?</p>
      <textarea name='other' placeholder='255 Words Max' maxlength="255"></textarea>
    </div>
    <div>
      <p>How cool is NachoToast?</p>
      <div>
        <label for='opinionNacho'>Not Cool</label>
        <input type='range' name='opinionNacho' min="0" max="9" step="1" id='opinionNacho' value='5'>
        <label for='opinionNacho'>Very Cool</label>
      </div>
    </div>
    <div>
      <button type="submit" id="submitForm" disabled class="g-recaptcha" data-sitekey="6LcmnGkaAAAAAK1xje2-NrSsgCQUsd7y-woMPTgs" data-callback="doSubmit" data-action="submit" style='display: none'>Submit</button>
    </div>
  </form>
</body>
</html>