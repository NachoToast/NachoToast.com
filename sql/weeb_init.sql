CREATE TABLE weeb_images (
    name varchar(255) primary key, -- folder/file.png
    added int(11), -- unix timestamp (s)
    uploader int(11),
    source varchar(255) default 'None',
    size int(6) not null, -- size in KB's, 1KB to 999999 KB (999 MB)
    foreign key (uploader) references breadcrumbs(id)
);

CREATE TABLE weeb_tags (
    tag varchar(63) primary key,
    description varchar(127),
    type varchar(15)
);

CREATE TABLE weeb_image_tags (
    image varchar(255),
    tag varchar(63),
    primary key (image, tag),
    foreign key (image) references weeb_images(name),
    foreign key (tag) references weeb_tags(tag)
);

CREATE TABLE weeb_tag_aliases (
    alias varchar(63) primary key,
    tag varchar(63),
    foreign key (tag) references weeb_tags(tag)
);

CREATE TABLE weeb_image_likes (
    user_id int(11),
    image varchar(255),
    `like` bit(1) not null default 1,
    primary key (user_id, image),
    foreign key (user_id) references breadcrumbs(id),
    foreign key (image) references weeb_images(name)
);

CREATE TABLE weeb_suggested_image_tags (
    user_id int(11),
    tag varchar(63),
    image varchar(255),
    `like` bit(1) not null default 1,
    added int(11) not null,
    primary key (user_id, tag, image),
    foreign key (user_id) references breadcrumbs(id),
    foreign key (image) references weeb_images(name)
);