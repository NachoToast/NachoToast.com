    <?php include_once '../head.html' ?>
    <meta property="og:title" content="Katie's Book Reviews">
    <meta property="og:description" content="It is what it is.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Book Reviews</title>
    <style>
        .review_container {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            width: clamp(300px, 90%, 1440px);
        }
        .review_container > a {
            border: solid 1px darkslategray;
            transition: border 0.3s linear;
            transition: background-color 0.1s linear;
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            margin: 15px 0px;
            padding: 0 10px;
            cursor: pointer;
        }
        .review_container > a > h1 {
            transition: color 0.1s linear;
        }
        .review_container > a > p {
            font-style: italic;
            color: gray;
            margin: 5px 0;
        }
        .review_container > a:hover {
            background-color: #333;
            border: solid 1px gray;
        }
        .review_container > a:hover > h1 {
            color: pink;
        }
    </style>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
    ?>
    <h2 class='noselect' style='font-weight: lighter; font-size: 30px;'>Katie's Book Reviews</h2>
    <div class="review_container">
        <a href="kbr/alastair_carstairs">
            <h1>Alastair Carstairs Character Review</h1>
            <i>What broke your heart and let such bitterness spill out?</i>
            <p>Chain of Gold by Cassandra Clare</p>
        </a>
        <a>
            <h1>Alastair Carstairs Character Review</h1>
            <i>What broke your heart and let such bitterness spill out?</i>
            <p>Chain of Gold by Cassandra Clare</p>
        </a>
    </div>
</body>
</html>