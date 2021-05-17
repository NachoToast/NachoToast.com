const cookie_expiration_date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 21);

var notification_container = document.getElementById('global_notification_box');
if (notification_container) {
    var notifications = notification_container.childNodes;
    len = notifications.length;
    for (let i = 0; i < len; i++) {
        notifications[i].onclick = function() {
            notifications[i].style.display = 'none';
            document.cookie = `${notifications[i].id}=read; expires=${cookie_expiration_date}`;
            console.log(document.cookie);
        }
    }
}