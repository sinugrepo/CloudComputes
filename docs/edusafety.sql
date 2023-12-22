# Host: localhost  (Version 5.5.5-10.4.27-MariaDB)
# Date: 2023-12-21 00:17:20
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "answers"
#

INSERT INTO `answers` VALUES (1,1,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\"}','2023-12-15 23:32:23',NULL),(2,1,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\"}','2023-12-15 23:32:23',NULL),(3,1,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-15 23:32:23',NULL),(4,11,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\"}','2023-12-18 21:43:06',NULL),(5,11,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\"}','2023-12-18 21:43:06',NULL),(6,11,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-18 21:43:06',NULL),(7,12,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\"}','2023-12-18 21:50:11',NULL),(8,12,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\"}','2023-12-18 21:50:11',NULL),(9,12,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-18 21:50:11',NULL),(13,16,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\",\"quality\":100}','2023-12-20 23:28:14',NULL),(14,16,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\",\"quality\":50}','2023-12-20 23:28:14',NULL),(15,16,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-20 23:28:14',NULL),(16,17,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\",\"quality\":100}','2023-12-20 23:29:45',NULL),(17,17,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\",\"quality\":50}','2023-12-20 23:29:45',NULL),(18,17,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-20 23:29:45',NULL),(19,18,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\",\"grade\":100}','2023-12-20 23:34:29',NULL),(20,18,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\",\"grade\":50}','2023-12-20 23:34:29',NULL),(21,18,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-20 23:34:29',NULL),(22,19,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\",\"grade\":100}','2023-12-20 23:36:06',NULL),(23,19,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\",\"grade\":50}','2023-12-20 23:36:06',NULL),(24,19,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-20 23:36:06',NULL),(25,20,1,1,NULL,'{\"question_id\":1,\"category_id\":1,\"question\":\"Seberapa ini kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":1,\"question_id\":1,\"choice\":\"Sering\",\"grade\":100}','2023-12-20 23:36:17',NULL),(26,20,2,4,NULL,'{\"question_id\":2,\"category_id\":1,\"question\":\"Seberapa itu kamu?\",\"type\":\"dropdown\"}','{\"choice_id\":4,\"question_id\":2,\"choice\":\"Jarang\",\"grade\":50}','2023-12-20 23:36:17',NULL),(27,20,3,0,'gapapa kok','{\"question_id\":3,\"category_id\":1,\"question\":\"Bagaimana?\",\"type\":\"text\"}',NULL,'2023-12-20 23:36:17',NULL);

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

INSERT INTO `categories` VALUES (1,'Verbal Abuse','2023-12-14 22:16:59',NULL),(2,'Social','2023-12-20 19:56:26',NULL),(3,'Physical Assault','2023-12-20 19:56:31',NULL);

#
# Structure for table "category_scores"
#

DROP TABLE IF EXISTS `category_scores`;
CREATE TABLE `category_scores` (
  `category_score_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `grade` int(5) DEFAULT NULL,
  `label` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`category_score_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "category_scores"
#

INSERT INTO `category_scores` VALUES (1,1,200,'Critical','parah','2023-12-20 23:05:51','2023-12-20 23:22:49'),(2,1,100,'Mid','masih oke','2023-12-20 23:06:03','2023-12-20 23:22:50'),(3,1,0,'Low','no problem','2023-12-20 23:06:06','2023-12-20 23:06:13');

#
# Structure for table "choices"
#

DROP TABLE IF EXISTS `choices`;
CREATE TABLE `choices` (
  `choice_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) DEFAULT NULL,
  `choice` varchar(100) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`choice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "choices"
#

INSERT INTO `choices` VALUES (1,1,'Sering',100,'2023-12-14 22:42:40','2023-12-20 23:06:56'),(2,1,'Jarang',50,'2023-12-14 23:15:20','2023-12-20 23:07:05'),(3,2,'Sering',100,'2023-12-14 23:21:03','2023-12-20 23:07:07'),(4,2,'Jarang',50,'2023-12-14 23:21:06','2023-12-20 23:10:49'),(5,1,'Tidak Pernah',0,'2023-12-20 23:07:16',NULL),(6,2,'Tidak Pernah',0,'2023-12-20 23:07:23','2023-12-20 23:07:31');

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
  `violence_label` varchar(50) DEFAULT NULL,
  `violence_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`complaint_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "complaints"
#

INSERT INTO `complaints` VALUES (1,1,1,'sahrul','ilham','2023-12-15','dia jahat','127.0.0.1:1002/1702657943675.jpg',100,'high','parah\n','2023-12-15 23:32:23','2023-12-21 00:16:25'),(11,1,1,'laila','algi','2023-12-18','dia psikopat','127.0.0.1:1002/1702910586187.webp',0,'low','no problem','2023-12-18 21:43:06','2023-12-21 00:16:28'),(12,1,1,'sahrul','ilham','2023-12-15','dia jahat','127.0.0.1:1002/1702911011612.jpg',100,'high','parah','2023-12-18 21:50:11','2023-12-21 00:16:38'),(16,1,1,'sahrul','ilham','2023-12-10','dia jahat','127.0.0.1:1002/1703089694099.jpg',0,'low','no problem\n','2023-12-20 23:28:14','2023-12-21 00:16:29'),(17,1,1,'sahrul','ilham','2023-12-10','dia jahat','127.0.0.1:1002/1703089785498.jpg',0,'low','no problem\n','2023-12-20 23:29:45','2023-12-21 00:16:31'),(18,1,1,'sahrul','ilham','2023-12-10','dia jahat','127.0.0.1:1002/1703090069856.jpg',150,'Mid','masih oke','2023-12-20 23:34:29','2023-12-20 23:37:15'),(19,1,1,'sahrul','ilham','2023-12-10','dia jahat','127.0.0.1:1002/1703090166032.jpg',150,'Mid','masih oke','2023-12-20 23:36:06','2023-12-20 23:37:18'),(20,1,1,'sahrul','ilham','2023-12-10','dia jahat','127.0.0.1:1002/1703090177631.jpg',150,'Mid','masih oke','2023-12-20 23:36:17','2023-12-20 23:36:17');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'Zd7NCdxhRDQ1mKPVqPG85dMq7Up1','aailham007@gmail.com','$2b$10$VvlfCR.ntbA4sigt8PXoQ.lzwKJI6nnTabj16bDu2MDYv3FHe2nsm','register',1,'ilham','621234567889',NULL,NULL,1,'2023-12-18 22:44:44','2023-12-20 22:57:51'),(4,'h5aI5zPhWLVLmgBcLNUsSo29XqL2','ilhamcomifuzr@yopmail.com','$2b$10$2lnS3ykJTjvQ0J3u5d/JceXE1D90Uul6R2977Bp/Gq6dDDMoKsfxW','register',1,'ilham','621234567889',NULL,NULL,0,'2023-12-18 23:09:54','2023-12-19 14:05:30'),(5,'3DX1S5r4ycbxf8hXtJv0bck8hF92','ilhamcomisfuzr@yopmail.comz','$2b$10$xog1nImCZbHiBI0Dzze15Ob.i.xag0Nap2Gzsp5NfQuTLmt2z1Cqe','register',1,'ilham','621234567889',NULL,NULL,0,'2023-12-18 23:10:53',NULL),(6,'l9nv7A2VlAdTh4rLm359RGebhvc2','asdasdsfuzr@yopmail.comz','$2b$10$YCUC17P4O5Whno.NeNy/jO/S8nsi.3CZaNr5KA31SxaIIZeqU6K7u','register',1,'ilham','621234567889',NULL,NULL,0,'2023-12-18 23:11:26',NULL),(7,'jLqc3LqUUaawbBbFDmO6auNFHE43','asdasdsfuszr@yopmail.comz','$2b$10$WGAwZjbmwbzUvimvIsFsP.IKqm15V12hLNXVebADrerAWvtfodBzi','register',1,'nahady','621234567889',NULL,NULL,0,'2023-12-18 23:11:38',NULL);
