var search_input = document.getElementById("username_search"),
profiles_container = document.getElementById("profiles_div"),
upp_outputs = document.getElementsByClassName("users_per_page"),
schedule,
users_per_page = 10,
per_page_options = [10, 20, 50],
search_mode = "search",
search_term = "",
current_page = 1,
max_page = 1,
total_results = 0,
user_display_number = document.getElementById("user_display_number"),
page_display_number = document.getElementById("page_display_number");

const cooldown = 100;

function schedule_profiles() {
    clearTimeout(schedule);
    //if (search_input.value.length < 1) return;
    schedule = setTimeout(db_search, cooldown);
}

function db_search() {
    search = search_input.value.trim();
    //if (search.length < 1 && search_mode == "default") return;
    if (search.length < 1) search_mode = "default";
    else search_mode = "search"
    if (search_mode == "search" && search_term != search) current_page = 1;
    if (search_mode == "search") {search_term = search}
    var time = Date.now();
    $.ajax({
        type: "post",
        url: "inc/all_profiles.inc.php",
        data: {"mode": search_mode, "input": search, "page": current_page - 1, "users_per_page": users_per_page},
        success: function(output) {
            output = JSON.parse(output);
            profiles_container.innerHTML = output[0];
            let lowerbound = users_per_page * (current_page - 1) + 1,
            upperbound = output[1] + users_per_page * (current_page - 1);
            // Displaying x-X (But "Displaying X" if only 0 or 1 user found, or if all can be displayed on 1 page)
            if (lowerbound >= upperbound || output[2] <= upperbound - lowerbound + 1) var user_range = upperbound;
            else var user_range = lowerbound + "-" + upperbound + " of " + output[2];
            // pluralize 'users'
            if (output[2] == 1) var pl = 'User';
            else var pl = 'Users'

            user_display_number.innerHTML = `Displaying ${user_range} ${pl} (${Date.now() - time}ms)`;
            total_results = output[2];
            max_page = Math.ceil(Math.max(total_results, 1)/users_per_page);
            page_display_number.innerHTML = `Page <span style='color: lightgray'>${current_page}</span> of <span style='color: lightgray'>${max_page}</span>`;
        }
    })
}

function change_users_per_page(i) {
    clearTimeout(schedule);
    if (i >= upp_outputs.length || i < 0) return;
    for (let j = 0; j < upp_outputs.length; j++) {
        if (i == j) continue;
        upp_outputs[j].classList.remove("uppa");
    }
    upp_outputs[i].classList.add("uppa");
    if (users_per_page != per_page_options[i]) users_per_page = per_page_options[i];
    else return;
    current_page = 1;
    schedule = setTimeout(db_search, cooldown);
}

function change_page(type) {
    clearTimeout(schedule);
    let attempted_page;
    if (type == -2) attempted_page = 1;
    else if (type == 2) attempted_page = max_page;
    else if (type == -1) attempted_page = current_page - 1;
    else attempted_page = current_page + 1;
    if (attempted_page < 1 || attempted_page > max_page) return;
    current_page = attempted_page;
    schedule = setTimeout(db_search, cooldown);
}

window.addEventListener("keydown", function(e) {
    if (e.key == "ArrowLeft") change_page(-1);
    else if (e.key == "ArrowRight") change_page(1);
    else if (e.key == "ArrowUp" && document.body.offsetHeight < window.innerHeight) change_users_per_page(per_page_options.indexOf(users_per_page) + 1);
    else if (e.key == "ArrowDown" && document.body.offsetHeight < window.innerHeight) change_users_per_page(per_page_options.indexOf(users_per_page) - 1);
})

if (window.innerWidth <= 768) {
    change_users_per_page(0);
} else if (window.innerWidth <= 1024) {
    change_users_per_page(1);
} else {
    change_users_per_page(2);
}
setTimeout(db_search, cooldown);