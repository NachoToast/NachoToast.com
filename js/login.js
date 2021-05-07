var password = document.getElementById("login_password"),
username = document.getElementById("login_username"),
button = document.getElementById("login_submit");

function update_form() {
    if (password.value.length > 0 && username.value.length > 0) {
        button.disabled = false;
        return;
    }
    button.disabled = true;
}