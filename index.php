<?php include_once 'head.html' ?>
    <meta property="og:title" content="NachoToast Home Page">
    <meta property="og:description" content="Home page for the NachoToast website.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Home</title>
    <style>
        .todolist {
            margin: 0;
            color: gray;
        }

        .todolist_list {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            margin: 10px;
            width: clamp(290px, calc(90% - 20px), 40vw);
        }

        .todolist_list > p {
            width: calc(100% - 30px);
            margin: 0;
            padding: 15px;
            text-align: center;
            transition: color 0.1s linear, background-color 0.1s linear, border 0.3s linear;
            border: solid 1px transparent;
        }

        .todolist_list > p:hover {
            background-color: #333;
            border: solid 1px gray;
        }

        .todolist_list > p.complete:hover {
            text-decoration: underline solid 1px;
            cursor: pointer;
        }

    </style>
</head>
<body>
    <?php
        session_start();
        include_once 'header.php' ;
    ?>
    <h1 style='margin-bottom: 5px; text-align: center'>Welcome to <span style='color: gold'>NachoToast.com</span></h1>
    <p style='margin: 0; color: gray;'>Now with meta!</p>
    <h2 style='margin-bottom: 5px; margin-top: 35px'>Website Roadmap:</h2>
    <p class='todolist'>From highest to lowest priority.</p>
    <div class='todolist_list noselect'>
        <p class="complete"><a href="https://github.com/NachoToast/NachoToast.com" target="_blank">Make GitHub Repo</a></p>
        <p class="complete"><a href="users.php">Users Page</a></p>
        <p class="complete"><a href="changelog">Changelog</a></p>
        <p class='complete'><a href='about'>About Page</a></p>
        <p class='complete'><a href='g/ignominy/'>Ignominy Hub</a></p>
        <p>Online Users</p>
        <p>Chat Forums</p>
        <p>Email Integration</p>
        <p class='complete' title='Landing page will be implemented with tag system below.'>wAPI</a></p>
        <p>Monkey API</p>
        <p>wAPI Tag System</p>
        <p>Improve NachoBot</p>
        <p>Ignominy 0.1.20</p>
    </div>
</body>
</html>