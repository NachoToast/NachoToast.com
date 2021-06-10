    <link rel="stylesheet" href="../solarized-dark.css" type="text/css">
    <script src="../highlight.pack.js"></script>
    <script>hljs.highlightAll();</script>
    <link href="../stylesheet.css" rel="stylesheet" type="text/css">
    <?php include_once '../../head.html'; ?>
    <meta property="og:title" content="CompSci101 Question Walkthrough">
    <meta property="og:description" content="Sudoku question from 2020 S2 Test2/Exam Coding Questions (Revision Purpose) Q12.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Sudoku</title>
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
        <p>When it comes to approaching long, wordy questions like this one, the best thing to do (in my opinion) is to break it into parts and approach each one independently.<br>Lets do exactly that with the three rules provided:</p>
        <p>This Sudoku grid needs to be filled with the digits 1 to 4 such that the following rules are maintained:</p>
            <ol>
                    <li>Each row contains the digits 1 to 4, without any duplicate values.</li>
                    <li>Each column contains the digits 1 to 4, without any duplicate values.</li>
                    <li>Each sub-grid contains the digits 1 to 4, without any duplicate values.</li>
            </ol>
        <p>
        A "hidden" 4th rule is that the row and column inputs cant be < 1 or > 4, since that would be outside of the board, so lets start with that:
        </p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
        </code></pre>
        <p>Now that we know the input row and columns are valid, lets get the 0-based index of them, since the board_list is a list and therefore also has a 0-based index.</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            row -= 1
            column -= 1
        </code></pre>
        <p>Also, the 'value' parameter in this function is an integer, however the values of the board are in string form, so lets convert value to a string for consistency, since we will be doing checks with it later.</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            value = str(value)
            row -= 1
            column -= 1
        </code></pre>
        <p>Now lets start with rule 1, in order for the move to be valid the value cannot already be in the row we are trying to insert into, this is a relatively easy check to do:</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            value = str(value)
            row -= 1
            column -= 1
            if value in board_list[row]: # rule 1
                return print("This move is invalid!")
        </code></pre>
        <p>Now onto rule 2, the same thing but the column, this is a bit trickier since we need to iterate/loop through each row to get a certain column.</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            value = str(value)
            row -= 1
            column -= 1
            if value in board_list[row]: # rule 1
                return print("This move is invalid!")
            for a_row in board_list:
                if value == a_row[column]: # rule 2
                    return print("This move is invalid!")
        </code></pre>
        <p>Now for the hardest bit, the sub-grid. Lets represent the sub-grid as 2 lists, sub_row for the rows and sub_column for the column. Each of these lists will contain the range of indexes of the rows and columns in the sub-grid we are checking. E.g. S1 will have a sub_row of [0, 2] (row 0 and row 1) and a sub_column of [0, 2]; and S2 will have a sub_row of [2, 4] and a sub_column of [0, 2].</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            value = str(value)
            row -= 1
            column -= 1
            if value in board_list[row]: # rule 1
                return print("This move is invalid!")
            for a_row in board_list:
                if value == a_row[column]: # rule 2
                    return print("This move is invalid!")
            # row sub-grid getting
            if row < 2:
                sub_row = [0, 2]
            else:
                sub_row = [2, 4]
            # column sub-grid getting
            if column < 2:
                sub_column = [0, 2]
            else:
                sub_column = [2, 4]
        </code></pre>
        <p>Now we need to check the rows and columns in the sub-grid to see if they contain the value.<br>First we loop through each row in the board_list the range specified in sub_row.</p>
        <pre><code class='python'>
            for a_sub_row in board_list[sub_row[0]:sub_row[1]]:
        </code></pre>
        <p>Then check if the value is within the range of columns specified in sub_column:</p>
        <pre><code class='python'>
            if value in a_sub_row[sub_column[0]:sub_column[1]]:
                return print("This move is invalid!")
        </code></pre>
        <p>If the code reaches past this for loop, the move satisfies all the rules specified, and we can update the board accordingly.</p>
        <pre><code class='python'>
        def perform_move(board_list, row, column, value):
            if row < 1 or column < 1 or row > 4 or column > 4:
                return print("This move is invalid!")
            # get 0-based indexes
            value = str(value)
            row -= 1
            column -= 1
            if value in board_list[row]: # rule 1
                return print("This move is invalid!")
            for a_row in board_list:
                if value == a_row[column]: # rule 2
                    return print("This move is invalid!")
            # row sub-grid getting
            if row < 2:
                sub_row = [0, 2]
            else:
                sub_row = [2, 4]
            # column sub-grid getting
            if column < 2:
                sub_column = [0, 2]
            else:
                sub_column = [2, 4]
            
            for a_sub_row in board_list[sub_row[0]:sub_row[1]]: # rule 3
                if value in a_sub_row[sub_column[0]:sub_column[1]]:
                    return print("This move is invalid!")
            board_list[row] = board_list[row][:column] + value + board_list[row][column + 1:]
        </code></pre>
    </div>
    <a href="101" id="back">Back to 101 Index</a>
</body>
</html>