    <script defer src="colours.js"></script>
    <?php
        include_once '../../head.html';
        $files = 0;
        $max = count(glob('cool/*.png'));
        $chosen = rand(1, $max);
        $cf = "https://ntgc.ddns.net/s/c/cool/$chosen.png";
    ?>
    <meta property="og:title" content="Image Colour Tools">
    <meta property="og:description" content="Upload an image to get information about its colours, and generate a colour palette of variable size. Mobile friendly.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="<?php echo $cf ?>">
    <title>Colour Tools</title>
    <style>
        #canvas {
            max-width: 90vw;
            max-height: 600px;
            margin-top: 10px;
            min-width: 100px;
            min-height: 100px;
            image-rendering: pixelated;
            align-self: center;
            cursor: pointer;
        }
        label {
            margin: 0;
            padding: 0;
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            width: 100%;
        }
        label > h1 {
            text-align: center;
            cursor: pointer;
            transition: color 0.1s linear,background-color 0.1s linear, border 0.3s linear;
            border-top: solid 1px transparent;
            border-bottom: solid 1px transparent;
            margin: 0;
            padding: 20px 0;
            width: 100%;
        }
        label > h1:hover {
            color: pink;
            background-color: #333;
            border-top: solid 1px gray;
            border-bottom: solid 1px gray;
        }
        #output {
            display: flex;
            flex-flow: row wrap;
            width: clamp(305px, 95%, 1000px);
            margin-bottom: 20px;
            justify-content: center;
        }
        #info {
            margin: 0;
            padding: 0;
            color: lightslategrey;
            margin-bottom: 5px;
            text-align: center;
        }
        .colour {
            width: 130px;
            display: flex;
            flex-flow: row wrap;
            border: solid 1px gray;
            padding: 5px;
            transition: background-color 0.1s linear;
            margin: 3px;
        }
        .colour:hover {
            background-color: #333;
        }
        .colour > div {
            display: flex;
            flex-flow: row nowrap;
            margin-right: 5px;
            width: 20px;
            height: 20px;
            background-color: white;
        }
        .colour > p {
            margin: 0;
            padding: 0;
        }
        .colour > p:last-child {
            flex-grow: 1;
            text-align: right;
            color: gray;
        }
        .sort, #output_sort_type {
            cursor: pointer;
            transition: color 0.1s linear;
        }
        .sort:hover, #output_sort_type:hover {
            color: pink;
        }
        #extra_info {
            margin-top: 1px;
            position: absolute;
            align-self: flex-end;
            font-size: 16px;
            color: gray;
            padding-right: 30px;
            display: none;
        }
        #palette_options {
            border-top: solid 1px transparent;
            border-bottom: solid 1px transparent;
            transition: border 0.3s linear, background-color 0.1s linear;
            width: 100%;
            display: none;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
        }
        #palette_options:hover {
            border-top: solid 1px gray;
            border-bottom: solid 1px gray;
            background-color: #333;
        }
        #palette_options:hover #go {
            color: pink;
        }
        #palette_options input {
            background-color: unset;
            border: solid 1px gray;
            font-size: 18px;
            width: 80px;
            color: white;
            transition: background-color 0.1s linear, border 0.3s linear;
        }
        #palette_options input:hover, #palette_options input:focus {
            background-color: #333;
            border: solid 1px lightgreen;
        }
        #palette_options #go {
            cursor: pointer;
            transition: color 0.1s linear;
            outline: none;
        }
        #palette_options #go:hover {
            color: lightgreen;
        }
        #palette_output {
            border-top: solid 1px transparent;
            border-bottom: solid 1px transparent;
            transition: border 0.3s linear, background-color 0.1s linear;
            width: 100%;
            text-align: center;
            padding: 10px 0;
            margin: 0;
            display: none;
        }
        #palette_output:hover {
            border-top: solid 1px gray;
            border-bottom: solid 1px gray;
            background-color: #333;
        }
        #palette {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            margin: 10px 0;
        }
        .p_colour {
            display: flex;
            flex-flow: row wrap;
        }
        .p_colour > div {
            width: 50px;
            height: 50px;
            background-color: white;
            transition: filter 0.1s linear;
        }
        .p_colour > p {
            position: absolute;
            display: none;
            margin: 0;
            height: 50px;
            width: 50px;
            flex-flow: row nowrap;
            text-align: center;
            font-size: 14px;
            align-items: center;
            justify-content: center;
            /*background-color: rgba(0, 0, 0, 0.5);*/
        }
        .p_colour:hover > div {
            /*display: none;*/
            filter: brightness(50%);
        }
        .p_colour:hover > p {
            display: flex;
        }
        #export_options {
            margin: 0;
            font-size: 20px;
            padding: 10px 0;
            border-top: solid 1px transparent;
            border-bottom: solid 1px transparent;
            transition: background-color 0.1s linear, border 0.3s linear;
            width: 100%;
            text-align: center;
            display: none;
        }
        #export_options:hover {
            border-top: solid 1px gray;
            border-bottom: solid 1px gray;
            background-color: #333;
        }
        #export_options > input {
            background-color: unset;
            border: none;
            color: pink;
            font-size: 20px;
            width: 43px;
        }
        #export_options > span {
            transition: color 0.1s linear;
            cursor: pointer;
        }
        #export_options:hover > span {
            color: pink;
        }
        #export_options > span:hover {
            color: lightgreen;
        }
        #palette_export {
            width: 50px;
            height: 50px;
            background-color: white;
            width: 90vw;
            margin: 20px 0 40px 0;
            image-rendering: pixelated;
            display: none;
            max-width: calc(100% - 2px);
        }
    </style>
</head>
<body>
    <?php include_once '../../header.php' ?>
    <input type='file' onchange='upload_image(this.files[0])' accept='.jpg, .jpeg, .png' id='input_image' style='display: none'>
    <label for='input_image' class='noselect'>
        <h1 id='heading'>Upload File</h1>
        <div id='extra_info'>
        Use arrow keys to change<br> page and colours per page.<br>
        Use space to change sort type.<br>
        Enter to generate palette.
        </div>
        <canvas id='canvas' style='display: none'></canvas>
    </label>
    <p id='colour_count' class='noselect' style='display:none; text-align: center; margin-bottom: 0'>0 Unique Colours</p>
    <p id='info' style='display: none' class='noselect'>Page 0 of 0 | Displaying 20 colours per page | Sorting by Default</p>
    <div id="output"></div>
    <div id='palette_options'>
        <p class='noselect'>Generate palette with <input type='number' min="3" oninput='palette_colours = parseInt(this.value)' id='palette_input' class='stop_ar'> colours sorted by <span class='noselect' id='output_sort_type' onclick='change_sort_type()'>Default</span>. <span id='go' onclick='generate_palette()'>Go</span></p>
    </div>
    <p id='palette_output'>Loading Palette: Initializing Load (0s)</p>
    <div id='palette'>
    </div>
    <p id='export_options' class='noselect'>Export as <input type='number' value='1' oninput="change_export_dimensions(this)" class='stop_ar'> x <input type='number' value='1' oninput="change_export_dimensions(this, 1)" class='stop_ar'> png: <span onclick='export_palette_to_png()'>Go</span></p>
    <canvas id='palette_export' width="50" height="50"></canvas>
</body>
</html>