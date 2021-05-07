var search_input = document.getElementById("username_search"),
profiles_container = document.getElementById("profiles_div"),
upp_outputs = document.getElementsByClassName("users_per_page"),
schedule,
users_per_page = 10,
current_page = 0;


function schedule_profiles() {
    clearTimeout(schedule);
    //if (search_input.value.length < 1) return;
    schedule = setTimeout(db_search, 100);
}

function db_search() {
    search = search_input.value;
    if (search.length < 1) var mode = "default"
    else var mode = "search";
    var time = (Date.now() / 1000).toFixed(0);
    $.ajax({
        type: "post",
        url: "inc/all_profiles.inc.php",
        data: {"mode": mode, "input": search, "start": time, "page": current_page, "users_per_page": users_per_page},
        success: function(output) {
            profiles_container.innerHTML = output;
        }
    })
}

function change_users_per_page(i) {
    clearTimeout(schedule);
    for (let j = 0; j < upp_outputs.length; j++) {
        if (i == j) continue;
        upp_outputs[j].classList.remove("uppa");
    }
    upp_outputs[i].classList.add("uppa");
    if (i == 0) users_per_page = 10;
    if (i == 1) users_per_page = 20;
    if (i == 2) users_per_page = 50;
    schedule = setTimeout(db_search, 100);
}

schedule = setTimeout(db_search, 100);