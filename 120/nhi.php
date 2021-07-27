<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="nhi.js"></script>
    <?php include_once '../head.html' ?>
    <meta property="og:title" content="NHI Number Checker">
    <meta property="og:description" content="Calculates and checks final digit of an NHI number.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/good_boye.jpg">
    <title>NHI Calculator</title>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
    ?>
    <h1 style='text-align: center;'>NachoToast's NHI Number Calculator</h1>
    <div style='display: flex; flex-flow: column nowrap; align-items: center;'>
        <p style='text-align: center'>Input NHI Number</p>
        <input id="input_nhi" minlength="6" maxlength="7" style="width: 200px; margin-bottom: 10px; font-size: 20px;" autofocus oninput="calculate_nhi(this.value)" placeholder="ABC0123">
    </div>
    <p class='output'></p>
    <p class='output'></p>
</body>
</html>