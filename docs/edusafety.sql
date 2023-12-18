# Host: localhost  (Version 5.5.5-10.4.27-MariaDB)
# Date: 2023-12-18 21:47:30
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "answers"
#

DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `complaint_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `choice_id` int(11) DEFAULT NULL,
  `choice_text` varchar(100) DEFAULT NULL,
  `meta_question` text DEFAULT NULL,
  `meta_choice` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`answer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "answers"
#

INSERT INTO `answers` VALUES (1,1,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\"}','2023-12-15 23:32:23',NULL),(2,1,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\"}','2023-12-15 23:32:23',NULL),(3,1,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-15 23:32:23',NULL),(4,11,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\"}','2023-12-18 21:43:06',NULL),(5,11,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\"}','2023-12-18 21:43:06',NULL),(6,11,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-18 21:43:06',NULL);

#
# Structure for table "categories"
#

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "categories"
#

INSERT INTO `categories` VALUES (1,'Verbal Abuse','2023-12-14 22:16:59',NULL);

#
# Structure for table "choices"
#

DROP TABLE IF EXISTS `choices`;
CREATE TABLE `choices` (
  `choice_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `choice` varchar(100) DEFAULT NULL,
  `quality` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`choice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "choices"
#

INSERT INTO `choices` VALUES (1,1,'Sering',90,'2023-12-14 22:42:40',NULL),(2,1,'Jarang',20,'2023-12-14 23:15:20','2023-12-14 23:15:23'),(3,2,'Sering',90,'2023-12-14 23:21:03','2023-12-14 23:21:10'),(4,2,'Jarang',20,'2023-12-14 23:21:06','2023-12-14 23:21:12');

#
# Structure for table "complaints"
#

DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
  `complaint_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `perpetrator` varchar(100) DEFAULT NULL,
  `victim` varchar(100) DEFAULT NULL,
  `incident_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file` varchar(200) DEFAULT NULL,
  `violence_score` int(11) DEFAULT NULL,
  `violence_level` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`complaint_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "complaints"
#

INSERT INTO `complaints` VALUES (1,1,1,'sahrul','ilham','2023-12-15','dia jahat','127.0.0.1:1002/1702657943675.jpg',100,'high','2023-12-15 23:32:23','2023-12-18 19:29:16'),(11,1,1,'laila','algi','2023-12-18','dia psikopat','127.0.0.1:1002/1702910586187.webp',NULL,NULL,'2023-12-18 21:43:06',NULL);

#
# Structure for table "institutions"
#

DROP TABLE IF EXISTS `institutions`;
CREATE TABLE `institutions` (
  `institution_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL DEFAULT '',
  `access_code` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`institution_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "institutions"
#

INSERT INTO `institutions` VALUES (1,'PT Melia Sehat Sejahtera','MSS','2023-12-17 08:17:23',NULL);

#
# Structure for table "questions"
#

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `question` longtext DEFAULT NULL,
  `type` enum('dropdown','text') DEFAULT 'dropdown',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "questions"
#

INSERT INTO `questions` VALUES (1,1,'Seberapa ini kamu?','dropdown','2023-12-14 22:35:39','2023-12-14 23:15:41'),(2,1,'Seberapa itu kamu?','dropdown','2023-12-14 23:16:11','2023-12-14 23:16:53'),(3,1,'Bagaimana?','text','2023-12-14 23:20:01','2023-12-14 23:20:43');

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(150) NOT NULL DEFAULT '',
  `provider` enum('register','google') NOT NULL DEFAULT 'register',
  `institution_id` int(11) NOT NULL DEFAULT 0,
  `fullname` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `otp` varchar(150) DEFAULT NULL,
  `otp_expired` datetime DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'asdasdadasd','aailham007@gmail.com','$2b$10$fSot1KWTgCSv8lBfIQ9ZQ.S7ShomRAyn2t.9ALsVGhOcabJimFMjO','register',1,'ilham comifuro','6282123456789','9343','2023-12-18 20:43:50',0,'2023-12-18 20:40:50','2023-12-18 21:32:02'),(2,'2TxlpwlFwwVKYbOwHziUrNY5kWg2','ilhamcomifur@yopmail.com','$2b$10$lIOaLGiJF5tG7cqL9bsBSumbT1xDShrJ4PbJ.D1TtbUkQAkWPIv2O','register',1,'ilham','621234567889',NULL,NULL,0,'2023-12-18 21:44:10',NULL);
