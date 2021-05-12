create table ignominy_players (
    id int(11) not null unique,
    account_status varchar(32) not null,
    foreign key (id) references breadcrumbs(id)
);