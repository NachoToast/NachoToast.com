const cookie_expiration_date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 5);

var notification_container = document.getElementById('global_notification_box');
if (notification_container) {
    var notifications = notification_container.childNodes;
    for (let i = 0, len = notifications.length; i < len; i++) {
        notifications[i].onclick = function() {
            setTimeout(function() {notifications[i].style.display = 'none'}, 1000);
            notifications[i].style.animationPlayState = 'running';
            document.cookie = `${notifications[i].id}=read; expires=${cookie_expiration_date}; path=/`;
            notifications[i].onclick = function() {this.style.display = 'none'}
        }
    }
}