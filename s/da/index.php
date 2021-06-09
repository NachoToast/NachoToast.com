    <script defer src="script.js"></script>
    <link href="stylesheet.css" rel="stylesheet" type="text/css">
    <?php include_once '../../head.html' ?>
    <meta property="og:title" content="Dijkstra's Shortest-Path Algorithm">
    <meta property="og:description" content="Finds shortest route from an input node to every other node by traversing shortest distances/weights on neighbouring or unvisited nodes.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif">
    <title>Dijkstra</title>
</head>
<body>
    <?php include_once '../../header.php' ?>
    <h1>Dijkstra's Shortest-Path Algorithm</h1>
    <div class='input_area'>
        <textarea placeholder='List of nodes (whitespace separated).' autofocus id='rawNodes' oninput='inRawNodes()'></textarea>
        <textarea placeholder='Adjacency matrix, comma or enter-separated rows, space or tab separated columns, header rows and columns will be ignored.' id='rawAdj' oninput='inMatrix()'></textarea>
    </div>
    <div class='input_area'>
        <input placeholder="Source Node" id='rawSource' oninput='inSourceTarget()'>
            <input placeholder="Target Node" id='rawTarget' oninput='inSourceTarget()'>
            <label for='rawAdjType'>Input Format:</label>
        <select id='rawAdjType' oninput='inFormatType()'>
            <option value='auto'>Auto</option>
            <option value='adjMat'>Adjacency Matrix</option>
            <option value='array'>Array</option>
            <option value='auto0' disabled>auto (Adjacency Matrix)</option>
            <option value='auto1' disabled>auto (Array)</option>
        </select>
    </div>
    <div class='output_area'>
        <p id='adjTypeOut' class='output_reveal noselect'>Adjacency Matrix <span class='output_option' onclick='toggleAdjMatVisibility(this)'>(Hide)</span></p>
        <table id='outputAdjMat' class='output_reveal'>
        </table>
    </div>
    <div id='output_route'>
        <p id='outputPath' class='output_reveal'></p>
        <p id='outputPathMeta' style='font-size: 16px; color: gray' class='output_reveal'></p>
        <table id='outputTable' class='output_reveal'>
        </table>
        <p style='color: gray; font-size: 16px; margin: 10px 0;' id='outputMeta' class='output_reveal'></p>
    </div>
    <p class='extra_info'>
        Console Commands:<br>
        Set max visits allowed with 'maxAttempts = x' (Default 100)<br>
        Use preset inputs with 'test.inputName', e.g. 'test.wikipedia()'
    </p>
    <?php
        if (isset($_GET["m"])) {
            echo "<script> const doNext = " . json_encode(htmlspecialchars($_GET["m"])) . "</script>";
        }
    ?>
</body>
</html>