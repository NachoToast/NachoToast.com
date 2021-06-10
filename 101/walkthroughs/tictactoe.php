    <link rel="stylesheet" href="../solarized-dark.css" type="text/css">
    <script src="../highlight.pack.js"></script>
    <script>hljs.highlightAll();</script>
    <link href="../stylesheet.css" rel="stylesheet" type="text/css">
    <?php include_once '../../head.html'; ?>
    <meta property="og:title" content="CompSci101 Question Walkthrough">
    <meta property="og:description" content="Tic Tac Toe question from 2020 S1 Test2/Exam Coding Questions (Revision Purpose) Q12.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Tic Tac Toe</title>
    <style>     
        .hljs {
            background: unset;
            color: white;
            font-size: 16px;
            margin: 0;
        }
        pre, code {
            margin: 0;
        }
        .eq {
            color: aquamarine;
        }
        #back {
            color: aquamarine;
            cursor: pointer;
            margin: 20px 0;
            transition: color 0.1s linear;
        }
        #back:hover {
            text-decoration: underline 1px;
            color: pink;
        }
        #question {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            width: clamp(300px, 90%, 1024px);
        }
        #question > img {
            max-width: 100%;
        }
        #question > p {
            line-height: 22px;
            width: 100%;
        }
        #question > pre {
            border: solid 1px transparent;
            transition: border 0.3s linear;
            transition: background-color 0.1s linear;
            width: 100%;
        }
        #question > pre:hover {
            border: solid 1px gray;
            background-color: #333;
        }
    </style>
</head>
<body>
    <?php include_once '../../header.php'; ?>
    <div id='question'>
        <p>First of all lets get the 0-based index of the position, the board is a list which means it has 0-based indexing, so the position should as well.</p>
        <pre><code class='python'>
        def player_turn(board, position, player):
            position -= 1 # 0-based index
        </code></pre>
        <p>The board contains a list of rows, and the position should tell us which row we need to edit, lets have a look at which position value corresponds to each row:</p>
        <img src="/101/walkthroughs/tictactoe_figure_1.png">
        <p>Drawing out a table like this helps us see a pattern, in this case we can say that <span class='eq'>row = position // 3</span>.</p>
        <pre><code class='python'>
        def player_turn(board, position, player):
            position -= 1 # 0-based index
            row_pos = position // 3
        </code></pre>
        <p>Next is the column, again lets draw up a table:</p>
        <img src="/101/walkthroughs/tictactoe_figure_2.png">
        <p>Similar to the row table before, theres another pattern here, although it is less noticeable. Note how the numbers in column 0 are all exact multiples of 3, and column 1 positions are all 1 above that, this can be extrapolated to <span class='eq'>column = position % 3</span>.</p>
        <pre><code class='python'>
        def player_turn(board, position, player):
            position -= 1 # 0-based index
            row_pos = position // 3
            column_pos = position % 3
        </code></pre>
        <p>Now that we know the row and column to edit, lets check if there's already an 'X' or 'O' there, the question says a '#' is an 'empty' cell so:</p>
        <pre><code class='python'>
        def player_turn(board, position, player):
            position -= 1 # 0-based index
            row_pos = position // 3
            column_pos = position % 3
            if board[row_pos][column_pos] != "#":
                return print("Invalid move, try again.")
        </code></pre>
        <p>Chaining a 'return' and a 'print' statement here is entirely optional, as doing print() and then return is just as valid.<br>Now that we've done that check, we can update the board, no 'else' statement necessary.</p>
        <pre><code class='python'>
        def player_turn(board, position, player):
            position -= 1 # 0-based index
            row_pos = position // 3
            column_pos = position % 3
            if board[row_pos][column_pos] != "#":
                return print("Invalid move, try again.")
            board[row_pos] = board[row_pos][:column_pos] + player + board[row_pos][column_pos + 1:]
        </code></pre>
    </div>
    <a href="101" id="back">Back to 101 Index</a>
</body>
</html>