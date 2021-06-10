    <link rel="stylesheet" href="../solarized-dark.css" type="text/css">
    <script src="../highlight.pack.js"></script>
    <script>hljs.highlightAll();</script>
    <link href="../stylesheet.css" rel="stylesheet" type="text/css">
    <?php include_once '../../head.html'; ?>
    <meta property="og:title" content="CompSci101 Question Walkthrough">
    <meta property="og:description" content="All questions from the Mini-Mock exam.">
    <meta property="og:site_name" content="NachoToast">
    <meta property="og:image" content="https://nachotoast.com/img/main.png">
    <title>Mini-Mock Exam</title>
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
        <p>Disclaimer: This was done quickly, please be vigilant for errors, wrong answers, and bad reasoning. If you find any of these please message me!</p>
    </div>
    <div id='question'>
        <p>1 - Theory</p>
        <p>Break it into parts, what does the process_digits() function do, and what does the main() function do?</p>
        <p>The process_digits() function returns the highest digit in an input number. The main() function prints the process_digits() return value for the number 234, combining these we get: <span class='eq'>Prints the highest digit in the number 234.</span> Which is close enough to the model answer.</p>
    </div>
    <div id='question'>
        <p>2 - Theory</p>
        <p>Lets start with the 'something' variable, if we know what that is we can figure out what the 'xxxx' variable is, and then finally get a proper name for the 'who_knows()' function.</p>
        <p>Note how the function does a 'for ... in range(len(something))' loop, so 'something' must be a <span class='eq'>list</span>.<br>The if statement, <span class='eq'>if a_thing < 0</span>, is also very helpful, this numerical comparison means something[xxxx] must be a <span class='eq'>number</span> of some sort, and since 'xxxx' is in square brackets it must be the <span class='eq'>index</span> of an item in the 'something' list.<br>We can now safely call 'something' <span class='eq'>numbers_list</span>, and 'xxxx' can be <span class='eq'>number</span>.</p>
        <p>Now look at what the function is doing, which is popping/removing the number from the numbers_list if its below 0, aka negative, in other words, it is <span class='eq'>removing negative numbers</span> from the list.</p>
    </div>
    <div id='question'>
        <p>3 - Theory</p>
        <p>This question is testing knowledge on how lists work.<br>When the do_something() function assigns list2 to list1, you can think of it as list1 having an alternate name, so when the function later appends to list2, it is really just appending to list1.</p>
        <p>Because of this, list1 (which is a_list in the main() function), becomes <span class='eq'>[1, 4, 3, 2, 1, 4]</span></p>
    </div>
    <div id='question'>
        <p>4 - Theory</p>
        <p>This question is testing knowledge on how scope works.<br>Using our knowledge from the last question we know that list1 (a_list in the main() function) has the value <span class='eq'>[3, 7, 2, 5]</span> after the appending the do_something2() function does.<br>However the place where most people trip-up on this is the next line, <span class='eq'>list1 = list2</span>. While in the scope of the do_something2() function, it is true the value of list1 <span class='eq'>points to</span> list2, [4, 3], once we "leave" the do_something2() function and go back into the main() function, list2 doesn't exist anymore, and so list1 remains as <span class='eq'>[3, 7, 2, 5]</span></p>
    </div>
    <div id='question'>
        <p>5 - Theory</p>
        <p>The format for these style of questions is just 1 line, no if statement, no return True, just the boolean expression you would normally put in an if statement.</p>
        <p>Exactly between 2 and 12 (inclusive) = greater than or equal to 2 and less than or equal to 12 = <span class='eq'>value >= 2 and value <= 12</span>.</p>
    </div>
    <div id='question'>
        <p>6 - Theory</p>
        <p>Exactly divisible by 13 = <span class='eq'>value % 13 == 0</span><br>
        Not visible by 5 = <span class='eq'>value % 5 != 0</span><br>
        Combined: <span class='eq'>value % 13 == 0 and value % 5 != 0</span>
        </p>
    </div>
    <div id='question'>
        <p>7 - Theory</p>
        <p>Remember the format of a doctest, a doctstring (""") in the thing you want to test, three > symbols and then the test itself, and then the expected output on the next line.<br>For the swap_halves() function, we need to make a test it passes and a test it fails, the latter can be accomplished by 'expecting' an incorrect output.</p>
        <pre><code class='python'>
        """
        >>> swap_halves([0, 1])
        [1, 0]
        >>> swap_halves([1, 2, 4, 5])
        [5, 4, 1, 2]
        """
        </code></pre>
        <p>The first test with [0, 1] passes, since the returned [1, 0] from the swap_halves() function matches what we expected. However the second test fails, because even though the swap_halves() function correctly swapped the numbers we specified, we expected a wrong output on purpose.</p>
    </div>
    <div id='question'>
        <p>8 - Programming</p>
        <p>This question has the unfortunate bug of the second input, SpentSoFar2.txt, having erroneous newlines at the end of its contents, to get rid of these we can add a while loop to filter them out.</p>
        <pre><code class='python'>
        def read_from_file(filename):
            input_file = open(filename, 'r')
            contents = input_file.read().split('\n')
            input_file.close()
            while contents[-1] == "":
                contents.pop()
            return contents
        </code></pre>
    </div>
    <div id='question'>
        <p>9 - Programming</p>
        <p>No errors here luckily, only note is that the spaces between the item category and its amount spent are not equal, so instead of doing .find() on each item, its easier to just .split() and get the first and last item of the list that creates.</p>
        <pre><code class='python'>
        def get_total_amount_spent(item_list, category):
            total = 0
            for item in item_list:
                if item.split()[0] == category:
                    total += int(item.split()[-1])
            return total
        </code></pre>
    </div>
    <div id='question'>
        <p>10 - Programming</p>
        <p>This one is a bit easier than the previous questions in my opinion, just note that the index of the category in the items_of_interest list == the index of that category's price in the spent_each_item list.</p>
        <pre><code class='python'>
        def write_to_file(items_of_interest, spent_each_item):
            total = 0
            output_file = open('ntoa222.txt', 'w')
            for i in range(len(items_of_interest)):
                output_file.write(str(i + 1) + ". " + items_of_interest[i] + " $" + str(spent_each_item[i]) + '\n')
                total += spent_each_item[i]
            output_file.write('\nTotal: $' + str(total))
            output_file.close()
        </code></pre>
        <p>The 'str(i + 1)' part is a little hack of making the written list numbered.</p>
    </div>
    <div id='question'>
        <p>11 - Programming</p>
        <p>First loop through each key in dict1, and if that key is also in dict2, make dict3's value for that key be the maximum of dict1 and dict2's values for that key.</p>
        <pre><code class='python'>
        def get_max_dict(dict1, dict2):
            dict3 = {}
            for key in dict1:
                if key in dict2:
                    dict3[key] = max(dict1[key], dict2[key])
            return dict3
        </code></pre>
    </div>
    <div id='question'>
        <p>12 - Programming</p>
        <p>Another relatively easy one, just make sure you're accounting for uppercase vowels, and only adding the vowels score if it's not in the special_letters dictionary (aka elif instead of else or if).</p>
        <pre><code class='python'>
        def get_text_value(special_letters, text):
            valuation = 0
            vowels = "aeiou"
            for char in text.lower():
                if char in special_letters:
                    valuation += special_letters[char]
                elif char in vowels:
                    valuation += 1
            return valuation
        </code></pre>
    </div>
    <div id='question'>
        <p>13 - Programming</p>
        <p>Who doesn't love GUI?<br>Instead of overcomplicating things by having a second, nested loop for printing column by column, lets stick to using 1 loop and printing row by row, meaning we will print 3 squares (or 'rectangles') per row, for 5 rows total.<br>Lets also define a starting x and y coodinate, and increment this y coordinate every row.</p>
        <pre><code class='python'>
        def draw_pattern(a_canvas, size):
            start_x = 10
            start_y = 10
            
            for i in range(5):
                # canvas drawing
                start_y += size
        </code></pre>
        <p>Since the starting x coordinate of the row depends on the row number, lets add that in to the loop as well, accounting for odd row numbers (1 and 3) are offset 1 'size' to the right.</p>
        <pre><code class='python'>
        def draw_pattern(a_canvas, size):
            start_x = 10
            start_y = 10
            
            for i in range(5):
                x = start_x
                if i % 2 == 1:
                    x += size
                # canvas drawing
                start_y += size
        </code></pre>
        <p>Now we just print the 3 rectangles, with the second and third ones being 3 sizes to the right of the previous.</p>
        <pre><code class='python'>
        def draw_pattern(a_canvas, size):
            start_x = 10
            start_y = 10
            
            for i in range(5):
                x = start_x
                if i % 2 == 1:
                    x += size
                a_canvas.create_rectangle(x, start_y, x + size, start_y + size, fill='blue')
                x += size * 3
                a_canvas.create_rectangle(x, start_y, x + size, start_y + size, fill='blue')
                x += size * 3
                a_canvas.create_rectangle(x, start_y, x + size, start_y + size, fill='blue')
                start_y += size
        </code></pre>
    </div>
    <a href="101" id="back">Back to 101 Index</a>
</body>
</html>