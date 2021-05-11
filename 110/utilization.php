<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="util.js"></script>
    <?php include_once '../head.html' ?>
    <meta property="og:title" content="% Processor Utilization Calculator">
    <meta property="og:description" content="Calculates the number of programs needed to be kept in memory to attain a specified % processor utilization.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/good_boye.jpg">
    <title>Utilization Calculator</title>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
    ?>
    <h1 style='text-align: center;'>NachoToast's Processor Utilization Calculator</h1>
    <input id="input_util" type="number" placeholder="% Utilization" min="1" max="100" style="width: 150px; margin-bottom: 10px; font-size: 20px;" autofocus oninput="calculate()">
    <input id="input_waittime" type="number" placeholder="% Wait Time" min="1" max="100" style="width: 150px; font-size: 20px;" oninput="calculate()">
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='text-align: center;'></p>
    <p style='color: lightcoral; max-width: 80%; display: none'>Disclaimer: I do not condone using online tools such as this website for use in test conditions, exams, and other scenarios where it is not explicitly allowed by exam invigilators. This was made as a simple coding project to help further my knowledge and experience with JavaScript and computer science.</p>
</body>
</html>