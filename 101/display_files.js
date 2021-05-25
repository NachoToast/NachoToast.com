const containers = [
    ["Revision Exercise Answers", document.getElementById("revision_exercises"), ["Questions", "Question"], "Python", true],
    ["Assessment Answers", document.getElementById("assessments"), ["Questions", "Question"], "Python", true],
    ["Assignments", document.getElementById("assignments"), ["Questions", "Question"], "Python", false],
    ["Past Papers", document.getElementById("past_papers"), ["Questions", "Question"], "Python", true]
],
output_container = document.getElementById("output_container");
var displayed = [],
input_buttons = [],
shifting = false;
// valid languages: CSS, HTML, XML, JS, PHP, Py

// Initialisation
{
    window.addEventListener("keydown", function(e) {
        if (e.key == "Shift" && !shifting) shifting = true;
    })
    
    window.addEventListener("keyup", function(e) {
        if (e.key == "Shift") shifting = false;
    })

    if (containers.length != resources.length) console.warn(`Found ${resources.length} resource files but have handlers for ${containers.length}`);

    function generate_containers(clear_all = true) {
        if (!clear_all) output_container.innerHTML = ""; // clear output
        displayed = []; // clear displayed
        input_buttons = []; // clear input buttons

        for (let i = 0, len = Math.min(containers.length, resources.length); i < len; i++) {
            displayed.push([]);
            input_buttons.push([]);
            containers[i][1].innerHTML = ""; // clear old contents

            // heading
            let title = document.createElement("h2");
            title.innerText = `${containers[i][0]} (${resources[i].length})`;
            containers[i][1].appendChild(title);

            // page selectors
            for (let j = 0, j_len = resources[i].length; j < j_len; j++) {
                containers[i][1].appendChild(generate_option(i, j));
            }

            // pesudo options
            if (containers[i][4]) containers[i][1].appendChild(generate_pseudo_option(i));
        }
    }

    function generate_option(type, page) {
        let option = document.createElement("a");
        option.innerText = resources[type][page].name;
        input_buttons[type].splice(page, 0, option);
        option.onclick = function() {generate_page(type, page, shifting)}
        return option
    }

    function generate_pseudo_option(type) {
        let option = document.createElement("a");
        option.innerText = `(Show All)`;
        input_buttons[type].push(option);
        option.onclick = function() {display_all_of_type(type)}
        return option;

    }

    function display_all_of_type(type) {
        if (input_buttons[type][input_buttons[type].length - 1].classList[0] == "open") {
            generate_page();
            return;
        }
        if (!shifting) generate_page();
        for (let i = 0, len = resources[type].length; i < len; i++) {
            if (displayed[type].indexOf(i) != -1) continue;
            generate_page(type, i, true);
        }
        input_buttons[type][input_buttons[type].length -1].classList.add("open");
    }

    function random_page() {
        generate_page();
        let valid_type_index_map = resources.filter(e => e.length > 0).map(e => resources.indexOf(e)),
        pool = [];
        for (let i = 0, len = valid_type_index_map.length; i < len; i++) {
            for (let j = 0, j_len = resources[valid_type_index_map[i]].length; j < j_len; j++) {
                pool.push({type: i, page: j});
            }
        }
        let chosen = pool[Math.floor(Math.random() * pool.length)],
        max = resources[chosen.type].length;
        generate_page(chosen.type, chosen.page);
        containers[chosen.type][1].scrollTop = (containers[chosen.type][1].scrollHeight - containers[chosen.type][1].clientHeight) * (chosen.page / max);
    }

    generate_containers(true);
}

