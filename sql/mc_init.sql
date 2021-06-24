CREATE TABLE mc_players (
  discord varchar(18) primary key,
  minecraft varchar(16) not null unique,
  email varchar(128) not null,
  java bit(1) not null default 1,
  applied int(11) not null,
  accepted int(11),
  accepted_by int(11),
  status varchar(32) not null default 'Pending Whitelist Application',
  foreign key (accepted_by) references breadcrumbs(id)
);

CREATE TABLE mc_polls (
  username varchar(16) primary key,
  caves bit(1) not null default 1,
  incendium int(1) not null default 3,
  extras int(1) not null default 3,
  prev_bad varchar(255) not null,
  prev_good varchar(255) not null,
  game_night int(1) not null default 2,
  griefing int(1) not null default 0,
  pvp int(1) not null default 0,
  faculty int(1) not null default 0,
  nacho int(1) not null default 5,
  other varchar(255),
  foreign key (username) references mc_players(minecraft)
);