<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="float.js"></script>
    <?php include_once '../head.html' ?>
    <meta property="og:title" content="16-Bit Floating Point Calculator">
    <meta property="og:description" content="Calculates the hexadecimal floating point number of a binary float using textbook standard.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/good_boye.jpg">
    <title>Floating Point Calculator</title>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
    ?>
    <h1 style='text-align: center;'>NachoToast's Floating Point Calculator</h1>
    <input id="input_decimal" placeholder="Decimal Input" type="number" autofocus oninput="calculate_float(this.value)">
    <p class='output'></p>
    <p class='output'></p>
    <div style='display: flex'>
        <p style='text-align: center;' class='output'></p>
        <p style='margin-left: 10px; text-align: center;' class='output'></p>
        <p style='margin-left: 10px; text-align: center;' class='output'></p>
        <p style='margin-left: 10px; text-align: center;' class='output'></p>
    </div>
    <p class='output' style='text-align: center;'></p>
    <p class='output' style='font-size: 20px; font-weight: bold;'></p>
    <p style='color: lightcoral; max-width: 80%; display: none'>Disclaimer: I do not condone using online tools such as this website for use in test conditions, exams, and other scenarios where it is not explicitly allowed by exam invigilators. This was made as a simple coding project to help further my knowledge and experience with JavaScript and computer science. This tool is just as accessible, if not less than, other online calculators that can do identical conversions from binary to hexadecimal floats, as well much more.</p>
</body>
</html>