CREATE DATABASE toaster;

CREATE TABLE breadcrumbs (
    id int(11) primary key not null auto_increment,
    username varchar(128) not null,
    email varchar(128) not null,
    password varchar(255) not null,
    registered int(11) not null default 0,
    lastonline int(11) not null default 0,
    extension varchar(4) not null default 'png',
    cpfp bit(1) not null default 0,
    description varchar(255),
    usernamechanged int(11) not null default 0,
    ip varchar(45) not null
);