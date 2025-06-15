-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: medimap
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `medimap`
--

USE `medimap`;

--
-- Table structure for table `drug`
--

DROP TABLE IF EXISTS `drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drug` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `efficacy` longtext,
  `dosage` longtext,
  `caution` longtext,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drug`
--

LOCK TABLES `drug` WRITE;
/*!40000 ALTER TABLE `drug` DISABLE KEYS */;
INSERT INTO `drug` VALUES (1,'타이레놀','두통, 치통, 생리통 등의 통증 완화','하루 3번, 1정씩 복용','과다 복용 시 간 손상 가능','images/tylenol.jpg'),(2,'판콜에스','감기 증상 완화 (콧물, 기침, 두통 등)','하루 2~3회, 식후 복용','졸음을 유발할 수 있음','images/pancold.jpg'),(3,'이부프로펜','진통, 해열, 소염','식후 1정, 하루 3회 복용','위장 장애 주의','images/ibuprofen.jpg'),(4,'훼스탈 플러스','소화제, 소화불량 완화','식후 1~2정 복용','알레르기 주의','images/festal.jpg'),(5,'스트렙실','인후통, 목 통증 완화','2~3시간마다 1정 복용','1일 최대 8정 초과 금지','images/strepsils.jpg'),(6,'베나치오','멀미, 구역, 어지럼증','여행 30분 전 1정 복용','졸음 유발, 차량 운전 주의','images/benachio.png'),(7,'둘코락스','변비 치료','취침 전 1정 복용','장기간 복용 시 내성 유발','images/dulcolax.jpg'),(8,'디페린','여드름 치료','저녁 세안 후 1일 1회 얇게 도포','햇빛에 민감, 자외선 차단 권장','images/differin.jpg'),(13,'김도림','효능 정보 없음','용법 정보 없음','주의사항 없음',NULL),(14,'김동근','효능 정보 없음','용법 정보 없음','주의사항 없음',NULL),(15,'이나현','효능 정보 없음','용법 정보 없음','주의사항 없음',NULL),(16,'하성민','효능 정보 없음','용법 정보 없음','주의사항 없음',NULL);
/*!40000 ALTER TABLE `drug` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacy`
--

DROP TABLE IF EXISTS `pharmacy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacy` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacy`
--

LOCK TABLES `pharmacy` WRITE;
/*!40000 ALTER TABLE `pharmacy` DISABLE KEYS */;
INSERT INTO `pharmacy` VALUES (1,'행복약국','대구 중구 중앙대로 1',NULL),(2,'건강약국','대구 남구 대명로 55',NULL),(3,'영대정문약국','경북 경산시 대동 170-7','images/jungmun.jpg'),(4,'바다약국','경북 경산시 조영동 282-4','images/bada.jpg'),(5,'은결약국','경북 경산시 대동 168-1','images/eungeol.jpg'),(6,'천마약국','경북 경산시 조영동 239-15','images/cheonma.jpg'),(7,'영대약국','경북 경산시 조영동 243-3','images/yeongdae.jpg'),(8,'순천당약국','경북 경산시 압량읍 부적리 514-13','images/suncheondang.jpg');
/*!40000 ALTER TABLE `pharmacy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacy_stock`
--

DROP TABLE IF EXISTS `pharmacy_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacy_stock` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pharmacy_id` bigint DEFAULT NULL,
  `drug_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pharmacy_id` (`pharmacy_id`),
  KEY `drug_id` (`drug_id`),
  CONSTRAINT `pharmacy_stock_ibfk_1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacy` (`id`),
  CONSTRAINT `pharmacy_stock_ibfk_2` FOREIGN KEY (`drug_id`) REFERENCES `drug` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacy_stock`
--

LOCK TABLES `pharmacy_stock` WRITE;
/*!40000 ALTER TABLE `pharmacy_stock` DISABLE KEYS */;
INSERT INTO `pharmacy_stock` VALUES (1,1,1,6),(2,1,2,3),(3,2,1,2),(6,3,1,7),(7,3,5,4),(8,4,2,6),(9,4,8,3),(14,7,1,4),(15,7,3,2),(16,8,5,9),(17,8,6,6),(18,5,3,5),(19,5,7,2),(20,6,4,8),(21,6,8,1),(22,3,2,4),(26,3,16,1);
/*!40000 ALTER TABLE `pharmacy_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('CUSTOMER','MANAGER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'4@example.com','jwjw7890','CUSTOMER'),(10,'ejdkdfke@naver.com','dkssud','MANAGER'),(11,'5@example.com','jwjw7890','MANAGER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09 22:12:14
