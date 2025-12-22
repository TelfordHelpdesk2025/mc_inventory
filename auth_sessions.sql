-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 192.168.2.221    Database: authify
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `authify_sessions`
--

DROP TABLE IF EXISTS `authify_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authify_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(45) NOT NULL,
  `emp_id` varchar(45) NOT NULL,
  `emp_name` varchar(255) DEFAULT NULL,
  `emp_firstname` varchar(255) DEFAULT NULL,
  `emp_jobtitle` varchar(255) DEFAULT NULL,
  `emp_dept` varchar(255) DEFAULT NULL,
  `emp_prodline` varchar(255) DEFAULT NULL,
  `emp_station` varchar(255) DEFAULT NULL,
  `generated_at` datetime NOT NULL,
  `emp_position` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_UNIQUE` (`token`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4048 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authify_sessions`
--

LOCK TABLES `authify_sessions` WRITE;
/*!40000 ALTER TABLE `authify_sessions` DISABLE KEYS */;
INSERT INTO `authify_sessions` VALUES (4002,'06025945-e392-470d-8a47-eefbde7e5e14','1650','Delgado, Alexander M.','Alexander','ESD Technician 1','Quality Management System','G & A','ESD','2025-12-22 07:06:33','1'),(4003,'2f9ed621-623c-4a71-9b12-0f7e12bf4c82','1650','Delgado, Alexander M.','Alexander','ESD Technician 1','Quality Management System','G & A','ESD','2025-12-22 07:06:35','1'),(4004,'d9ad69ed-e329-4643-b39a-871bf171a7b2','1650','Delgado, Alexander M.','Alexander','ESD Technician 1','Quality Management System','G & A','ESD','2025-12-22 07:06:37','1'),(4005,'5df18ae3-11c1-44ff-8916-e21b08bcb3d4','14190','Flores, Mariell Joy B.','Mariell Joy','Store Personnel 1','Store','G &amp; A','Store','2025-12-22 07:09:25','1'),(4007,'7dd26bcf-eb6f-4686-995d-ee36f1523cce','166','Gatpandan, Menchie U.','Menchie','PPC Supervisor','PPC','PL6 (ADLT)','PPC','2025-12-22 07:14:11','2'),(4017,'df95c24c-b854-4a79-8e04-9d0a6edf66d9','1805','Moya, JB Vhert G.','JB Vhert','Programmer 1','MIS','G & A','MIS','2025-12-22 07:48:38','1'),(4020,'ded5ed0e-66ed-4e62-a371-8339932bc8bc','166','Gatpandan, Menchie U.','Menchie','PPC Supervisor','PPC','PL6 (ADLT)','PPC','2025-12-22 08:02:33','2'),(4023,'48e8800a-ca68-4185-a17a-b5619c7b6e70','MJ','Flores, Mariell Joy B.','Mariell Joy','Store User',NULL,NULL,'1','2025-12-22 08:12:50',NULL),(4025,'451d0834-6976-4781-83e0-a841aa230d2a','1718','Bandilla, Ariel John B.','Ariel John','Programmer 1','MIS','G & A','MIS','2025-12-22 08:42:17','1'),(4028,'4a3aed67-456a-4a79-98a5-0ce49873f003','1705','Tañada, Jester Ryan B.','Jester Ryan','Programmer 1','MIS','G & A','MIS','2025-12-22 08:57:39','1'),(4042,'84ac8aab-1219-464c-9526-1d0673b0ba7a','1742','Seniel, Rommel A.','Rommel','Equipment Technician 1','Equipment Engineering','G & A','PM / Calibration','2025-12-22 10:37:57','1'),(4045,'3dcbc9ad-44a7-4ed7-86ce-708f7007f930','166','Gatpandan, Menchie U.','Menchie','PPC Supervisor','PPC','PL6 (ADLT)','PPC','2025-12-22 13:01:31','2'),(4046,'d42bc403-c0fa-4855-935d-24e5266b663b','MJ','Flores, Mariell Joy B.','Mariell Joy','Store User',NULL,NULL,'1','2025-12-22 13:14:45',NULL),(4047,'bbe3a9fb-d32f-4de3-ab52-7da425b4960f','MJ','Flores, Mariell Joy B.','Mariell Joy','Store User',NULL,NULL,'1','2025-12-22 13:19:15',NULL);
/*!40000 ALTER TABLE `authify_sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 13:42:39
