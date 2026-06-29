-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: sigurnost_forum
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `correction_time` datetime(6) DEFAULT NULL,
  `correction_username` varchar(255) DEFAULT NULL,
  `posted_time` datetime(6) NOT NULL,
  `topic_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo3bvevu9ua4w6f8qu2b177f16` (`topic_id`),
  KEY `FK8kcum44fvpupyw6f5baccx25c` (`user_id`),
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKo3bvevu9ua4w6f8qu2b177f16` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (7,'Šta mislite koliko su danas ljudi zainteresovani za kulturne manifestacije?',NULL,NULL,'2024-06-18 10:10:53.000000',3,3),(8,'Mislim da interesovanje varira od mjesta do mjesta. U većim gradovima je više prilika za kulturne događaje, pa je i interesovanje veće.',NULL,NULL,'2024-06-18 10:11:55.000000',3,4),(9,'Trudim se da idem što češće mogu, posebno na koncerte i izložbe.',NULL,NULL,'2024-06-18 10:12:39.000000',3,4),(10,'Koliko često pratite naučne novosti?',NULL,NULL,'2024-06-18 10:15:45.000000',2,4),(11,'Pratim redovno, posebno me interesuju najnovija istraživanja u medicini i ekologiji.',NULL,NULL,'2024-06-18 10:16:23.000000',2,3),(13,'Nedavno sam pročitao fascinantan članak o novim terapijama za liječenje raka.\nMajo, šta tebe najviše zanima u nauci?','2024-06-18 10:42:53.000000','VukovicSvetozar','2024-06-18 10:42:06.000000',2,3),(14,'Najviše me zanima astrofizika i istraživanje svemira.',NULL,NULL,'2024-06-18 10:43:37.000000',2,4),(15,'Energija i emocija u rock pjesmama su nešto što me uvijek podigne. Koji je vaš omiljeni bend?',NULL,NULL,'2024-06-18 10:45:13.000000',4,4),(16,'Riblja čorba i Parni valjak.',NULL,NULL,'2024-06-18 10:46:09.000000',4,3),(17,'Najveće nacionalno fudbalsko takmičenje ove godine biće održano od 14. juna do 14. jula u Nemačkoj.\nBiće to treći put da se utakmice Evropskog prvenstva igraju na teritoriji Nemačke.',NULL,NULL,'2024-06-18 10:56:47.000000',1,3),(18,'Na Euru će učestvovati 24 reprezentacije podijeljene u 6 grupa.',NULL,NULL,'2024-06-18 10:57:04.000000',1,3),(19,'Francuska, Portugalija, Španija, po mom mišljenju, tu treba tražiti pobjednika Eura.','2024-06-18 13:16:57.000000','VukovicSvetozar','2024-06-18 10:57:50.000000',1,4),(20,'Kao neke dark horse ekipe mogu se staviti Holandija, Engleska, eventualno Hrvatska.',NULL,NULL,'2024-06-18 11:12:52.000000',1,5),(21,'Definitivno najveća nepoznanica za mene je domaća selekcija i teško je reći koliko zaista mogu u sadašnjoj postavi.',NULL,NULL,'2024-06-18 11:13:26.000000',1,5),(22,'Što se Srbije tiče, vjerujem da reprezentacija može da pobedi Sloveniju i to bi trebalo da bude dovoljno za drugi krug.',NULL,NULL,'2024-06-18 11:14:36.000000',1,3),(23,'Nevjerovatan je podatak da se reprezentacija 24 godine nije plasirala u drugu fazu velikog takmičenja.',NULL,NULL,'2024-06-18 11:15:16.000000',1,5),(24,'Iskreno se nadam nekom dobrom fudbalu i haosu. Da bude ludilo kao ovo četvrtfinale LS. Fudbal je postao užas i jako je smorio.',NULL,NULL,'2024-06-18 11:16:44.000000',1,3),(25,'Koliko se sjećam, to prvenstvo nije bilo nekog posebnog kvaliteta, bar ako ga uporedimo sa prvenstvima 2000. ili 2008. godine. ',NULL,NULL,'2024-06-18 11:17:15.000000',1,5),(26,'Planiram da prisustvujem radionici o veštačkoj inteligenciji sledeće godine. Mislim da je to jedno od najuzbudljivijih polja trenutno.',NULL,NULL,'2024-06-18 11:18:56.000000',2,5),(27,'Moj omiljeni događaj je pozorišni festival. Volim da gledam predstave i upoznajem se s novim produkcijama.',NULL,NULL,'2024-06-18 11:20:55.000000',3,5),(28,'Jednom sam volontirao na filmskom festivalu. Bilo je sjajno iskustvo, upoznao sam mnogo zanimljivih ljudi.',NULL,NULL,'2024-06-18 11:21:44.000000',3,5),(29,'Volontiranje je sjajna prilika za sticanje novih iskustava i poznanstava.',NULL,NULL,'2024-06-18 11:22:23.000000',3,3),(30,'Mislim da bi više mladih trebalo da se uključi.',NULL,NULL,'2024-06-18 11:22:45.000000',3,3),(34,'Ovde možemo da diskutujemo o tehnologiji.',NULL,NULL,'2024-06-18 11:34:07.000000',7,5),(35,'Probao sam VR i bilo je fantastično iskustvo.','2024-06-18 12:45:59.000000','Marko','2024-06-18 11:35:54.000000',7,5),(48,'Mislim da VR ima ogroman potencijal, posebno u obrazovanju i zabavi.','2024-06-18 12:46:04.000000','Marko','2024-06-18 12:42:26.000000',7,3),(49,'Sjećam se 2016. prije svega po tome što evropski šampion Portugal nije pobijedio u grupi i prošli su je samo zato što su bili među najboljim trećeplasiranim ekipama.',NULL,NULL,'2024-06-18 13:11:25.000000',1,5);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mbunn9erv8nmf5lk1r2nu0nex` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (1,_binary '','assets/topics/9.png','Sport'),(2,_binary '','assets/topics/7.png','Nauka'),(3,_binary '','assets/topics/5.png','Kultura'),(4,_binary '','assets/topics/4.png','Muzika'),(7,_binary '','assets/topics/11.png','Tehnologija'),(8,_binary '\0','assets/topics/1.png','Obrazovanje');
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `access_date` date NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `user_group` enum('GUEST','ADMIN','MODERATOR','MEMBER') DEFAULT NULL,
  `last_visit` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `secret_code` varchar(255) DEFAULT NULL,
  `secret_time` datetime(6) DEFAULT NULL,
  `user_status` enum('PENDING','OAUTH2','APPROVED','REJECTED','SUSPENDED','DEACTIVATED') DEFAULT NULL,
  `suspend_expiration` date DEFAULT NULL,
  `total_posts` int NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UK_sb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'2024-06-16','assets/avatars/13.png','vukovicsvetozar@gmail.com','ADMIN','2024-06-16','$2a$10$iBk9EdbXiX6i/yv85AmFReIqJD7Bh1jtlYypoh/8hFhHgcEmRUjNi','$2a$10$FtvNBy1vHqnY/cmRgaCZN.8vTtvNzQqq6eRCFi1oxLji.PUKFJgNe','2024-06-17 21:22:50.532459','APPROVED',NULL,23,'VukovicSvetozar'),(4,'2024-06-16','assets/avatars/1.png','svetozarvukovic.adm2@gmail.com','ADMIN','2024-06-16','$2a$10$XLJsIQ79Q5ul/DwooPphienhbGrit.s7hPtCvj3EmDu.I9szQEdx6','$2a$10$CeMErlX37MRxwrxiroq1ges8L/jvNTyDNXwYFtgUMTwqi35RqjUE2','2024-06-18 07:44:01.977428','APPROVED',NULL,12,'Maja'),(5,'2024-06-17','assets/avatars/14.png','svetozarvukovic.mod1@gmail.com','MODERATOR','2024-06-17','$2a$10$/BHh8NY.YO8ZKw6nI0oE8eFMt4hqGS7aWPBY1.eqoUY4Apqp.ba86','$2a$10$j...uKgF2daJ29h5y2dT.eECkwlrNhCwaQcpO1o/87Z7Kl0Rmri0m','2024-06-18 11:11:30.204689','APPROVED',NULL,14,'Marko'),(7,'2024-06-17','assets/avatars/30.png','svetozarvukovic.test1@gmail.com','MEMBER','2024-06-17','$2a$10$ixZrb2tLppKRcQXBNnCewuBRGa61oj6JOQxMSiN7k7rwp3/nhheTW','$2a$10$KqxmtNZGKNfPrLX6ONj4Z.A7.mhMzuvEZ2UoFnsgBMLqTUf1MEHh6','2024-06-19 10:33:11.375711','APPROVED',NULL,0,'anatestmember1'),(8,'2024-06-17','assets/avatars/33.png','svetozarvukovic.mod3@gmail.com','GUEST','2024-06-17','$2a$10$fFamRTPryDJM.rPL3XIbP.XSrKO4Fy18cc.6MAdYkXmorc1MRw6W2',NULL,NULL,'DEACTIVATED',NULL,0,'Rade'),(9,'2024-06-17','assets/avatars/5.png','svetozarvukovic.mod2@gmail.com','MODERATOR','2024-06-17','$2a$10$kgsoVuJtbRfQwLL/8d62zuYcIeprVuklrNJNSj.AZZKAfCQZOnssu','$2a$10$OwgBk1M7/1fnPha3yipZyeerTuAuV9FT8Ed/ooCPmooOcCv/81Yzy','2024-06-17 11:02:14.357283','APPROVED',NULL,0,'Ema'),(12,'2024-06-17','assets/avatars/1.png','svetozarvukovic.test2@gmail.com','GUEST','2024-06-17','$2a$10$ReKyXAvDTig85W0RkLQ0SO2JH8Z2JP6d1qpJdcPdXbipaMuImRnba',NULL,NULL,'PENDING',NULL,0,'Tamara');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `user_id` int NOT NULL,
  `permission` enum('ADMIN_MANAGE_ACCESS','ADMIN_MODIFY_PERMISSIONS','ADMIN_CHANGE_GROUP','ADMIN_SUSPEND_USER','ADMIN_DEACTIVATE_USER','ADMIN_TOPIC','MODERATOR_UPDATE_COMMENT','MODERATOR_DELETE_COMMENT','MEMBER_CREATE_COMMENT','MEMBER_UPDATE_COMMENT','MEMBER_DELETE_COMMENT') NOT NULL,
  PRIMARY KEY (`user_id`,`permission`),
  CONSTRAINT `FK79uqaq5t8qjak65ldagkoo7yr` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (3,'ADMIN_MANAGE_ACCESS'),(3,'ADMIN_MODIFY_PERMISSIONS'),(3,'ADMIN_CHANGE_GROUP'),(3,'ADMIN_SUSPEND_USER'),(3,'ADMIN_DEACTIVATE_USER'),(3,'ADMIN_TOPIC'),(3,'MODERATOR_UPDATE_COMMENT'),(3,'MODERATOR_DELETE_COMMENT'),(3,'MEMBER_CREATE_COMMENT'),(3,'MEMBER_UPDATE_COMMENT'),(3,'MEMBER_DELETE_COMMENT'),(4,'ADMIN_MODIFY_PERMISSIONS'),(4,'ADMIN_CHANGE_GROUP'),(4,'ADMIN_SUSPEND_USER'),(4,'ADMIN_DEACTIVATE_USER'),(4,'MODERATOR_UPDATE_COMMENT'),(4,'MODERATOR_DELETE_COMMENT'),(4,'MEMBER_CREATE_COMMENT'),(4,'MEMBER_UPDATE_COMMENT'),(4,'MEMBER_DELETE_COMMENT'),(5,'MODERATOR_UPDATE_COMMENT'),(5,'MODERATOR_DELETE_COMMENT'),(5,'MEMBER_CREATE_COMMENT'),(5,'MEMBER_UPDATE_COMMENT'),(5,'MEMBER_DELETE_COMMENT'),(7,'MEMBER_CREATE_COMMENT'),(7,'MEMBER_UPDATE_COMMENT'),(7,'MEMBER_DELETE_COMMENT'),(9,'MODERATOR_UPDATE_COMMENT'),(9,'MODERATOR_DELETE_COMMENT'),(9,'MEMBER_CREATE_COMMENT'),(9,'MEMBER_UPDATE_COMMENT'),(9,'MEMBER_DELETE_COMMENT');
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-19 11:43:07
