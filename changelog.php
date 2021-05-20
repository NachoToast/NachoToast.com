    <?php include_once 'head.html' ?>
    <script defer src="js/changelog.js"></script>
    <link href="css/changelog.css" rel="stylesheet" type="text/css">
    <meta property="og:title" content="NachoToast Website Changelog">
    <meta property="og:description" content="Complete changelog for the NachoToast website.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Changelog</title>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php';
    ?>
    <h1 class='noselect'>Changelog</h1>
    <button onclick='toggle_feed_type(this)' autofocus>Website Log</button>
    <!-- to do: add config options (page, per page, oldest) -->
    <div id="changelog_container">
        <div id="17">
            <h4>10/05/2021</h4>
            <ul>
                <li>Added <a href="110/utilization">utilization page</a> to 110 directory.</li>
            </ul>
        </div>
        <div id=16>
            <h4>8/05/2021</h4>
            <ul>
                <li>Yet another website overhaul, this one cleans up UI, laggy pages, and ugly looking profiles; most pages removed.</li>
                <li>Small changes to backend database structure.</li>
                <li>Improved responsiveness of sign up page.</li>
                <li>Made various account customization options more accessible and visually appealing.</li>
                <li>Added 110 project directory, currently only has 2 items, <a href="110/float">floating point calculator</a> and <a href="110/links">links board</a>.</li>
                <li>Massively improved <a href="profiles.php">users</a> page and its search functions.</li>
                <li>Added changelog page and GitHub respository (may be private in future).</li>
                <li>Added unique meta tags to all page heads (global meta tags are done automatically).</li>
                <li>Header is now <span style="color: aquamarine; position: sticky; top: 100px; margin-top: 115px">sticky</span>, might add an option to customize this in the future (Edit: Now an opt-in, will be disabled by default).</li>
            </ul>
        </div>
        <div id=15>
            <h4>1/03/2021</h4>
            <ul>
                <li>Fixed border removal function for user cards at end of row, should now correctly identify and remove excess borders. Was not accounting for scrollbar width previously which resulted in no detection on computers.</li>
                <li>Increased bottom padding on users page from 20 to 80px, so the reCAPTCHA icon won't block the last user card anymore.</li>
                <li>Added a "Not Found" return message to search function, and added function to make container right height to keep users page looking consistent no matter the result body height. Users page is now fully complete.</li>
                <li>Updated the outdated Minecraft information in the about page > software section.</li>
                <li>Re-added profile picture changes, available for all logged-in users in the settings page (accessible through your profile page), this time with sanitized inputs and dynamic feedback (currently only for file size too large and success).</li>
                <li>Added profile description changing back, now with sanitized inputs, and feedback functions that detect whitespace, invalid lengths, and HTML tags (which are converted into their corresponding HTML entity).</li>
                <li>Update user descriptions on the profile and users pages to use the 'htmlspecialchars' function (the settings page does this already for user descriptions). This means that embedding pictures, HTML elements, and scripts is no longer possible.</li>
            <ul>
        </div>
        <div id=14>
            <h4>28/02/2021</h4>
            <ul>
                <li>Removed application/json content type header from captcha verification function since it breaks if requested by a php script running in the background (such as through users page, but not sign up page), all captcha-related functions should still work however.</li>
                <li>Overhauled users page, adding in features such as max users displayed per page, pages, and an improved UI for sorting and searching functions. All of the aformentioned now occur on the server-end, and because of this a reCAPTCHA (v3) has been added and you must be logged in to use the functions. This is still a slight WIP, as some slight modification needs to be done front-end/style wise, but otherwise is a pretty complete overhaul. Levenshtein distance is no longer used in the 'Near Match' search option, instead opting for MySQL's built in % tags to search for the inputted string as a substring along the existing usernames.</li>
            <ul>
        </div>
        <div id=13>
            <h4>27/02/2021</h4>
            <ul>
                <li>Re-enabled sign up page, with reCAPTCHA v3 standard checking for each sign up.</li>
                <li>Further code optimizations to the dynamic feedback messages on the sign up page, should hopefully have fixed all infinite loading bugs, and reCAPTCHA feedback messages have also been added, such as failing (score < 0.5), expiration (2 minutes), and unknown.</li>
                <li>The last username changed for newly registered accounts is now the register date, and all existing accounts have had this updated to their register date as well, no more 51+ years since last change username change.</li>
                <li>Added link target hightlighting to changelog page, will eventually role this out to other pages, <a href="changelog#6">here's an example.</a></li>
                <li>Started overhaul of users page, currently is just search parameter buttons with javascript behind to make select options highlight and un-highlight other mutually exclusive or inclusive options.</li>
            <ul>
        </div>
        <div id=12>
            <h4>26/02/2021</h4>
            <ul>
                <li>Added mc page for Discord redirect (shorter than the "shortened" Discord invite URL).</li>
                <li>Temporarily disabled sign up due to a large number (~9.8k) of accounts being automatically generated in an attempt to "stress test" the website. Will start working on overhauling the search functions of the users page so that only a certain number of users are shown on each page, and a captcha will also be added to the sign up page in the near future.</li>
            <ul>
        </div>
        <div id=11>
            <h4>25/02/2021</h4>
            <ul>
                <li>Started overhaul of settings page, it's menu has been redesigned completely. Currently only partially-done function is change password, which has dynamic feedback set up upon input, showing strength of password (5-16) and match result.</li>
                <li>Further refinements to time (PHP) function, now only shows "yesterday" if time difference is greater than 23.5 hours and less than or equal to 24, as opposed to the previous less than 1.5 days. There are still a few errors surrounding the day rounding that I haven't been able to fix yet but it's accurate 99% of the time (and more so at dates further away).</li>
                <li>Added format entry to changelog.</li>
                <li>Added dropdown functionality to settings menu cards.</li>
                <li>Miscellaneous bug fixes and code tidying in dynamic.php and signup and login script files.</li>
                <li>Added username change options to settings page as well as accompanying database values and feedback messages. Currently you can only change your username once every 30 days.</li>
            <ul>
        </div>
        <div id=10>
            <h4>24/02/2021</h4>
            <ul>
                <li>Added dynamic feedback to sign up page, and input sanitization to sign up and log in pages. Successful log in and sign up notifications have also been added to the index upon redirect.</li>
                <li>Overhauled signing up and logging in functions to be more intuitive and optimized, and header inclusion system for neater file management.</li>
                <li>Archived redundant messaging, log in, sign up, and index functions and cleaned up pointers to them.</li>
                <li>Fixed cursor bug on log in page button and added visual feedback to wrong passwords and empty inputs.</li>
                <li>Miscellaneous code cleanup on quite a few pages, and started implementing version numbering on said pages.</li>
                <li>Added autofocus and enter keypress submit to the username search box/text area on the users page, and removed minimum length requirements. Profile cards now link to the respective profile page of the user upon hovering and clicking the card's username header.</li>
                <li>Added missing logout message to index page. Added "user not found" and "log in to do this action" notification messages to index, currently utilized by profile page and settings page.</li>
            <ul>
        </div>
        <div id=9>
            <h4>23/02/2021</h4>
            <ul>
                <li>Moved changelog to seperate page as dynamically adjusting the div height for the changelog so that the columns wrap correctly is more effort than it's worth. Changelog is now one long column and so to prevent the about page from being unnecessarily long and empty, it has been moved to its own page.</li>
                <li>Changelogs are going to be much more verbose now so it looks like I'm actually doing work on the website, and it also makes the page look less desolate.</li>
                <li>Added users page, complete with its own searching functions, currently there are 5. Random sorts randomly through Math.rand(), online sorts by when the user was last online, and registered sorts by when the user made their account. Ascending and descending options are also available for applicable search functions. Username searching by string comparison is done using standardized Levenshtein distance (edit distance) and is only shown in descending order.</li>
                <li>Improved time function, now declares $now=time() when called, so individual pages no longer need to declare $now=time() before calling it.</li>
                <li>Disabled global chat due to security vulnerabilities, thank you David for pointing this out. Will most likely not re-enable this due to excessive database querying when getting and checking for messages.</li>
                <li>Fixed sign up bug where username always returned as invalid.</li>
                <li>Fixed redundant CSS formatting for hardware div children on the about page.</li>
                <li>Fixed missing users bug on users page, thank you Pavitra for pointing this out. Turns out the profile-card-generating loop stopped after reaching the number of elements in the profile (7), instead of the number of profiles.</li>
            <ul>
        </div>
        <div id=8>
            <h4>20/02/2021</h4>
            <ul>
                <li>Added more content to about.php</li>
                <li>Refined time.php function.</li>
                <li>Reduced SQL queries used in getmsg.inc.php, i.e. the main chat message getter.</li>
            <ul>
        </div>
        <div id=7>
            <h4>19/02/2021</h4>
            <ul>
                <li>Added configurable profile descriptions.</li>
                <li>Added option to change password in edit profile menu.</li>
                <li>Fixed various bugs with global chat.</li>
            <ul>
        </div>
        <div id=6>
            <h4>18/02/2021</h4>
            <ul>
                <li>Added profiles.</li>
                <li>Added configurable profile pictures.</li>
                <li>Added active users element.</li>
            <ul>
        </div>
        <div id=5>
            <h4>17/02/2021</h4>
            <ul>
                <li>Added 'nachotoast.com' domain name.</li>
                <li>Re-added SSL certificate and HTTP redirects.</li>
            <ul>
        </div>
        <div id=4>
            <h4>14/02/2021</h4>
            <ul>
                <li>Overhauled site from html based to php.</li>
            <ul>
        </div>
        <div id=3>
            <h4>11/02/2021</h4>
            <ul>
                <li>Set up SSL certificate.</li>
                <li>Updated cookie clicker game & added link from index.</li>
                <li>Added font webkit.</li>
            <ul>
        </div>
        <div id=2>
            <h4>25/01/2021</h4>
            <ul>
                <li>Added register page, this is still a WIP.</li>
                <li>Updated image source file paths for old hardware page due to unknown bug, this is not permanent as the page will soon be deprecated.</li>
                <li>Added obama page.</li>
                <li>Changed changelog filename (changelog.html > changes.html) due to unknown bug, this is a temporary fix.</li>
                <li>Fixed link colors on top-bar.</li>
            <ul>
        </div>
        <div id=1>
            <h4>24/01/2021</h4>
            <ul>
                <li>Added 404 page.</li>
                <li>Fixed missing server logo hyperlink on the 'server hardware' page.</li>
                <li>Fixed background cut-off on the changelog page.</li>
            <ul>
        </div>
        <div id=0>
            <h4>23/01/2021</h4>
            <ul>
                <li>Improved link pathways for index.</li>
                <li>Added changelog page.</li>
                <li>Added links to Github.</li>
                <li>Implemented top navigation bar for all non-index pages.</li>
                <li>Hyperlinked top-left server logo.</li>
                <li>Entirely overhauled index page.</li>
                <li>Improved link pathways for server hardware page.</li>
            <ul>
        </div>
    </div>
    <div id="changelog_container_2">

    </div>
</body>
</html>