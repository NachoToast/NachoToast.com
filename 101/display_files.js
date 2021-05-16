var revision_exercises_container = document.getElementById("revision_exercises"),
output_container = document.getElementById("output_container"),
revision_exercise_buttons = document.getElementsByClassName("revision_exercise_button"),
assessments_container = document.getElementById("assessments"),
assessments_buttons = document.getElementsByClassName("assessments_button");
current_revision_exercises_displayed = [-1],
current_assessments_displayed = [-1],
shifting = false;

window.addEventListener("keydown", function(e) {
    if (e.key == "Shift" && !shifting) shifting = true;
})

window.addEventListener("keyup", function(e) {
    if (e.key == "Shift") shifting = false;
})

function generate_elements() {
    // revision exercises
    for (let i = 0, len = revision_exercises.length; i < len; i++) {
        let a = document.createElement("a");
        a.classList.add("noselect", "revision_exercise_button");
        a.innerText = `${revision_exercises[i].name}`;
        a.onclick = function() {display_resource("revision_exercise", i)};
        revision_exercises_container.appendChild(a);
        // should only be done on initialisation
        revision_exercises[i].contents.shift();

    }
    // assessments
    for (let i = 0, len = assessments.length; i < len; i++) {
        let a = document.createElement("a");
        a.classList.add("noselect", "assessments_button");
        a.innerText = `${assessments[i].name}`;
        a.onclick = function() {display_resource("assessments", i)};
        assessments_container.appendChild(a);
        // should only be done on initialisation
        assessments[i].contents.shift();

    }
    document.getElementById("revision_exercise_heading").innerHTML = `Revision Exercise Answers (${revision_exercise_buttons.length})`;
    document.getElementById("assessments_heading").innerHTML = `Assessment Answers (${assessments_buttons.length})`;

    // pesudo buttons
        { // open all (revision exercises)
            let f = document.createElement("a");
            f.classList.add("noselect", "revision_exercise_button");
            f.innerText = `(Open All)`;
            f.id = `rvb_p1`;
            f.onclick = function() {
                if (current_revision_exercises_displayed.length == revision_exercises.length) {
                    let goto = current_revision_exercises_displayed[current_revision_exercises_displayed.length -1];
                    current_revision_exercises_displayed = [-1];
                    display_resource("revision_exercise", goto);
                    f.classList.remove("open");
                }
                else {
                    display_resource("clear", 0, false, "revision_exercise");
                    f.classList.add("open");
                    for (let i = 0, len = revision_exercises.length; i < len; i++) {
                        display_resource("revision_exercise", i, true);
                    }
                }
            };
            revision_exercises_container.appendChild(f);
        }
        { // open all (assessments)
            let f = document.createElement("a");
            f.classList.add("noselect", "assessments_button");
            f.innerText = `(Open All)`;
            f.id = `ab_p1`;
            f.onclick = function() {
                if (current_assessments_displayed.length == assessments.length) {
                    let goto = current_assessments_displayed[current_assessments_displayed.length -1];
                    current_assessments_displayed = [-1];
                    display_resource("assessments", goto);
                    f.classList.remove("open");
                }
                else {
                    display_resource("assessments", 0, false, "assessments");
                    f.classList.add("open");
                    for (let i = 0, len = assessments.length; i < len; i++) {
                        display_resource("assessments", i, true);
                    }
                }
            };
            assessments_container.appendChild(f);
        }

}

function clear_revision_exercise_highlights() {
    for (let i = 0, len = revision_exercise_buttons.length; i < len; i++) {
        revision_exercise_buttons[i].classList.remove("open");
    }
}

function clear_assessments_highlights() {
    for (let i = 0, len = assessments_buttons.length; i < len; i++) {
        assessments_buttons[i].classList.remove("open");
    }
}

