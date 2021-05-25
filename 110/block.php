<!DOCTYPE html>
<html lang="en">
<head>
    <script defer src="block.js"></script>
    <?php include_once '../head.html' ?>
    <meta property="og:title" content="Block Cipher Decoder">
    <meta property="og:description" content="Decodes text via block cipher.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/good_boye.jpg">
    <title>Block Decoder</title>
    <style>
        #container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
        }
        #container > p {
            text-align: center;
        }
    </style>
</head>
<body>
    <?php
        session_start();
        include_once '../header.php';
    ?>
    <h1 style='text-align: center;'>NachoToast's Block Cipher Decoder</h1>
    <div style='display: flex; flex-flow: column nowrap; align-items: center;'>
        <p style='text-align: center'>Input a 2x2 matrix, seperate numbers with spaces.</p>
        <input id="input_matrix" placeholder="Input Matrix" min="1" max="100" style="width: 200px; margin-bottom: 10px; font-size: 20px;" autofocus oninput="dothing()">
        <input id="input_string" placeholder="Input String" style="width: 200px; margin-bottom: 10px; font-size: 20px;" autofocus oninput="dothing()">
        <div>
        <input type="checkbox" id="mode" oninput="encode = this.checked; dothing()">
        <label for="mode">Encode</label>
        <input type="checkbox" id="mode2" oninput="zero_index = this.checked; dothing()" checked>
        <label for="mode2">Zero Index</label>
        </div>
    </div>
    <p class='output'></p>
    <p class='output'></p>
    <p class='output'></p>
    <p class='output'></p>
    <p class='output'></p>
</body>
</html>