// State Changing
{
    function clear_all_pseudo_highlights() {
        for (let i = 0, len = resources.length; i < len; i++) {
            if (!resources[i][4]) continue;
            input_buttons[i][input_buttons[i].length -1].classList.remove("open");
        }
    }
    
    function clear_type_pseudo_highlights(type) {
        input_buttons[type][input_buttons[type].length -1].classList.remove("open");
    }
    
    function add_type_pseudo_highlights(type) {
        input_buttons[type][input_buttons[type].length -1].classList.add("open");
    }

    function check_displayed_array() {
        // checks number of items in displayed items array
        var count = 0, type = undefined, page = undefined;
        for (let i = 0, len = displayed.length; i < len; i++) {
            count += displayed[i].length;
            if (displayed[i].length > 0) {
                page = displayed[i][0];
                type = i;
            };
        }
        return {count, type, page};
    }
    
    function clear_displayed_array() {
        // removes selection highlighting and splices from array for all currently displayed elements
        for (let i = 0, len = displayed.length; i < len; i++) {
            for (let j = 0, j_len = displayed[i].length; j < j_len; j++) {
                input_buttons[i][displayed[i][j]].classList.remove("open");
            }
            displayed[i] = [];
        }
    }
    
    function remove_displayed_array(type, page) {
        // removes selection highlighting and splices from array for specific element
        input_buttons[type][page].classList.remove("open");
        displayed[type].splice(displayed[type].indexOf(page), 1);
    }
    
    function add_displayed_array(type, page) {
        // adds selection highlighting and pushes into array for specific element
        displayed[type].push(page);
        input_buttons[type][page].classList.add("open");
    }
}

