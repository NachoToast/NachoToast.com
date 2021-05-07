INSERT INTO `breadcrumbs` (username, email, password, registered, lastonline, description, usernamechanged, ip)
SELECT username, email, password, registered, lastonline, description, usernamechanged, ip
FROM `users`;