function display_resource(type = "clear", index = 0, additive = false, clear_type = "both") {
    if (shifting) additive = true;
    if (!additive) {output_container.innerHTML = ""; clear_revision_exercise_highlights(); clear_assessments_highlights();}

    if (type == "clear") {
        if (clear_type != "both" && additive) {
            var temp_revision_exercise_displayed = [...current_revision_exercises_displayed];
            temp_assessments_displayed = [...current_assessments_displayed];
        }
        current_revision_exercises_displayed = [-1];
        output_container.innerHTML = "";
        current_assessments_displayed = [-1];
        //clear_revision_exercise_highlights();
        //clear_assessments_highlights();
        if (clear_type != "both" && additive) {
            if (clear_type != "revision_exercise") {
                for (let i = 0, len = temp_revision_exercise_displayed.length; i < len; i++) {
                    display_resource("revision_exercise", temp_revision_exercise_displayed[i], true);
                } 
            }
            if (clear_type != "assessments") {
                for (let i = 0, len = temp_assessments_displayed.length; i < len; i++) {
                    display_resource("assessments", temp_assessments_displayed[i], true);
                }
            }
        }
    }
    else if (type == "revision_exercise") {
        // removal
        if (current_revision_exercises_displayed.indexOf(index) != -1 && additive && current_revision_exercises_displayed.length > 1) {
            current_revision_exercises_displayed.splice(current_revision_exercises_displayed.indexOf(index), 1);
            let temp = current_revision_exercises_displayed;
            revision_exercise_buttons[index].classList.remove("open");
            display_resource();
            for (let i = 0, len = temp.length; i < len; i++) {
                display_resource("revision_exercise", temp[i], true);
            }
            return;
        }

        // meta
        items = revision_exercises[index].contents;
        title = document.createElement("h2");
        //items.shift(); // NOPE
        title.innerHTML = `${revision_exercises[index].name} (${items.length} Questions)`;
        title.classList.add("noselect");
        output_container.appendChild(title);

        // option highlighting
        if (!additive) {current_revision_exercises_displayed = [index]; current_assessments_displayed = [-1]}
        else if (current_revision_exercises_displayed.indexOf(index) == -1) current_revision_exercises_displayed.push(index);
        revision_exercise_buttons[index].classList.add("open");

        // checks
        if (current_revision_exercises_displayed.indexOf(-1) != -1) current_revision_exercises_displayed.splice(current_revision_exercises_displayed.indexOf(-1), 1);

        // content
        for (let i = 0, len = items.length; i < len; i++) {
            // meta
            let contents = items[i].split("<comment>"),
            d = document.createElement("div"),
            p = document.createElement("pre"),
            h = document.createElement("h3");
            h.classList.add("noselect");
            p.classList.add("code");
            h.innerText = `Question ${i + 1}`;
            d.appendChild(h);

            // code formatting
            let output = "",
            code = contents[0].split("\n");
            code.shift();
            code.pop();
            code.pop();
            for (let j = 0, j_len = code.length; j < j_len; j++) {
                output += code[j].substring(4);
            }
            p.innerHTML = hljs.highlight(output, {language: "python"}).value;
            //p.innerHTML = "<code class='language-python'>" + output + "</code>";
            d.appendChild(p);
            //hljs.highlightBlock(p);

            // comments
            if (contents.length > 1) {
                let cd = document.createElement("div");
                cd.classList.add("comment");
                for (let j = 1, j_len = contents.length; j < j_len; j++) {
                    let c = document.createElement("p"),
                    text = contents[j].split("\n"),
                    output = "";
                    text.shift();
                    text.pop();
                    text.pop();
                    for (let k = 0, k_len = text.length; k < k_len; k++) {
                        output += text[k].substring(4) + "<br>";
                    }
                    c.innerHTML = output;
                    cd.appendChild(c);
                }
                d.appendChild(cd);
            }

            // buttons
            let b_div = document.createElement("div");
            b_div.classList.add("links");
            d.id = `question${i + 1}`;
            { // question link
                let share_hidden = document.createElement("input");
                share_hidden.classList.add("share_hidden");
                share_hidden.value = `https://nachotoast.com/101/?t=0&p=${index + 1}&q=${i + 1}#question${i + 1}`
                b_div.appendChild(share_hidden);

                let share_visible = document.createElement("p");
                share_visible.classList.add('share_visible');
                share_visible.innerText = "Copy Question Link";
                share_visible.onclick = function() {
                    share_hidden.classList.remove("share_hidden");
                    share_hidden.select();
                    share_hidden.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    share_hidden.classList.add("share_hidden");
                    share_visible.innerText = 'Copied to Clipboard!';
                    share_visible.classList.add('share_done');
                    share_visible.classList.remove('share_visible');
                }
                b_div.appendChild(share_visible);
            }
            { // code
                /*

                let code_hidden = document.createElement("textarea");
                code_hidden.classList.add("share_hidden");
                code_hidden.value = output;
                b_div.appendChild(code_hidden);
                */

                let code_visible = document.createElement("p");
                code_visible.classList.add('share_visible');
                code_visible.innerText = "Copy Code";
                code_visible.onclick = function() {

                    let ta = document.createElement("textarea");
                    ta.value = output;
                    p.replaceWith(ta);
                    ta.select();
                    ta.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    ta.replaceWith(p);
                    code_visible.innerText = 'Copied to Clipboard!';
                    code_visible.classList.add('share_done');
                    code_visible.classList.remove('share_visible');
                }
                b_div.appendChild(code_visible);
            }
            { // 
                
            }
            d.appendChild(b_div);

            output_container.appendChild(d);

            if (current_revision_exercises_displayed.length == revision_exercise_buttons.length - 1) {
                document.getElementById('rvb_p1').classList.add("open");
            }
        }
    }
    else if (type == "assessments") {
        // removal
        if (current_assessments_displayed.indexOf(index) != -1 && additive && current_assessments_displayed.length > 1) {
            current_assessments_displayed.splice(current_assessments_displayed.indexOf(index), 1);
            let temp = current_assessments_displayed;
            assessments_buttons[index].classList.remove("open");
            display_resource();
            for (let i = 0, len = temp.length; i < len; i++) {
                display_resource("assessments", temp[i], true);
            }
            return;
        }

        // meta
        items = assessments[index].contents;
        title = document.createElement("h2");
        //items.shift(); // NOPE
        title.innerHTML = `${assessments[index].name} (${items.length} Questions)`;
        title.classList.add("noselect");
        output_container.appendChild(title);

        // option highlighting
        if (!additive) {current_assessments_displayed = [index]; current_revision_exercises_displayed = [-1]}
        else if (current_assessments_displayed.indexOf(index) == -1) current_assessments_displayed.push(index);
        assessments_buttons[index].classList.add("open");

        // checks
        if (current_assessments_displayed.indexOf(-1) != -1) current_assessments_displayed.splice(current_assessments_displayed.indexOf(-1), 1);

        // content
        for (let i = 0, len = items.length; i < len; i++) {
            // meta
            let contents = items[i].split("<comment>"),
            d = document.createElement("div"),
            p = document.createElement("pre"),
            h = document.createElement("h3");
            h.classList.add("noselect");
            p.classList.add("code");
            h.innerText = `Question ${i + 1}`;
            d.appendChild(h);

            // code formatting
            let output = "",
            code = contents[0].split("\n");
            code.shift();
            code.pop();
            code.pop();
            for (let j = 0, j_len = code.length; j < j_len; j++) {
                output += code[j].substring(4);
            }
            p.innerHTML = hljs.highlight(output, {language: "python"}).value;
            //p.innerHTML = "<code class='language-python'>" + output + "</code>";
            d.appendChild(p);
            //hljs.highlightBlock(p);

            // comments
            if (contents.length > 1) {
                let cd = document.createElement("div");
                cd.classList.add("comment");
                for (let j = 1, j_len = contents.length; j < j_len; j++) {
                    let c = document.createElement("p"),
                    text = contents[j].split("\n"),
                    output = "";
                    text.shift();
                    text.pop();
                    text.pop();
                    for (let k = 0, k_len = text.length; k < k_len; k++) {
                        output += text[k].substring(4) + "<br>";
                    }
                    c.innerHTML = output;
                    cd.appendChild(c);
                }
                d.appendChild(cd);
            }

            // buttons
            let b_div = document.createElement("div");
            b_div.classList.add("links");
            d.id = `question${i + 1}`;
            { // question link
                let share_hidden = document.createElement("input");
                share_hidden.classList.add("share_hidden");
                share_hidden.value = `https://nachotoast.com/101/?t=1&p=${index + 1}&q=${i + 1}#question${i + 1}`
                b_div.appendChild(share_hidden);

                let share_visible = document.createElement("p");
                share_visible.classList.add('share_visible');
                share_visible.innerText = "Copy Question Link";
                share_visible.onclick = function() {
                    share_hidden.classList.remove("share_hidden");
                    share_hidden.select();
                    share_hidden.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    share_hidden.classList.add("share_hidden");
                    share_visible.innerText = 'Copied to Clipboard!';
                    share_visible.classList.add('share_done');
                    share_visible.classList.remove('share_visible');
                }
                b_div.appendChild(share_visible);
            }
            { // code
                /*

                let code_hidden = document.createElement("textarea");
                code_hidden.classList.add("share_hidden");
                code_hidden.value = output;
                b_div.appendChild(code_hidden);
                */

                let code_visible = document.createElement("p");
                code_visible.classList.add('share_visible');
                code_visible.innerText = "Copy Code";
                code_visible.onclick = function() {

                    let ta = document.createElement("textarea");
                    ta.value = output;
                    p.replaceWith(ta);
                    ta.select();
                    ta.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    ta.replaceWith(p);
                    code_visible.innerText = 'Copied to Clipboard!';
                    code_visible.classList.add('share_done');
                    code_visible.classList.remove('share_visible');
                }
                b_div.appendChild(code_visible);
            }
            { // 
                
            }
            d.appendChild(b_div);

            output_container.appendChild(d);

            if (current_assessments_displayed.length == assessments_buttons.length - 1) {
                document.getElementById('ab_p1').classList.add("open");
            }
        }
    }

}

generate_elements();
if (!from_url) display_resource("revision_exercise", Math.floor(Math.random() * revision_exercises.length));
else {
    if (url_data.type == 0) var group = "revision_exercise";
    else if (url_data.type == 1) var group = "assessments";
    display_resource(group, url_data.page - 1);
}