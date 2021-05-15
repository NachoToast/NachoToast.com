function server_save() {
    $.ajax({
        type: "post",
        url: "../saves/saveload.php",
        data: {"player": JSON.stringify(player, null , 2)},
        success: function(response) {
            if (response == "success") change_save_option(2, "Saved to server!", "#90EE90", "Successfully saved file to online server.");
            else change_save_option(2, "Unable to save to server.", "#F08080", $response);
        }
    })
}

function server_load() {
    $.ajax({
        type: "post",
        url: "../saves/saveload.php",
        success: function(response) {
            if (response == "Save not found!") change_load_option(2, "Save not found!", "#F08080", "Are you logged in with the right account?");
            else true_load(2, "Server save file loaded successfully!", JSON.parse(response));
        }
    })
}