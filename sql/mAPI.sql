create table monkey_images (
  name varchar(255) primary key, -- file.png
  added int(11), -- unix timestamp (s)
  uploader int(11),
  size int(6) not null, -- size in KB, 1KB to 999999KB (999MB)
  verified bit(1) default 0,
  verified_by int(11),
  foreign key (uploader) references breadcrumbs(id),
  foreign key (verified_by) references breadcrumbs(id)
);

drop table monkey_images;