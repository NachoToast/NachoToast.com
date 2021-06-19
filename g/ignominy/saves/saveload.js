function server_save() {
  $.ajax({
    type: 'post',
    url: '../saves/saveload.php',
    data: { player: JSON.stringify(player, null, 2) },
    success: function (response) {
      if (response == 'success')
        MenuManager.showAttemptFeedback(2, 'Saved to server!', true);
      else
        MenuManager.showAttemptFeedback(2, 'Unable to save to server.', false);
    },
  });
}

function server_load() {
  $.ajax({
    type: 'post',
    url: '../saves/saveload.php',
    success: function (response) {
      if (response == 'Save not found!')
        MenuManager.showAttemptFeedback(2, 'Save not found!', false, 1);
      else
        true_load(
          2,
          'Server save file loaded successfully!',
          JSON.parse(response)
        );
    },
  });
}
