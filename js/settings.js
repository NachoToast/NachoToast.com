var settings_visible = false,
schedule,
forms = document.getElementsByClassName("form"),
username_button = document.getElementById("uc_submit_button"),
username_output = document.getElementById("output_username"),
password_button = document.getElementById("pc_submit_button"),
password_outputs = document.getElementsByClassName("output_password"),
password_elements = document.getElementsByClassName("input_password"),
password_valid = [false, false],
pfp_output_image = document.getElementsByClassName("img_preview")[0],
pfp_output_text = document.getElementsByClassName("upload_file")[0],
pfp_button = document.getElementById("pfp_submit_button");

function toggle_settings(button) {
    button.classList.toggle("selected")
    if (settings_visible) {
        settings_visible = false;
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display = 'none';
        }
        return;
    }
    settings_visible = true;
    for (let i = 0; i < forms.length; i++) {
        forms[i].style.display = 'flex';
    }
}

function check_username(value) {
    clearTimeout(schedule);
    username_button.disabled = true;
    value = value.trim();
    if (value === "") {
        username_output.classList.add("output2");
        return;
    }
    username_output.classList.remove("output2");
    if (!value.match(/^[a-zA-Z0-9]*$/)) {
        username_output.innerHTML = "Invalid Characters!";
        return;
    }
    if (value.length < 3) {
        username_output.innerHTML = "Too Short!";
        return;
    }
    if (value.length > 20) {
        username_output.innerHTML = "Too Long!";
        return;
    }
    username_output.innerHTML = "<span style='color: gray'>Checking Database...</span>";
    schedule = setTimeout(function() {
        check_username_db(value)
    }, 100);
}

function check_username_db(to_check) {
    $.ajax({
        type: "post",
        url: "inc/dynamic_signup.inc.php",
        data: {"username": to_check},
        success: function(response) {
            //console.log(response);
            if (response == "true") {username_output.innerHTML = "<span style='color: lightgreen'>Username Available!</span>"; username_button.disabled = false}
            else username_output.innerHTML = "<span style='color: lightcoral'>Username Taken!</span>";
        },
        statusCode: {
            500: function() {
                username_output.innerHTML = "<span style='color: lightcoral'>Database Error!</span>";
                return;
            }
        }
    });
}

function update_password(value) {
    password_button.disabled = true;
    password_valid[0] = false;
    update_password_confirm(password_elements[1].value);
    if (value == "") {
        password_outputs[0].classList.add("output2");
        return;
    }
    password_outputs[0].classList.remove("output2");
    if (value.length < 5) {
        password_outputs[0].innerHTML = "Password Too Short!";
        return;
    }
    if (value.length > 255) {
        password_outputs[0].innerHTML = "Password Too Long!";
        return;
    }
    output_string = `<span style="color: rgb(${color_gradient(5, 15, value.length, {red: 240, green: 128, blue: 128}, {red: 255, green: 214, blue: 0}, {red: 144, green: 238, blue: 144})})">`;
    if (value.length > 100) output_string += "Why";
    else if (value.length >= 15) output_string += "Strong";
    else if (value.length >= 8) output_string += "Decent";
    else if (value.length >= 6) output_string += "Poor";
    else output_string += "Bare Minimum";
    output_string += ` [${(100 * (Math.min(value.length, 15) - 4)/11).toFixed(0)}%]</span>`;
    password_outputs[0].innerHTML = output_string;
    password_valid[0] = true;
    resolve_password();
}

function update_password_confirm(value) {
    password_button.disabled = true;
    password_valid[1] = false;
    if (value == "") {
        password_outputs[1].classList.add("output2");
        return;
    }
    password_outputs[1].classList.remove("output2");
    if (value !== password_elements[0].value) {
        password_outputs[1].innerHTML = "Passwords Don't Match!";
        return;
    }
    password_outputs[1].innerHTML = "<span style='color: lightgreen'>Passwords Match!</span>"; 
    password_valid[1] = true;
    resolve_password();
}

function resolve_password() {
    if (password_valid.indexOf(false) != -1) return;
    password_button.disabled = false;
}

function check_pfp(file) {
    pfp_button.disabled = true;
    if (file.size > 2000000) { // 2MB
        pfp_output_text.innerHTML = "<span style='color: lightcoral' title='Must be 2MB or less!'>Image size too large!</span>"
    }
    if (typeof window.FileReader !== "function") {
        pfp_output_text.innerHTML = "<span style'color: gray'>Preview Not Supported.</span>";
        return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
        pfp_output_image.src = e.target.result;
        pfp_button.disabled = false;
    }
    reader.readAsDataURL(file);
}


function color_gradient(min, max, current, color_a, color_b, color_c) {
    // returns an rgb value in the format "r, g, b"
    let color_progression;
    if (current >= max) color_progression = 1;
    else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
    if (color_c) {
        color_progression *= 2;
        if (color_progression >= 1) {
            color_progression -=1;
            color_a = color_b;
            color_b = color_c;
        }
    }

    let new_red = color_a.red + color_progression * (color_b.red - color_a.red),
    new_green = color_a.green + color_progression * (color_b.green - color_a.green),
    new_blue = color_a.blue + color_progression * (color_b.blue - color_a.blue);

    let output_red = parseInt(Math.floor(new_red), 10),
    output_green = parseInt(Math.floor(new_green), 10),
    output_blue = parseInt(Math.floor(new_blue), 10);

    return `${output_red}, ${output_green}, ${output_blue}`;
    // final r = x (final red - initial red) + inital red
    // where x is how far along u are (1 = done, 0 = none)

}

if (already_open) toggle_settings(document.getElementById("settings_main_button"));