    <link rel="stylesheet" href="../solarized-dark.css" type="text/css">
    <script src="../highlight.pack.js"></script>
    <script>hljs.highlightAll();</script>
    <link href="../stylesheet.css" rel="stylesheet" type="text/css">
    <?php include_once '../../head.html'; ?>
    <meta property="og:title" content="CompSci101 Question Walkthrough">
    <meta property="og:description" content="Lab 9 Question 6: Drawing a pyramid.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/101/walkthroughs/lab_9_question_6_figure_2.png">
    <title>Lab 9 Question 6</title>
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
            margin-top: 20px;
            transition: color 0.1s linear;
        }
        #back:hover {
            text-decoration: underline 1px;
            color: pink;
        }
    </style>
</head>
<body>
    <?php include_once '../../header.php'; ?>
    <p>First of all lets break down the pyramid into rows and record the row number.</p>
    <img src="/101/walkthroughs/lab_9_question_6_figure_1.png">
    <p>We're going to need a 'for' loop to go through each row to print the circles in it, and then for each row we can increase the y coordinate by 50, since the circles on row n + 1 are 50 pixels below the circles on row n.</p>
    <pre><code class='python'>
    def draw_shapes(a_canvas, start_x, start_y, number_of_rows):
        size = 50
        for row in range(number_of_rows): # for each row
            # do something
            start_y += size 
    </code></pre>
    <p>Now lets figure out where to start printing the circles, AKA the start_x for each row. To do this lets first get the starting X position on each row in terms of the size, i.e. how many 'invisible' circles there are until the first actual circle.</p>
    <img src="/101/walkthroughs/lab_9_question_6_figure_2.png">
    <p>Notice the pattern here, there's a relationship between the starting x position and the row number.<br>The pattern seems to be 5 - the row number, but why 5?<br>5 Happens to be the highest row number we're printing (since we start <i>at&nbsp;</i> 0), so instead of <span class='eq'>5 - row</span> we can just say <span class='eq'>number_of_rows - 1 - row</span><br>Since this position is in terms of size, the equation can be written as <span class='eq'>size * (number_of_rows - 1 - row)</span><br>And since the starting position for every row is relative to the inital start_x, it can be finalised as:<br><span class='eq'>x = start_x + (number_of_rows - 1 - row)</span></p>
    <pre><code class='python'>
    def draw_shapes(a_canvas, start_x, start_y, number_of_rows):
        size = 50
        for row in range(number_of_rows): # for each row
            x = start_x + (number_of_rows - row - 1) * size # get starting x
            # printing the pyramid
            start_y += size
    </code></pre>
    <p>Now moving onto printing the pyramid itself.<br>This task will be a bit simpler, we just need to get the number of circles to print and then make a loop to print them, they will all have the same y position, and the x position of each one is just 50 pixels above the previous.</p>
    <pre><code class='python'>
    def draw_shapes(a_canvas, start_x, start_y, number_of_rows):
        size = 50
        for row in range(number_of_rows): # for each row
            x = start_x + (number_of_rows - row - 1) * size # get starting x

            for i in range(n): # do this n times
                a_canvas.create_oval(x, start_y, x + size, start_y + size, fill='blue') # print the circle
                x += size # add 50
            start_y += size
    </code></pre>
    <p>To get the number of circles to print (n), lets take a look back at the diagram.</p>
    <img src="/101/walkthroughs/lab_9_question_6_figure_3.png">
    <p>There's a clear correlation between row and number of circles, being <span class='eq'>n = 2 * row + 1</span><br>So now just plug this equation back into the range.</p>
    <pre><code class='python'>
    def draw_shapes(a_canvas, start_x, start_y, number_of_rows):
        size = 50
        for row in range(number_of_rows): # for each row
            x = start_x + (number_of_rows - row - 1) * size # get starting x

            for i in range(2 * row + 1): # for each circle on the row
                a_canvas.create_oval(x, start_y, x + size, start_y + size, fill='blue') # print the circle
                x += size # add 50
            start_y += size
    </code></pre>
    <p>If you have trouble finding the right formulas, such as the <span class='eq'>n = 2 * row + 1</span> or <span class='eq'>start_x<sub>row</sub> = 5 - row</span>, try making a table and using <span class='eq'>y = mx + c</span> to come up with them.</p>
    <a href="101" id="back">Back to 101 Index</a>
</body>
</html>