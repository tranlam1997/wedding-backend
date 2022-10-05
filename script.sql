-- Cấu trúc bảng cho users
CREATE TABLE `Role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(32) NOT NULL,
  `password` VARCHAR(100) NULL,
  `avatar` VARCHAR(128) NULL,
  `email` VARCHAR(128) NULL,
  `tel` VARCHAR(12) NULL,
  `provider` VARCHAR(50) NULL,
  `provider_id` VARCHAR(20) NULL,
  `email_verified` BOOLEAN NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role_id` INT NOT NULL,
  UNIQUE (`username`),
  UNIQUE (email),
  INDEX (provider),
  INDEX (provider_id),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CREATE administrative_regions TABLE
CREATE TABLE administrative_regions (
	id integer NOT NULL,
	name varchar(255) NOT NULL,
	name_en varchar(255) NOT NULL,
	code_name varchar(255) NULL,
	code_name_en varchar(255) NULL,
	CONSTRAINT administrative_regions_pkey PRIMARY KEY (id)
);


-- CREATE administrative_units TABLE
CREATE TABLE administrative_units (
	id integer NOT NULL,
	full_name varchar(255) NULL,
	full_name_en varchar(255) NULL,
	short_name varchar(255) NULL,
	short_name_en varchar(255) NULL,
	code_name varchar(255) NULL,
	code_name_en varchar(255) NULL,
	CONSTRAINT administrative_units_pkey PRIMARY KEY (id)
);


-- CREATE provinces TABLE
CREATE TABLE provinces (
	code varchar(20) NOT NULL,
	name varchar(255) NOT NULL,
	name_en varchar(255) NULL,
	full_name varchar(255) NOT NULL,
	full_name_en varchar(255) NULL,
	code_name varchar(255) NULL,
	administrative_unit_id integer NULL,
	administrative_region_id integer NULL,
	CONSTRAINT provinces_pkey PRIMARY KEY (code)
);


-- provinces foreign keys

ALTER TABLE provinces ADD CONSTRAINT provinces_administrative_region_id_fkey FOREIGN KEY (administrative_region_id) REFERENCES administrative_regions(id);
ALTER TABLE provinces ADD CONSTRAINT provinces_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES administrative_units(id);


-- CREATE districts TABLE
CREATE TABLE districts (
	code varchar(20) NOT NULL,
	name varchar(255) NOT NULL,
	name_en varchar(255) NULL,
	full_name varchar(255) NULL,
	full_name_en varchar(255) NULL,
	code_name varchar(255) NULL,
	province_code varchar(20) NULL,
	administrative_unit_id integer NULL,
	CONSTRAINT districts_pkey PRIMARY KEY (code)
);


-- districts foreign keys

ALTER TABLE districts ADD CONSTRAINT districts_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES administrative_units(id);
ALTER TABLE districts ADD CONSTRAINT districts_province_code_fkey FOREIGN KEY (province_code) REFERENCES provinces(code);



-- CREATE wards TABLE
CREATE TABLE wards (
	code varchar(20) NOT NULL,
	name varchar(255) NOT NULL,
	name_en varchar(255) NULL,
	full_name varchar(255) NULL,
	full_name_en varchar(255) NULL,
	code_name varchar(255) NULL,
	district_code varchar(20) NULL,
	administrative_unit_id integer NULL,
	CONSTRAINT wards_pkey PRIMARY KEY (code)
);


-- wards foreign keys

ALTER TABLE wards ADD CONSTRAINT wards_administrative_unit_id_fkey FOREIGN KEY (administrative_unit_id) REFERENCES administrative_units(id);
ALTER TABLE wards ADD CONSTRAINT wards_district_code_fkey FOREIGN KEY (district_code) REFERENCES districts(code);

CREATE TABLE `Customer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `tel` VARCHAR(20) NULL,
  `addr` VARCHAR(20) NULL,
  `province_code` VARCHAR(5) NULL,
  `district_code` VARCHAR(5) NULL,
  `ward_code` VARCHAR(6) NULL,
  `avatar` VARCHAR(128) NULL,
  `email` VARCHAR(128) NULL,
  `delegate_person` VARCHAR(50) NULL,
  `delegate_mobile` VARCHAR(20) NULL,
  `company` VARCHAR(100) NULL,
  `note` VARCHAR(150) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(`tel`),
  INDEX(`delegate_mobile`),
  INDEX (name),
  INDEX (email),
  INDEX (delegate_person),
  FOREIGN KEY (`province_code`) REFERENCES `provinces`(`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`district_code`) REFERENCES `districts`(`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`ward_code`) REFERENCES `wards`(`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
);

INSERT INTO Customer(`name`,`tel`,`addr`,`province_code`,`district_code`,`ward_code`)
VALUES ('A Thái', '0904309486', 'Lai Xá, Hoài Đức', '01', '', '')

INSERT INTO
  `Role` (`id`, `name`)
VALUES
  (1, 'admin');

INSERT INTO
  `User` (`id`, `username`, `email`, password, role_id)
