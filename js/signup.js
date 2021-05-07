var username = document.getElementById("signup_username"),
email = document.getElementById("signup_email"),
password = document.getElementById("signup_password"),
password_confirm = document.getElementById("signup_password_confirm"),
signup_form = document.getElementById("signup_form"),
signup_buttom = document.getElementById("signup_submit"),
feedback_messages = document.getElementsByClassName("output"),
schedule,
schedule2,
valid = [false, false, false, false];

function onSubmit() {
    signup_form.submit();
}

function update_username(value) {
    clearTimeout(schedule);
    signup_buttom.disabled = true;
    valid[0] = false;
    value = value.trim();
    if (value === "") {
        feedback_messages[0].classList.add("output2");
        return;
    }
    feedback_messages[0].classList.remove("output2");
    if (!value.match(/^[a-zA-Z0-9]*$/)) {
        feedback_messages[0].innerHTML = "Invalid Characters!";
        return;
    }
    if (value.length < 3) {
        feedback_messages[0].innerHTML = "Username Too Short!";
        return;
    }
    if (value.length > 20) {
        feedback_messages[0].innerHTML = "Username Too Long!";
        return;
    }
    feedback_messages[0].innerHTML = "<span style='color: gray'>Checking Database...</span>";
    schedule = setTimeout(check_username, 100);
    return;
}

function check_username() {
    $.ajax({
        type: "post",
        url: "inc/dynamic_signup.inc.php",
        data: {"username": username.value},
        success: function(response) {
            //console.log(response);
            if (response == "true") {feedback_messages[0].innerHTML = "<span style='color: lightgreen'>Username Available!</span>"; valid[0] = true; resolve_form()}
            else feedback_messages[0].innerHTML = "<span style='color: lightcoral'>Username Taken!</span>";
        },
        statusCode: {
            500: function() {
                feedback_messages[0].innerHTML = "<span style='color: lightcoral'>Database Error!</span>";
                return;
            }
        }
    });
}

function update_email(value) {
    clearTimeout(schedule2);
    signup_buttom.disabled = true;
    valid[3] = false;
    if (value === "") {
        feedback_messages[1].classList.add("output2");
        return;
    }
    feedback_messages[1].classList.remove("output2");
    if (value.length > 128) {
        feedback_messages[1].innerHTML = "Email Too Long!";
        return;
    }
    if (!value.match(/\S+@\S+\.\S+/)) {
        feedback_messages[1].innerHTML = "Email Invalid!";
        return;
    }
    feedback_messages[1].innerHTML = "<span style='color: gray'>Checking Database...</span>";
    schedule2 = setTimeout(check_email, 100);
    return;
}

function check_email() {
    $.ajax({
        type: "post",
        url: "inc/dynamic_signup.inc.php",
        data: {"email": email.value},
        success: function(response) {
            //console.log(response);
            if (response == "true") {feedback_messages[1].innerHTML = "<span style='color: lightgreen'>Email Free!</span>"; valid[3] = true; resolve_form()}
            else feedback_messages[1].innerHTML = "<span style='color: lightcoral'>Email In Use!</span>";
        },
        statusCode: {
            500: function() {
                feedback_messages[1].innerHTML = "<span style='color: lightcoral'>Database Error!</span>";
                return;
            }
        }
    });
}

function update_password(value) {
    signup_buttom.disabled = true;
    valid[1] = false;
    update_password_confirm(password_confirm.value);
    if (value === "") {
        feedback_messages[2].classList.add("output2");
        return;
    }
    feedback_messages[2].classList.remove("output2");
    if (value.length < 5) {
        feedback_messages[2].innerHTML = "Password Too Short!";
        return;
    }
    if (value.length > 255) {
        feedback_messages[2].innerHTML = "Password Too Long!";
        return;
    }
    output_string = `<span style="color: rgb(${color_gradient(5, 15, value.length, {red: 240, green: 128, blue: 128}, {red: 255, green: 214, blue: 0}, {red: 144, green: 238, blue: 144})})">`;
    if (value.length > 100) output_string += "Why";
    else if (value.length >= 15) output_string += "Strong";
    else if (value.length >= 8) output_string += "Decent";
    else if (value.length >= 6) output_string += "Poor";
    else output_string += "Bare Minimum";
    output_string += ` [${(100 * (Math.min(value.length, 15) - 4)/11).toFixed(0)}%]</span>`;
    valid[1] = true;
    feedback_messages[2].innerHTML = output_string;
    resolve_form();
}

function update_password_confirm(value) {
    signup_buttom.disabled = true;
    valid[2] = false;
    if (value === "") {
        feedback_messages[3].classList.add("output2");
        return;
    }
    feedback_messages[3].classList.remove("output2");
    if (value !== password.value) {
        feedback_messages[3].innerHTML = "Passwords Don't Match!";
        return;
    }
    feedback_messages[3].innerHTML = "<span style='color: lightgreen'>Passwords Match!</span>"; 
    valid[2] = true;
    resolve_form();
}

function resolve_form() {
    if (valid.indexOf(false) != -1) return;
    signup_buttom.disabled = false;
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