// Generation
{
    function generate_page(type = -1, page, additive = false, from_error = false) {
        if (!additive || type == -1) {
            clear_all_pseudo_highlights();
            output_container.innerHTML = "";
            let self_click = check_displayed_array();
            clear_displayed_array();
            if (self_click.count == 1 && self_click.type == type && self_click.page == page) return;
        }
        if (type == -1) return;
        if (additive && displayed[type].indexOf(page) != -1) { // shift-clicked on already-displayed node = remove it
            clear_type_pseudo_highlights(type)
            find_page_to_remove(type, page, from_error);
            remove_displayed_array(type, page);
            return;
        }
        add_displayed_array(type, page);
        output_container.appendChild(display_specific_page(type, page));
        if (containers[type][4]) {
            // pseudo option highlighting
            if (displayed[type].length == resources[type].length) input_buttons[type][input_buttons[type].length - 1].classList.add("open");
            else if (input_buttons[type][input_buttons[type].length - 1].classList[0] == "open") input_buttons[type][input_buttons[type].length - 1].classList.remove("open");
        }
    
    }
    
    function display_specific_page(type, page) {
        // returns div containing resource content
        let page_element = document.createElement("div");
        page_element.classList.add("output_resource", `resource_type_${type}`, `resource_page_${page}`);
        let page_heading = document.createElement("h2");
        page_heading.classList.add("noselect");
        page_heading.innerText = `${resources[type][page].name} (${resources[type][page].contents.length} ${containers[type][2][0]})`;
        page_element.appendChild(page_heading);
        // element generation
        for (let i = 0, len = resources[type][page].contents.length; i < len; i++) {
            page_element.appendChild(display_specific_page_element(type, page, i));
        }
        return page_element;
    }
    
    function display_specific_page_element(type, page, index) {
        // returns a div representing each element
    
        let combined_element = document.createElement("div");
        combined_element.id = `i${index + 1}`;
    
        // heading
        let element_heading = document.createElement("h3");
        element_heading.innerText = `${containers[type][2][1]} ${index + 1}`;
        element_heading.classList.add("noselect");
        combined_element.appendChild(element_heading);
    
        let contents = resources[type][page].contents[index].split("<comment>");
    
        // code
        let code_element = document.createElement("pre");
        code_element.classList.add("code");
        code_element.innerHTML = generate_code(contents[0], containers[type][3]);
        combined_element.appendChild(code_element);
    
        // comments
        if (contents.length > 1) combined_element.appendChild(generate_comments(contents.splice(1)));
    
        // link widgets
        combined_element.appendChild(generate_link_elements(type, page, index, code_element));
    
        return combined_element;
    }
    
    function generate_code(raw_string = "No code specified", code_language) {
        let output = "",
        code_array = raw_string.split("\n");
        while (code_array[code_array.length -1] == "" || code_array[code_array.length -1] == "</pre>\r" || code_array[code_array.length -1] == "</pre>") code_array.pop();
        while (code_array[0] == "\r" || code_array[0] == "") code_array.shift();
        for (let i = 0, len = code_array.length; i < len; i++) {
            if (code_array[i].substring(0, 4) == "    ") output += code_array[i].substring(4);
            else output += code_array[i];
        }
        return hljs.highlight(output, {language: code_language}).value;
    }
    
    function generate_comments(comments_array) {
        let comments_div = document.createElement("div");
        comments_div.classList.add("comment");
    
        for (let i = 0, len = comments_array.length; i < len; i++) {
            let this_comment = comments_array[i].split("\n"),
            comment_element = document.createElement("p"),
            output = "";
            while (this_comment[this_comment.length -1] == "" || this_comment[this_comment.length -1] == "</comment>\r" || this_comment[this_comment.length -1] == "</comment>") this_comment.pop();
            while (this_comment[0] == "\r" || this_comment[0] == "") this_comment.shift();
            for (let j = 0, j_len = this_comment.length; j < j_len; j++) {
                if (this_comment[j].substring(0, 4) == "    ") output += this_comment[j].substring(4);
                else output += this_comment[j];
                output += "<br>";
            }
            comment_element.innerHTML = output;
            comments_div.appendChild(comment_element);
        }
        return comments_div;
    }
    
    function generate_link_elements(type, page, question, node) {
        // returns div element containing related widgets.
    
        const links_div = document.createElement("div");
        links_div.classList.add("links");
    
        { // copy question link
            let copy_link = document.createElement("p");
            copy_link.classList.add("share_visible");
            copy_link.innerText = "Copy Question Link";
            copy_link.onclick = function() {
                let link_to_copy = document.createElement("input");
                link_to_copy.value = `https://nachotoast.com/101/?t=${type}&p=${page + 1}&q=${question + 1}#i${question + 1}`;
                node.replaceWith(link_to_copy);
                link_to_copy.select();
                link_to_copy.setSelectionRange(0, 99999);
                document.execCommand("copy");
                link_to_copy.replaceWith(node);
    
                copy_link.innerText = "Copied to Clipboard!";
                copy_link.classList.add("share_done");
                copy_link.classList.remove("share_visible"); // prevent style overwrites
            }
            links_div.appendChild(copy_link);
        }
    
        { // copy code
            let copy_code = document.createElement("p");
            copy_code.classList.add('share_visible');
            copy_code.innerText = "Copy Code";
            copy_code.onclick = function() {
                let code_to_copy = document.createElement("textarea");
                code_to_copy.value = node.innerText;
                node.replaceWith(code_to_copy);
                code_to_copy.select();
                code_to_copy.setSelectionRange(0, 99999);
                document.execCommand("copy");
                code_to_copy.replaceWith(node);
    
                copy_code.innerText = 'Copied to Clipboard!';
                copy_code.classList.add('share_done');
                copy_code.classList.remove('share_visible'); // prevent style overwrites
            }
            links_div.appendChild(copy_code);
        }
    
        return links_div;
    }
    
    function find_page_to_remove(type, page, from_error) {
        // feeds the node found from input type and page to the remove page function
        let nodes = document.getElementsByClassName(`resource_type_${type} resource_page_${page}`);
        if (nodes.length > 1) console.warn(`Found ${nodes.length} instances of page ${page} (type ${type}) displayed, this should never happen!`);
        if (nodes.length < 1) {console.warn(`Failed to find node for type ${type}, page ${page}.`); return}
        remove_specific_page(nodes[0], from_error);
    }
    
    function remove_specific_page(node, from_error) {
        try {
            output_container.removeChild(node);
        }
        catch (error) {
            if (from_error) {
                console.error(`Error occured again in second run!`);
                return;
            }
            console.warn(`Failed to delete node!`, error);
            generate_page(-1, -1, false, true);
        }
    }
}

if (from_url) generate_page(url_data.type, url_data.page - 1);