VALUES
  (1, 'paltek', 'paltekasia@gmail.com', '123456', 1);

CREATE TABLE `Place` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX(`name`)
);

CREATE TABLE `EventType` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `color` VARCHAR(10) NULL,
  `template` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO
  `EventType` (`id`, `name`, `color`,`template`)
VALUES
  (1, 'Tiệc', '#007AFF','[{"label":"Sân khấu","value":"","id":1},{"label":"Tiền Sảnh","value":"","id":2},{"label":"Hội trường","value":"","id":3},{"label":"Khu vực trà nước","value":"","parent":3,"id":4},{"label":"Khu vực trưng bày","value":"","parent":3,"id":5},{"label":"Layout họp","value":"kiểu rạp hát cố gắng đc 930 ghế, 2 dãy đầu bàn cho đại biểu, dãy đầu khách đặt 5 bát hoa tươi 7h lấy ở phòng kế toán cả hoa bục và hoa bàn. Mỗi đại biểu 1 lọc + 1 ly, mỗi ghế còn lại sẵn để 1 chai lọc Lavie 350ml. 2 thùng lọc cho âm thanh, ca sỹ tại cánh gà","id":6,"parent":3},{"label":"Dao cắt bánh thắt nơ","value":"","parent":2,"id":7},{"label":"Layout khách","value":"Khách đặt 90 bàn 10; có thể phát sinh: 100 bàn","parent":2,"id":8},{"label":"Setup trên bàn Hera","value":"Setup từ đầu","parent":2,"id":9},{"label":"Hoa tươi bàn đại biểu","value":"","parent":2,"id":10},{"label":"Backdrop chụp hình","value":"4.2*2.6 ","parent":2,"id":11},{"label":"Bàn check-in","value":"","parent":2,"id":12},{"label":"Kỹ thuật viên","value":"","id":13,"parent":1},{"label":"Khay phủ đỏ","value":"","id":14,"parent":1},{"label":"Karaoke","value":"","id":15,"parent":1}]'),
  (2, 'Hội nghị', '#FF9800','[{"label":"Sân khấu","value":"","id":1},{"label":"Tiền Sảnh","value":"","id":2},{"label":"Hội trường","value":"","id":3},{"label":"Khu vực trà nước","value":"","parent":3,"id":4},{"label":"Khu vực trưng bày","value":"","parent":3,"id":5},{"label":"Layout họp","value":"kiểu rạp hát cố gắng đc 930 ghế, 2 dãy đầu bàn cho đại biểu, dãy đầu khách đặt 5 bát hoa tươi 7h lấy ở phòng kế toán cả hoa bục và hoa bàn. Mỗi đại biểu 1 lọc + 1 ly, mỗi ghế còn lại sẵn để 1 chai lọc Lavie 350ml. 2 thùng lọc cho âm thanh, ca sỹ tại cánh gà","id":6,"parent":3},{"label":"Dao cắt bánh thắt nơ","value":"","parent":2,"id":7},{"label":"Layout khách","value":"Khách đặt 90 bàn 10; có thể phát sinh: 100 bàn","parent":2,"id":8},{"label":"Setup trên bàn Hera","value":"Setup từ đầu","parent":2,"id":9},{"label":"Hoa tươi bàn đại biểu","value":"","parent":2,"id":10},{"label":"Backdrop chụp hình","value":"4.2*2.6 ","parent":2,"id":11},{"label":"Bàn check-in","value":"","parent":2,"id":12},{"label":"Kỹ thuật viên","value":"","id":13,"parent":1},{"label":"Khay phủ đỏ","value":"","id":14,"parent":1},{"label":"Karaoke","value":"","id":15,"parent":1}]');

CREATE TABLE `Attachment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `filename` VARCHAR(32) NOT NULL,
  `url` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE
);

CREATE TABLE `Event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NULL,
  `guest_estimate` VARCHAR(100) NULL,
  `feedback` VARCHAR(250) NULL,
  `start_time` BIGINT NULL,
  `end_time` BIGINT NULL,
  `type_id` INT NOT NULL,
  `place_id` INT NULL,
  `place_note` VARCHAR(200) NULL,
  `backup_place_id` INT NULL,
  `deposit` INT NOT NULL DEFAULT 0,
  `deposit_note` VARCHAR(200) NULL,
  `checklist` VARCHAR(2000) NULL,
  `customer_id` INT NULL,
  `user_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX(`title`),
  FULLTEXT (`title`),
  INDEX (`customer_id`),
  INDEX (`user_id`),
  INDEX (`start_time`),
  INDEX (`end_time`),
  PRIMARY KEY (`id`),

  FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    FOREIGN KEY (`place_id`) REFERENCES `Place`(`id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    FOREIGN KEY (`backup_place_id`) REFERENCES `Place`(`id`) ON DELETE
  SET
    NULL ON UPDATE CASCADE
);

CREATE TABLE `EventAttachment` (
  `event_id` INT NOT NULL,
  `attachment_id` INT NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`attachment_id`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);