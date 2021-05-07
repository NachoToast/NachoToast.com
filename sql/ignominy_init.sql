create table ignominy_players (
    id int(11) not null,
    username varchar(128) not null,
    foreign key (id) references breadcrumbs(id)
);