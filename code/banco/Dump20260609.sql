-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (x86_64)
--
-- Host: sonara-db.mysql.database.azure.com    Database: sonara_db
-- ------------------------------------------------------
-- Server version	8.0.44-azure

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
-- Table structure for table `tb_artista`
--

DROP TABLE IF EXISTS `tb_artista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_artista` (
  `id_artista` int NOT NULL AUTO_INCREMENT,
  `nome_artistico` varchar(150) NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `descricao` text,
  PRIMARY KEY (`id_artista`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `idx_artista_usuario_id` (`usuario_id`),
  CONSTRAINT `tb_artista_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_artista`
--

LOCK TABLES `tb_artista` WRITE;
/*!40000 ALTER TABLE `tb_artista` DISABLE KEYS */;
INSERT INTO `tb_artista` VALUES (14,'Senai Music',11,'Artista de música eletrônica');
/*!40000 ALTER TABLE `tb_artista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_artista_genero_musical`
--

DROP TABLE IF EXISTS `tb_artista_genero_musical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_artista_genero_musical` (
  `id_artista_genero_musical` int NOT NULL AUTO_INCREMENT,
  `genero_musical_id` int DEFAULT NULL,
  `artista_id` int DEFAULT NULL,
  PRIMARY KEY (`id_artista_genero_musical`),
  KEY `genero_musical_id` (`genero_musical_id`),
  KEY `artista_id` (`artista_id`),
  CONSTRAINT `tb_artista_genero_musical_ibfk_1` FOREIGN KEY (`genero_musical_id`) REFERENCES `tb_genero_musical` (`id_genero_musical`),
  CONSTRAINT `tb_artista_genero_musical_ibfk_2` FOREIGN KEY (`artista_id`) REFERENCES `tb_artista` (`id_artista`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_artista_genero_musical`
--

LOCK TABLES `tb_artista_genero_musical` WRITE;
/*!40000 ALTER TABLE `tb_artista_genero_musical` DISABLE KEYS */;
INSERT INTO `tb_artista_genero_musical` VALUES (2,10,14),(3,3,14),(4,7,14),(5,1,14);
/*!40000 ALTER TABLE `tb_artista_genero_musical` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_avaliacao_artista`
--

DROP TABLE IF EXISTS `tb_avaliacao_artista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_avaliacao_artista` (
  `id_avaliacao_artista` int NOT NULL AUTO_INCREMENT,
  `numero_estrelas` int NOT NULL,
  `usuario_id` int NOT NULL,
  `artista_id` int NOT NULL,
  `data_avaliacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_avaliacao_artista`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`artista_id`),
  KEY `artista_id` (`artista_id`),
  CONSTRAINT `tb_avaliacao_artista_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `tb_avaliacao_artista_ibfk_2` FOREIGN KEY (`artista_id`) REFERENCES `tb_artista` (`id_artista`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_avaliacao_artista`
--

LOCK TABLES `tb_avaliacao_artista` WRITE;
/*!40000 ALTER TABLE `tb_avaliacao_artista` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_avaliacao_artista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_avaliacao_evento`
--

DROP TABLE IF EXISTS `tb_avaliacao_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_avaliacao_evento` (
  `id_avaliacao_evento` int NOT NULL AUTO_INCREMENT,
  `numero_estrelas` int NOT NULL,
  `usuario_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `data_avaliacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_avaliacao_evento`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`evento_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `tb_avaliacao_evento_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `tb_avaliacao_evento_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_avaliacao_evento`
--

LOCK TABLES `tb_avaliacao_evento` WRITE;
/*!40000 ALTER TABLE `tb_avaliacao_evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_avaliacao_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_endereco`
--

DROP TABLE IF EXISTS `tb_endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_endereco` (
  `id_endereco` int NOT NULL AUTO_INCREMENT,
  `cep` varchar(9) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `bairro` varchar(45) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `logradouro` varchar(255) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `complemento` text,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_usuario` (`usuario_id`),
  CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_endereco`
--

LOCK TABLES `tb_endereco` WRITE;
/*!40000 ALTER TABLE `tb_endereco` DISABLE KEYS */;
INSERT INTO `tb_endereco` VALUES (2,'69919616','Rio Branco','Jardim Primavera','AC','Rua Bouganville','126','Casa Amarela ',NULL,NULL,11),(3,'69919616','Rio Branco','Jardim Primavera','AC','Rua Bouganville','126','Casa Amarela ',NULL,NULL,17),(5,'06695476','Itapevi','Estância São Francisco','SP','Rua Palmira da Conceição','151','',-23.548880,-46.933889,26);
/*!40000 ALTER TABLE `tb_endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_endereco_evento`
--

DROP TABLE IF EXISTS `tb_endereco_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_endereco_evento` (
  `id_endereco_evento` int NOT NULL AUTO_INCREMENT,
  `cep` varchar(9) NOT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `bairro` varchar(45) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `logradouro` varchar(255) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `complemento` text,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `evento_id` int NOT NULL,
  PRIMARY KEY (`id_endereco_evento`),
  KEY `fk_evento_idx` (`evento_id`),
  CONSTRAINT `fk_evento` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_endereco_evento`
--

LOCK TABLES `tb_endereco_evento` WRITE;
/*!40000 ALTER TABLE `tb_endereco_evento` DISABLE KEYS */;
INSERT INTO `tb_endereco_evento` VALUES (6,'06695-476','Itapevi','Estância São Francisco','SP','Rua Palmira da Conceição','123','',-23.548880,-46.933889,6),(7,'06695-476','Itapevi','Estância São Francisco','SP','Rua Palmira da Conceição','124','',-23.548880,-46.933889,7);
/*!40000 ALTER TABLE `tb_endereco_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evento`
--

DROP TABLE IF EXISTS `tb_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evento` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` text,
  `local` varchar(255) DEFAULT NULL,
  `data` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fim` time DEFAULT NULL,
  PRIMARY KEY (`id_evento`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evento`
--

LOCK TABLES `tb_evento` WRITE;
/*!40000 ALTER TABLE `tb_evento` DISABLE KEYS */;
INSERT INTO `tb_evento` VALUES (6,'Noite das Sombras Coloridas','Uma vez a cada 100 anos, todas as sombras do mundo ganham cores próprias e se separam temporariamente de seus donos. Durante uma única noite, elas vagam pelas cidades revelando segredos, memórias esquecidas e desejos ocultos. Algumas sombras se recusam a voltar quando o amanhecer chega.','Balada Noite Escura','2027-09-24','13:00:00','23:00:00'),(7,'Festival das Estrelas Caídas','Um fenômeno misterioso faz pequenas estrelas caírem do céu e pousarem em uma grande praça. Cada estrela concede uma habilidade temporária diferente a quem a tocar: falar com animais, enxergar o futuro por alguns segundos ou alterar a própria aparência. O festival atrai viajantes do mundo inteiro, mas ninguém sabe quem controla as estrelas.','Balada Luzes Noturnas','2026-06-10','09:00:00','12:00:00');
/*!40000 ALTER TABLE `tb_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evento_artista`
--

DROP TABLE IF EXISTS `tb_evento_artista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evento_artista` (
  `id_evento_artista` int NOT NULL AUTO_INCREMENT,
  `artista_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `cache_esperado` decimal(10,2) DEFAULT NULL,
  `cache_ofertado` decimal(10,2) DEFAULT NULL,
  `cache_final` decimal(10,2) DEFAULT NULL,
  `contra_proposta` decimal(10,2) DEFAULT NULL,
  `sobre_artista` text,
  `motivo_inscricao` text,
  PRIMARY KEY (`id_evento_artista`),
  UNIQUE KEY `artista_id` (`artista_id`,`evento_id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `tb_evento_artista_ibfk_1` FOREIGN KEY (`artista_id`) REFERENCES `tb_artista` (`id_artista`) ON DELETE CASCADE,
  CONSTRAINT `tb_evento_artista_ibfk_2` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evento_artista`
--

LOCK TABLES `tb_evento_artista` WRITE;
/*!40000 ALTER TABLE `tb_evento_artista` DISABLE KEYS */;
INSERT INTO `tb_evento_artista` VALUES (12,14,6,1000.00,NULL,NULL,NULL,'Venha cantar, sera muito bem vindo','Proposta enviada pelo organizador');
/*!40000 ALTER TABLE `tb_evento_artista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evento_artista_status`
--

DROP TABLE IF EXISTS `tb_evento_artista_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evento_artista_status` (
  `id_evento_artista_status` int NOT NULL AUTO_INCREMENT,
  `evento_artista_id` int NOT NULL,
  `status_id` int NOT NULL,
  `data_hora` datetime NOT NULL,
  PRIMARY KEY (`id_evento_artista_status`),
  KEY `evento_artista_id` (`evento_artista_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `tb_evento_artista_status_ibfk_1` FOREIGN KEY (`evento_artista_id`) REFERENCES `tb_evento_artista` (`id_evento_artista`) ON DELETE CASCADE,
  CONSTRAINT `tb_evento_artista_status_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `tb_status` (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evento_artista_status`
--

LOCK TABLES `tb_evento_artista_status` WRITE;
/*!40000 ALTER TABLE `tb_evento_artista_status` DISABLE KEYS */;
INSERT INTO `tb_evento_artista_status` VALUES (6,12,1,'2026-06-09 18:43:40');
/*!40000 ALTER TABLE `tb_evento_artista_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evento_organizador`
--

DROP TABLE IF EXISTS `tb_evento_organizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evento_organizador` (
  `id_evento_organizador` int NOT NULL AUTO_INCREMENT,
  `evento_id` int DEFAULT NULL,
  `organizador_id` int DEFAULT NULL,
  `criado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evento_organizador`),
  KEY `evento_id` (`evento_id`),
  KEY `organizador_id` (`organizador_id`),
  CONSTRAINT `tb_evento_organizador_ibfk_1` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE,
  CONSTRAINT `tb_evento_organizador_ibfk_2` FOREIGN KEY (`organizador_id`) REFERENCES `tb_organizador` (`id_organizador`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evento_organizador`
--

LOCK TABLES `tb_evento_organizador` WRITE;
/*!40000 ALTER TABLE `tb_evento_organizador` DISABLE KEYS */;
INSERT INTO `tb_evento_organizador` VALUES (6,6,2,'2026-06-09 18:34:03'),(7,7,2,'2026-06-09 18:39:07');
/*!40000 ALTER TABLE `tb_evento_organizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evento_status`
--

DROP TABLE IF EXISTS `tb_evento_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evento_status` (
  `id_evento_status` int NOT NULL AUTO_INCREMENT,
  `evento_id` int NOT NULL,
  `status_id` int NOT NULL,
  `data_hora` datetime NOT NULL,
  PRIMARY KEY (`id_evento_status`),
  KEY `evento_id` (`evento_id`),
  KEY `tb_evento_status_ibfk_2` (`status_id`),
  CONSTRAINT `tb_evento_status_ibfk_1` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE,
  CONSTRAINT `tb_evento_status_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `tb_status` (`id_status`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evento_status`
--

LOCK TABLES `tb_evento_status` WRITE;
/*!40000 ALTER TABLE `tb_evento_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_evento_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_foto`
--

DROP TABLE IF EXISTS `tb_foto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_foto` (
  `id_foto` int NOT NULL AUTO_INCREMENT,
  `foto` varchar(255) NOT NULL,
  `evento_id` int DEFAULT NULL,
  PRIMARY KEY (`id_foto`),
  KEY `evento_id_idx` (`evento_id`),
  CONSTRAINT `evento_id` FOREIGN KEY (`evento_id`) REFERENCES `tb_evento` (`id_evento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_foto`
--

LOCK TABLES `tb_foto` WRITE;
/*!40000 ALTER TABLE `tb_foto` DISABLE KEYS */;
INSERT INTO `tb_foto` VALUES (7,'https://uploadsonara.blob.core.windows.net/uploadsonara/1781030043524festa-antes-formatura-scaled-1.jpg',6),(8,'https://uploadsonara.blob.core.windows.net/uploadsonara/1781030044132neon-lights-glow-on-blurry-600nw-2723664643.jpg',6),(9,'https://uploadsonara.blob.core.windows.net/uploadsonara/1781030347080baladinha-neon.jpg',7);
/*!40000 ALTER TABLE `tb_foto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_genero`
--

DROP TABLE IF EXISTS `tb_genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_genero` (
  `id_genero` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`id_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_genero`
--

LOCK TABLES `tb_genero` WRITE;
/*!40000 ALTER TABLE `tb_genero` DISABLE KEYS */;
INSERT INTO `tb_genero` VALUES (1,'Masculino'),(2,'Feminino'),(3,'Prefiro nao dizer');
/*!40000 ALTER TABLE `tb_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_genero_musical`
--

DROP TABLE IF EXISTS `tb_genero_musical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_genero_musical` (
  `id_genero_musical` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_genero_musical`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_genero_musical`
--

LOCK TABLES `tb_genero_musical` WRITE;
/*!40000 ALTER TABLE `tb_genero_musical` DISABLE KEYS */;
INSERT INTO `tb_genero_musical` VALUES (1,'Gênero 1'),(2,'Gênero 2'),(3,'Gênero 3'),(7,'Gênero 7'),(9,'Gênero 9'),(10,'Gênero 10');
/*!40000 ALTER TABLE `tb_genero_musical` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_nacionalidade`
--

DROP TABLE IF EXISTS `tb_nacionalidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_nacionalidade` (
  `id_nacionalidade` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_nacionalidade`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_nacionalidade`
--

LOCK TABLES `tb_nacionalidade` WRITE;
/*!40000 ALTER TABLE `tb_nacionalidade` DISABLE KEYS */;
INSERT INTO `tb_nacionalidade` VALUES (1,'Wakandano (Wakanda)'),(2,'Asgardiano (Asgard)'),(3,'Atlan (Atlântida)'),(4,'Kryptoniano (Krypton)'),(5,'Eldiano (Paradis)'),(6,'Gondoriano (Gondor)'),(7,'Estelar (Tatooine)'),(8,'Hogwartiano (Hogwarts)'),(9,'Brasileiro'),(10,'Centauriano (Alpha Centauri)');
/*!40000 ALTER TABLE `tb_nacionalidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_organizador`
--

DROP TABLE IF EXISTS `tb_organizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_organizador` (
  `id_organizador` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id_organizador`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `idx_organizador_usuario_id` (`usuario_id`),
  CONSTRAINT `tb_organizador_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_organizador`
--

LOCK TABLES `tb_organizador` WRITE;
/*!40000 ALTER TABLE `tb_organizador` DISABLE KEYS */;
INSERT INTO `tb_organizador` VALUES (2,26);
/*!40000 ALTER TABLE `tb_organizador` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sonara_adm`@`%`*/ /*!50003 TRIGGER `trg_delete_eventos_do_organizador` BEFORE DELETE ON `tb_organizador` FOR EACH ROW BEGIN

    DELETE FROM tb_evento
    WHERE id_evento IN (
        SELECT evento_id
        FROM tb_evento_organizador
        WHERE organizador_id = OLD.id_organizador
          AND evento_id NOT IN (
              SELECT evento_id
              FROM tb_evento_organizador
              WHERE organizador_id != OLD.id_organizador
          )
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tb_recuperacao_senha`
--

DROP TABLE IF EXISTS `tb_recuperacao_senha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_recuperacao_senha` (
  `id_recuperacao` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `expira_em` datetime NOT NULL,
  `usado` tinyint(1) DEFAULT '0',
  `tentativas` int DEFAULT '0',
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_recuperacao`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tb_recuperacao_senha_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_recuperacao_senha`
--

LOCK TABLES `tb_recuperacao_senha` WRITE;
/*!40000 ALTER TABLE `tb_recuperacao_senha` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_recuperacao_senha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_redes_sociais`
--

DROP TABLE IF EXISTS `tb_redes_sociais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_redes_sociais` (
  `id_redes_sociais` int NOT NULL AUTO_INCREMENT,
  `link` varchar(255) NOT NULL,
  `tipo_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id_redes_sociais`),
  KEY `tipo_id` (`tipo_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tb_redes_sociais_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `tb_tipo_redes_sociais` (`id_tipo_redes_sociais`),
  CONSTRAINT `tb_redes_sociais_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `tb_usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_redes_sociais`
--

LOCK TABLES `tb_redes_sociais` WRITE;
/*!40000 ALTER TABLE `tb_redes_sociais` DISABLE KEYS */;
INSERT INTO `tb_redes_sociais` VALUES (1,'https://www.instagram.com',1,1),(2,'https://twitter.com',2,1),(3,'https://www.youtube.com',3,1),(4,'https://x.com',6,1);
/*!40000 ALTER TABLE `tb_redes_sociais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_status`
--

DROP TABLE IF EXISTS `tb_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_status` (
  `id_status` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_status`
--

LOCK TABLES `tb_status` WRITE;
/*!40000 ALTER TABLE `tb_status` DISABLE KEYS */;
INSERT INTO `tb_status` VALUES (1,'Pendente'),(2,'Aprovado'),(3,'Reprovado'),(4,'Contra proposta'),(5,'Contra proposta aceita'),(6,'Contra proposta recusada'),(7,'Finalizado'),(8,'Cancelado'),(9,'Convite pendente'),(10,'Convite aceito'),(11,'Convite recusado');
/*!40000 ALTER TABLE `tb_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tipo_redes_sociais`
--

DROP TABLE IF EXISTS `tb_tipo_redes_sociais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_tipo_redes_sociais` (
  `id_tipo_redes_sociais` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tipo_redes_sociais`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tipo_redes_sociais`
--

LOCK TABLES `tb_tipo_redes_sociais` WRITE;
/*!40000 ALTER TABLE `tb_tipo_redes_sociais` DISABLE KEYS */;
INSERT INTO `tb_tipo_redes_sociais` VALUES (1,'Instagram'),(2,'Twitter'),(3,'YouTube'),(6,'X');
/*!40000 ALTER TABLE `tb_tipo_redes_sociais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_usuario`
--

DROP TABLE IF EXISTS `tb_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `data_nasc` date NOT NULL,
  `nacionalidade_id` int NOT NULL,
  `genero_id` int NOT NULL,
  `criado` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultima_atualizacao` datetime DEFAULT NULL,
  `telefone` varchar(45) DEFAULT NULL,
  `foto` text,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `nacionalidade_id` (`nacionalidade_id`),
  KEY `genero_id` (`genero_id`),
  KEY `idx_usuario_email` (`email`),
  CONSTRAINT `tb_usuario_ibfk_1` FOREIGN KEY (`nacionalidade_id`) REFERENCES `tb_nacionalidade` (`id_nacionalidade`),
  CONSTRAINT `tb_usuario_ibfk_3` FOREIGN KEY (`genero_id`) REFERENCES `tb_genero` (`id_genero`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_usuario`
--

LOCK TABLES `tb_usuario` WRITE;
/*!40000 ALTER TABLE `tb_usuario` DISABLE KEYS */;
INSERT INTO `tb_usuario` VALUES (1,'Artista Principal','artista@gmail.com','senha123','123.456.789-00','2000-01-01',1,1,'2026-06-09 11:00:00','2026-06-09 11:00:00','(11) 99999-9999','avatar.png'),(11,'Usuário Comum','usuario1@gmail.com','3809653510af154bda70cad2f5c1ba9f:38fcae8aa465caaaaee131ac7c1cae51e515cdadd3e98d1ff8f5c0af4a225a603bf8fafa17e3ac9c094332c2683bb43bc83b24aa24dfbc228e80302dfa2d7ef5','41622812034','1980-06-26',9,1,'2026-06-09 14:34:21','2026-06-09 14:34:24','11123456789','https://uploadsonara.blob.core.windows.net/uploadsonara/35ff950d-4893-4d34-8bdd-1348d5437d27.jpg?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-06-25T21:38:12Z&st=2026-05-25T13:23:12Z&spr=https&sig=h%2FB05l53hMkplEEsYJtwp%2FxKCPhiKZgoGqZ5jRkQV30%3D'),(17,'User Visualizador','usuario@gmail.com','f1ce7a7934538fd64b2344b34ebf034f:a5db9c49e51f4dc7b9891fd4c90783e3468639894d75ba2a3c9e12a4074bdffad8d4be331a15009098c95d2e280fc6f985e21fbc888be9e74c63e453f276c4cd','50621094340','1980-06-26',2,1,'2026-06-09 15:18:02','2026-06-09 15:18:04','11123456789','https://uploadsonara.blob.core.windows.net/uploadsonara/f880190b-f40c-4524-9005-962a7a452ec0.jpg?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-06-25T21:38:12Z&st=2026-05-25T13:23:12Z&spr=https&sig=h%2FB05l53hMkplEEsYJtwp%2FxKCPhiKZgoGqZ5jRkQV30%3D'),(26,'Pedro Henrique','organizador@gmail.com','9025bea72967916e797b1e5dac19cec0:54736fcd1907808ea91cb26ecf1e82b5d75c09d7cf84ba096c6c203c6c468a42b58df8a716aedde6be5762ae014e4bdf069ab71b8f5d143788a45bb3ccd0330b','41972965840','2008-06-09',9,1,'2026-06-09 18:30:22','2026-06-09 18:30:22','1198','https://uploadsonara.blob.core.windows.net/uploadsonara/0faca470-d790-4f1d-8588-694fb628b97f.jpg?sv=2026-02-06&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-06-25T21:38:12Z&st=2026-05-25T13:23:12Z&spr=https&sig=h%2FB05l53hMkplEEsYJtwp%2FxKCPhiKZgoGqZ5jRkQV30%3D');
/*!40000 ALTER TABLE `tb_usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sonara_adm`@`%`*/ /*!50003 TRIGGER `trg_usuario_ultima_atualizacao` BEFORE UPDATE ON `tb_usuario` FOR EACH ROW BEGIN
    SET NEW.ultima_atualizacao = NOW();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `vw_evento`
--

DROP TABLE IF EXISTS `vw_evento`;
/*!50001 DROP VIEW IF EXISTS `vw_evento`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_evento` AS SELECT 
 1 AS `id_evento`,
 1 AS `organizador_id`,
 1 AS `evento_nome`,
 1 AS `descricao`,
 1 AS `local`,
 1 AS `data`,
 1 AS `hora_inicio`,
 1 AS `hora_fim`,
 1 AS `cep`,
 1 AS `logradouro`,
 1 AS `numero`,
 1 AS `complemento`,
 1 AS `bairro`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `status_atual`,
 1 AS `data_status`,
 1 AS `organizador_nome`,
 1 AS `organizador_email`,
 1 AS `artistas`,
 1 AS `cache_final`,
 1 AS `sobre_artista`,
 1 AS `media_avaliacao`,
 1 AS `total_avaliacoes`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_evento_artista_completo`
--

DROP TABLE IF EXISTS `vw_evento_artista_completo`;
/*!50001 DROP VIEW IF EXISTS `vw_evento_artista_completo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_evento_artista_completo` AS SELECT 
 1 AS `id_evento`,
 1 AS `evento_nome`,
 1 AS `evento_descricao`,
 1 AS `local`,
 1 AS `data`,
 1 AS `hora_inicio`,
 1 AS `hora_fim`,
 1 AS `id_organizador`,
 1 AS `organizador_usuario_id`,
 1 AS `organizador_nome`,
 1 AS `organizador_email`,
 1 AS `organizador_telefone`,
 1 AS `organizador_foto`,
 1 AS `endereco`,
 1 AS `fotos`,
 1 AS `status_evento`,
 1 AS `media_avaliacao_evento`,
 1 AS `total_avaliacoes_evento`,
 1 AS `evento_artistas`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_evento_artista_inscritos`
--

DROP TABLE IF EXISTS `vw_evento_artista_inscritos`;
/*!50001 DROP VIEW IF EXISTS `vw_evento_artista_inscritos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_evento_artista_inscritos` AS SELECT 
 1 AS `id_evento_artista`,
 1 AS `artista_id`,
 1 AS `evento_id`,
 1 AS `evento_nome`,
 1 AS `cache_esperado`,
 1 AS `cache_ofertado`,
 1 AS `cache_final`,
 1 AS `contra_proposta`,
 1 AS `sobre_artista`,
 1 AS `motivo_inscricao`,
 1 AS `nome_artistico`,
 1 AS `descricao_artista`,
 1 AS `usuario_id`,
 1 AS `nome_artista`,
 1 AS `email_artista`,
 1 AS `telefone`,
 1 AS `foto_artista`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `status_atual`,
 1 AS `status_nome`,
 1 AS `status_data_hora`,
 1 AS `media_avaliacao`,
 1 AS `total_avaliacoes`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_evento_fotos`
--

DROP TABLE IF EXISTS `vw_evento_fotos`;
/*!50001 DROP VIEW IF EXISTS `vw_evento_fotos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_evento_fotos` AS SELECT 
 1 AS `id_foto`,
 1 AS `url_foto`,
 1 AS `id_evento`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuario`
--

DROP TABLE IF EXISTS `vw_usuario`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuario` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `cpf`,
 1 AS `data_nasc`,
 1 AS `telefone`,
 1 AS `foto`,
 1 AS `criado`,
 1 AS `ultima_atualizacao`,
 1 AS `genero`,
 1 AS `nacionalidade`,
 1 AS `cep`,
 1 AS `logradouro`,
 1 AS `numero`,
 1 AS `complemento`,
 1 AS `bairro`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `rede_social_link`,
 1 AS `rede_social_tipo`,
 1 AS `nome_artistico`,
 1 AS `sobre_artista`,
 1 AS `artista_id`,
 1 AS `tipo_usuario`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuario_com_senha`
--

DROP TABLE IF EXISTS `vw_usuario_com_senha`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_com_senha`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuario_com_senha` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `senha`,
 1 AS `cpf`,
 1 AS `data_nasc`,
 1 AS `telefone`,
 1 AS `criado`,
 1 AS `ultima_atualizacao`,
 1 AS `genero_id`,
 1 AS `nacionalidade_id`,
 1 AS `genero`,
 1 AS `nacionalidade`,
 1 AS `cep`,
 1 AS `logradouro`,
 1 AS `numero`,
 1 AS `complemento`,
 1 AS `bairro`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `foto_url`,
 1 AS `rede_social_link`,
 1 AS `rede_social_tipo`,
 1 AS `nome_artistico`,
 1 AS `descricao_artista`,
 1 AS `id_artista`,
 1 AS `tipo_usuario`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuario_completo`
--

DROP TABLE IF EXISTS `vw_usuario_completo`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_completo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuario_completo` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `cpf`,
 1 AS `data_nasc`,
 1 AS `telefone`,
 1 AS `foto`,
 1 AS `criado`,
 1 AS `ultima_atualizacao`,
 1 AS `genero_id`,
 1 AS `genero_nome`,
 1 AS `nacionalidade_id`,
 1 AS `nacionalidade_nome`,
 1 AS `id_endereco`,
 1 AS `cep`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `logradouro`,
 1 AS `numero`,
 1 AS `complemento`,
 1 AS `bairro`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `redes_sociais`,
 1 AS `tipo_usuario`,
 1 AS `id_artista`,
 1 AS `nome_artistico`,
 1 AS `descricao_artista`,
 1 AS `generos_musicais`,
 1 AS `media_avaliacao_artista`,
 1 AS `total_avaliacoes_artista`,
 1 AS `eventos_artista`,
 1 AS `id_organizador`,
 1 AS `eventos_organizador`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuario_endereco`
--

DROP TABLE IF EXISTS `vw_usuario_endereco`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_endereco`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuario_endereco` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `cpf`,
 1 AS `telefone`,
 1 AS `foto`,
 1 AS `id_endereco`,
 1 AS `cep`,
 1 AS `cidade`,
 1 AS `estado`,
 1 AS `logradouro`,
 1 AS `numero`,
 1 AS `complemento`,
 1 AS `bairro`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuario_login`
--

DROP TABLE IF EXISTS `vw_usuario_login`;
/*!50001 DROP VIEW IF EXISTS `vw_usuario_login`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuario_login` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `foto`,
 1 AS `tipo_usuario`,
 1 AS `id_artista`,
 1 AS `id_organizador`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'sonara_db'
--

--
-- Dumping routines for database 'sonara_db'
--

--
-- Final view structure for view `vw_evento`
--

/*!50001 DROP VIEW IF EXISTS `vw_evento`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_evento` AS select `ev`.`id_evento` AS `id_evento`,`eo`.`organizador_id` AS `organizador_id`,`ev`.`nome` AS `evento_nome`,`ev`.`descricao` AS `descricao`,`ev`.`local` AS `local`,`ev`.`data` AS `data`,`ev`.`hora_inicio` AS `hora_inicio`,`ev`.`hora_fim` AS `hora_fim`,`ee`.`cep` AS `cep`,`ee`.`logradouro` AS `logradouro`,`ee`.`numero` AS `numero`,`ee`.`complemento` AS `complemento`,`ee`.`bairro` AS `bairro`,`ee`.`cidade` AS `cidade`,`ee`.`estado` AS `estado`,`ee`.`latitude` AS `latitude`,`ee`.`longitude` AS `longitude`,`st`.`nome` AS `status_atual`,`es`.`data_hora` AS `data_status`,`u`.`nome` AS `organizador_nome`,`u`.`email` AS `organizador_email`,group_concat(distinct `art`.`nome_artistico` separator ', ') AS `artistas`,max(`ea`.`cache_final`) AS `cache_final`,max(`ea`.`sobre_artista`) AS `sobre_artista`,coalesce(`av`.`media_avaliacao`,0) AS `media_avaliacao`,coalesce(`av`.`total_avaliacoes`,0) AS `total_avaliacoes` from (((((((((`tb_evento` `ev` left join `tb_endereco_evento` `ee` on((`ee`.`evento_id` = `ev`.`id_evento`))) left join `tb_evento_status` `es` on(((`es`.`evento_id` = `ev`.`id_evento`) and (`es`.`data_hora` = (select max(`es2`.`data_hora`) from `tb_evento_status` `es2` where (`es2`.`evento_id` = `ev`.`id_evento`)))))) left join `tb_status` `st` on((`st`.`id_status` = `es`.`status_id`))) left join `tb_evento_organizador` `eo` on((`eo`.`evento_id` = `ev`.`id_evento`))) left join `tb_organizador` `org` on((`org`.`id_organizador` = `eo`.`organizador_id`))) left join `tb_usuario` `u` on((`u`.`id_usuario` = `org`.`usuario_id`))) left join `tb_evento_artista` `ea` on((`ea`.`evento_id` = `ev`.`id_evento`))) left join `tb_artista` `art` on((`art`.`id_artista` = `ea`.`artista_id`))) left join (select `tb_avaliacao_evento`.`evento_id` AS `evento_id`,round(avg(`tb_avaliacao_evento`.`numero_estrelas`),1) AS `media_avaliacao`,count(0) AS `total_avaliacoes` from `tb_avaliacao_evento` group by `tb_avaliacao_evento`.`evento_id`) `av` on((`av`.`evento_id` = `ev`.`id_evento`))) group by `ev`.`id_evento`,`eo`.`organizador_id`,`ev`.`nome`,`ev`.`descricao`,`ev`.`local`,`ev`.`data`,`ev`.`hora_inicio`,`ev`.`hora_fim`,`ee`.`cep`,`ee`.`logradouro`,`ee`.`numero`,`ee`.`complemento`,`ee`.`bairro`,`ee`.`cidade`,`ee`.`estado`,`ee`.`latitude`,`ee`.`longitude`,`st`.`nome`,`es`.`data_hora`,`u`.`nome`,`u`.`email`,`av`.`media_avaliacao`,`av`.`total_avaliacoes` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_evento_artista_completo`
--

/*!50001 DROP VIEW IF EXISTS `vw_evento_artista_completo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_evento_artista_completo` AS select `ev`.`id_evento` AS `id_evento`,`ev`.`nome` AS `evento_nome`,`ev`.`descricao` AS `evento_descricao`,`ev`.`local` AS `local`,`ev`.`data` AS `data`,`ev`.`hora_inicio` AS `hora_inicio`,`ev`.`hora_fim` AS `hora_fim`,`org`.`id_organizador` AS `id_organizador`,`uo`.`id_usuario` AS `organizador_usuario_id`,`uo`.`nome` AS `organizador_nome`,`uo`.`email` AS `organizador_email`,`uo`.`telefone` AS `organizador_telefone`,`uo`.`foto` AS `organizador_foto`,(select json_object('id_endereco_evento',`ee`.`id_endereco_evento`,'cep',`ee`.`cep`,'cidade',`ee`.`cidade`,'estado',`ee`.`estado`,'logradouro',`ee`.`logradouro`,'numero',`ee`.`numero`,'complemento',`ee`.`complemento`,'bairro',`ee`.`bairro`,'latitude',`ee`.`latitude`,'longitude',`ee`.`longitude`) from `tb_endereco_evento` `ee` where (`ee`.`evento_id` = `ev`.`id_evento`) limit 1) AS `endereco`,coalesce((select json_arrayagg(json_object('id_foto',`f`.`id_foto`,'url',`f`.`foto`)) from `tb_foto` `f` where (`f`.`evento_id` = `ev`.`id_evento`)),json_array()) AS `fotos`,(select json_object('id_status',`s`.`id_status`,'nome',`s`.`nome`,'data_hora',`es`.`data_hora`) from (`tb_evento_status` `es` join `tb_status` `s` on((`s`.`id_status` = `es`.`status_id`))) where (`es`.`evento_id` = `ev`.`id_evento`) order by `es`.`data_hora` desc limit 1) AS `status_evento`,(select round(avg(`ae`.`numero_estrelas`),1) from `tb_avaliacao_evento` `ae` where (`ae`.`evento_id` = `ev`.`id_evento`)) AS `media_avaliacao_evento`,(select count(0) from `tb_avaliacao_evento` `ae` where (`ae`.`evento_id` = `ev`.`id_evento`)) AS `total_avaliacoes_evento`,coalesce((select json_arrayagg(json_object('id_evento_artista',`ea`.`id_evento_artista`,'artista_id',`art`.`id_artista`,'evento_id',`ea`.`evento_id`,'artista',json_object('id_usuario',`ua`.`id_usuario`,'nome',`ua`.`nome`,'email',`ua`.`email`,'telefone',`ua`.`telefone`,'foto',`ua`.`foto`,'nome_artistico',`art`.`nome_artistico`,'descricao',`art`.`descricao`,'generos_musicais',coalesce((select json_arrayagg(json_object('id',`gm`.`id_genero_musical`,'nome',`gm`.`nome`)) from (`tb_artista_genero_musical` `agm` join `tb_genero_musical` `gm` on((`gm`.`id_genero_musical` = `agm`.`genero_musical_id`))) where ((`agm`.`artista_id` = `art`.`id_artista`) and (`agm`.`genero_musical_id` is not null))),json_array()),'redes_sociais',coalesce((select json_arrayagg(json_object('id',`rs`.`id_redes_sociais`,'link',`rs`.`link`,'tipo_id',`rs`.`tipo_id`,'tipo',`trs`.`nome`)) from (`tb_redes_sociais` `rs` join `tb_tipo_redes_sociais` `trs` on((`trs`.`id_tipo_redes_sociais` = `rs`.`tipo_id`))) where (`rs`.`usuario_id` = `ua`.`id_usuario`)),json_array())),'cache',json_object('esperado',`ea`.`cache_esperado`,'ofertado',`ea`.`cache_ofertado`,'final',`ea`.`cache_final`,'contra_proposta',`ea`.`contra_proposta`),'informacoes',json_object('sobre_artista',`ea`.`sobre_artista`,'motivo_inscricao',nullif(`ea`.`motivo_inscricao`,'null')),'status',(select json_object('id_status',`s`.`id_status`,'nome',`s`.`nome`,'data_hora',`eas`.`data_hora`) from (`tb_evento_artista_status` `eas` join `tb_status` `s` on((`s`.`id_status` = `eas`.`status_id`))) where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`data_hora` desc limit 1),'avaliacao',json_object('media',(select round(avg(`av`.`numero_estrelas`),1) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `art`.`id_artista`)),'total',(select count(0) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `art`.`id_artista`))))) from ((`tb_evento_artista` `ea` join `tb_artista` `art` on((`art`.`id_artista` = `ea`.`artista_id`))) join `tb_usuario` `ua` on((`ua`.`id_usuario` = `art`.`usuario_id`))) where (`ea`.`evento_id` = `ev`.`id_evento`)),json_array()) AS `evento_artistas` from (((`tb_evento` `ev` left join `tb_evento_organizador` `eo` on((`eo`.`evento_id` = `ev`.`id_evento`))) left join `tb_organizador` `org` on((`org`.`id_organizador` = `eo`.`organizador_id`))) left join `tb_usuario` `uo` on((`uo`.`id_usuario` = `org`.`usuario_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_evento_artista_inscritos`
--

/*!50001 DROP VIEW IF EXISTS `vw_evento_artista_inscritos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_evento_artista_inscritos` AS select `ea`.`id_evento_artista` AS `id_evento_artista`,`ea`.`artista_id` AS `artista_id`,`ea`.`evento_id` AS `evento_id`,`ev`.`nome` AS `evento_nome`,`ea`.`cache_esperado` AS `cache_esperado`,`ea`.`cache_ofertado` AS `cache_ofertado`,`ea`.`cache_final` AS `cache_final`,`ea`.`contra_proposta` AS `contra_proposta`,`ea`.`sobre_artista` AS `sobre_artista`,nullif(`ea`.`motivo_inscricao`,'null') AS `motivo_inscricao`,`a`.`nome_artistico` AS `nome_artistico`,`a`.`descricao` AS `descricao_artista`,`u`.`id_usuario` AS `usuario_id`,`u`.`nome` AS `nome_artista`,`u`.`email` AS `email_artista`,`u`.`telefone` AS `telefone`,`u`.`foto` AS `foto_artista`,(select `e`.`cidade` from `tb_endereco` `e` where (`e`.`usuario_id` = `u`.`id_usuario`) order by `e`.`id_endereco` desc limit 1) AS `cidade`,(select `e`.`estado` from `tb_endereco` `e` where (`e`.`usuario_id` = `u`.`id_usuario`) order by `e`.`id_endereco` desc limit 1) AS `estado`,(select `eas`.`status_id` from `tb_evento_artista_status` `eas` where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`id_evento_artista_status` desc limit 1) AS `status_atual`,(select `s`.`nome` from (`tb_evento_artista_status` `eas` join `tb_status` `s` on((`s`.`id_status` = `eas`.`status_id`))) where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`id_evento_artista_status` desc limit 1) AS `status_nome`,(select `eas`.`data_hora` from `tb_evento_artista_status` `eas` where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`id_evento_artista_status` desc limit 1) AS `status_data_hora`,(select round(avg(`av`.`numero_estrelas`),1) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `a`.`id_artista`)) AS `media_avaliacao`,(select count(0) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `a`.`id_artista`)) AS `total_avaliacoes` from (((`tb_evento_artista` `ea` join `tb_evento` `ev` on((`ev`.`id_evento` = `ea`.`evento_id`))) join `tb_artista` `a` on((`a`.`id_artista` = `ea`.`artista_id`))) join `tb_usuario` `u` on((`u`.`id_usuario` = `a`.`usuario_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_evento_fotos`
--

/*!50001 DROP VIEW IF EXISTS `vw_evento_fotos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_evento_fotos` AS select `f`.`id_foto` AS `id_foto`,`f`.`foto` AS `url_foto`,`f`.`evento_id` AS `id_evento` from `tb_foto` `f` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`cpf` AS `cpf`,`u`.`data_nasc` AS `data_nasc`,`u`.`telefone` AS `telefone`,`u`.`foto` AS `foto`,`u`.`criado` AS `criado`,`u`.`ultima_atualizacao` AS `ultima_atualizacao`,`g`.`nome` AS `genero`,`n`.`nome` AS `nacionalidade`,`e`.`cep` AS `cep`,`e`.`logradouro` AS `logradouro`,`e`.`numero` AS `numero`,`e`.`complemento` AS `complemento`,`e`.`bairro` AS `bairro`,`e`.`cidade` AS `cidade`,`e`.`estado` AS `estado`,`e`.`latitude` AS `latitude`,`e`.`longitude` AS `longitude`,`rs`.`link` AS `rede_social_link`,`trs`.`nome` AS `rede_social_tipo`,`art`.`nome_artistico` AS `nome_artistico`,`art`.`descricao` AS `sobre_artista`,`art`.`id_artista` AS `artista_id`,(case when (`art`.`id_artista` is not null) then ('Artista' collate utf8mb4_general_ci) when (`org`.`id_organizador` is not null) then ('Organizador' collate utf8mb4_general_ci) else ('Usuário' collate utf8mb4_general_ci) end) AS `tipo_usuario` from (((((((`tb_usuario` `u` left join `tb_genero` `g` on((`g`.`id_genero` = `u`.`genero_id`))) left join `tb_nacionalidade` `n` on((`n`.`id_nacionalidade` = `u`.`nacionalidade_id`))) left join `tb_endereco` `e` on((`e`.`usuario_id` = `u`.`id_usuario`))) left join `tb_redes_sociais` `rs` on((`rs`.`usuario_id` = `u`.`id_usuario`))) left join `tb_tipo_redes_sociais` `trs` on((`trs`.`id_tipo_redes_sociais` = `rs`.`tipo_id`))) left join `tb_artista` `art` on((`art`.`usuario_id` = `u`.`id_usuario`))) left join `tb_organizador` `org` on((`org`.`usuario_id` = `u`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_com_senha`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_com_senha`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_com_senha` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`senha` AS `senha`,`u`.`cpf` AS `cpf`,`u`.`data_nasc` AS `data_nasc`,`u`.`telefone` AS `telefone`,`u`.`criado` AS `criado`,`u`.`ultima_atualizacao` AS `ultima_atualizacao`,`u`.`genero_id` AS `genero_id`,`u`.`nacionalidade_id` AS `nacionalidade_id`,`g`.`nome` AS `genero`,`n`.`nome` AS `nacionalidade`,`e`.`cep` AS `cep`,`e`.`logradouro` AS `logradouro`,`e`.`numero` AS `numero`,`e`.`complemento` AS `complemento`,`e`.`bairro` AS `bairro`,`e`.`cidade` AS `cidade`,`e`.`estado` AS `estado`,`e`.`latitude` AS `latitude`,`e`.`longitude` AS `longitude`,`u`.`foto` AS `foto_url`,`rs`.`link` AS `rede_social_link`,`trs`.`nome` AS `rede_social_tipo`,`art`.`nome_artistico` AS `nome_artistico`,`art`.`descricao` AS `descricao_artista`,`art`.`id_artista` AS `id_artista`,(case when (`art`.`id_artista` is not null) then 'Artista' when (`org`.`id_organizador` is not null) then 'Organizador' else 'Usuário' end) AS `tipo_usuario` from (((((((`tb_usuario` `u` left join `tb_genero` `g` on((`g`.`id_genero` = `u`.`genero_id`))) left join `tb_nacionalidade` `n` on((`n`.`id_nacionalidade` = `u`.`nacionalidade_id`))) left join `tb_endereco` `e` on((`e`.`usuario_id` = `u`.`id_usuario`))) left join `tb_redes_sociais` `rs` on((`rs`.`usuario_id` = `u`.`id_usuario`))) left join `tb_tipo_redes_sociais` `trs` on((`trs`.`id_tipo_redes_sociais` = `rs`.`tipo_id`))) left join `tb_artista` `art` on((`art`.`usuario_id` = `u`.`id_usuario`))) left join `tb_organizador` `org` on((`org`.`usuario_id` = `u`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_completo`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_completo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_completo` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`cpf` AS `cpf`,`u`.`data_nasc` AS `data_nasc`,`u`.`telefone` AS `telefone`,`u`.`foto` AS `foto`,`u`.`criado` AS `criado`,`u`.`ultima_atualizacao` AS `ultima_atualizacao`,`u`.`genero_id` AS `genero_id`,`g`.`nome` AS `genero_nome`,`u`.`nacionalidade_id` AS `nacionalidade_id`,`n`.`nome` AS `nacionalidade_nome`,`e`.`id_endereco` AS `id_endereco`,`e`.`cep` AS `cep`,`e`.`cidade` AS `cidade`,`e`.`estado` AS `estado`,`e`.`logradouro` AS `logradouro`,`e`.`numero` AS `numero`,`e`.`complemento` AS `complemento`,`e`.`bairro` AS `bairro`,`e`.`latitude` AS `latitude`,`e`.`longitude` AS `longitude`,coalesce((select json_arrayagg(json_object('id',`rs`.`id_redes_sociais`,'link',`rs`.`link`,'tipo_id',`rs`.`tipo_id`,'tipo',`trs`.`nome`)) from (`tb_redes_sociais` `rs` join `tb_tipo_redes_sociais` `trs` on((`trs`.`id_tipo_redes_sociais` = `rs`.`tipo_id`))) where (`rs`.`usuario_id` = `u`.`id_usuario`)),json_array()) AS `redes_sociais`,(case when (`art`.`id_artista` is not null) then 'Artista' when (`org`.`id_organizador` is not null) then 'Organizador' else 'Usuario' end) AS `tipo_usuario`,`art`.`id_artista` AS `id_artista`,`art`.`nome_artistico` AS `nome_artistico`,`art`.`descricao` AS `descricao_artista`,coalesce((select json_arrayagg(json_object('id',`gm`.`id_genero_musical`,'nome',`gm`.`nome`)) from (`tb_artista_genero_musical` `agm` join `tb_genero_musical` `gm` on((`gm`.`id_genero_musical` = `agm`.`genero_musical_id`))) where ((`agm`.`artista_id` = `art`.`id_artista`) and (`agm`.`genero_musical_id` is not null))),json_array()) AS `generos_musicais`,(select round(avg(`av`.`numero_estrelas`),1) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `art`.`id_artista`)) AS `media_avaliacao_artista`,(select count(0) from `tb_avaliacao_artista` `av` where (`av`.`artista_id` = `art`.`id_artista`)) AS `total_avaliacoes_artista`,coalesce((select json_arrayagg(json_object('id_evento_artista',`ea`.`id_evento_artista`,'id_evento',`ev`.`id_evento`,'nome',`ev`.`nome`,'descricao',`ev`.`descricao`,'local',`ev`.`local`,'data',`ev`.`data`,'hora_inicio',`ev`.`hora_inicio`,'hora_fim',`ev`.`hora_fim`,'cache',json_object('cache_esperado',`ea`.`cache_esperado`,'cache_ofertado',`ea`.`cache_ofertado`,'cache_final',`ea`.`cache_final`,'contra_proposta',`ea`.`contra_proposta`),'sobre_artista',`ea`.`sobre_artista`,'motivo_inscricao',nullif(`ea`.`motivo_inscricao`,'null'),'status',(select json_object('id_status',`s`.`id_status`,'nome',`s`.`nome`,'data_hora',`eas`.`data_hora`) from (`tb_evento_artista_status` `eas` join `tb_status` `s` on((`s`.`id_status` = `eas`.`status_id`))) where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`data_hora` desc limit 1),'endereco',(select json_object('id_endereco_evento',`ee`.`id_endereco_evento`,'cep',`ee`.`cep`,'cidade',`ee`.`cidade`,'estado',`ee`.`estado`,'logradouro',`ee`.`logradouro`,'numero',`ee`.`numero`,'complemento',`ee`.`complemento`,'bairro',`ee`.`bairro`,'latitude',`ee`.`latitude`,'longitude',`ee`.`longitude`) from `tb_endereco_evento` `ee` where (`ee`.`evento_id` = `ev`.`id_evento`) limit 1),'fotos',coalesce((select json_arrayagg(json_object('id_foto',`f`.`id_foto`,'url',`f`.`foto`)) from `tb_foto` `f` where (`f`.`evento_id` = `ev`.`id_evento`)),json_array()))) from (`tb_evento_artista` `ea` join `tb_evento` `ev` on((`ev`.`id_evento` = `ea`.`evento_id`))) where (`ea`.`artista_id` = `art`.`id_artista`)),json_array()) AS `eventos_artista`,`org`.`id_organizador` AS `id_organizador`,coalesce((select json_arrayagg(json_object('id_evento_organizador',`eo`.`id_evento_organizador`,'id_evento',`ev`.`id_evento`,'nome',`ev`.`nome`,'descricao',`ev`.`descricao`,'local',`ev`.`local`,'data',`ev`.`data`,'hora_inicio',`ev`.`hora_inicio`,'hora_fim',`ev`.`hora_fim`,'criado',`eo`.`criado`,'status',(select json_object('id_status',`s`.`id_status`,'nome',`s`.`nome`,'data_hora',`es`.`data_hora`) from (`tb_evento_status` `es` join `tb_status` `s` on((`s`.`id_status` = `es`.`status_id`))) where (`es`.`evento_id` = `ev`.`id_evento`) order by `es`.`data_hora` desc limit 1),'endereco',(select json_object('id_endereco_evento',`ee`.`id_endereco_evento`,'cep',`ee`.`cep`,'cidade',`ee`.`cidade`,'estado',`ee`.`estado`,'logradouro',`ee`.`logradouro`,'numero',`ee`.`numero`,'complemento',`ee`.`complemento`,'bairro',`ee`.`bairro`,'latitude',`ee`.`latitude`,'longitude',`ee`.`longitude`) from `tb_endereco_evento` `ee` where (`ee`.`evento_id` = `ev`.`id_evento`) limit 1),'fotos',coalesce((select json_arrayagg(json_object('id_foto',`f`.`id_foto`,'url',`f`.`foto`)) from `tb_foto` `f` where (`f`.`evento_id` = `ev`.`id_evento`)),json_array()),'artistas',coalesce((select json_arrayagg(json_object('id_evento_artista',`ea`.`id_evento_artista`,'id_artista',`a`.`id_artista`,'nome_artistico',`a`.`nome_artistico`,'descricao',`a`.`descricao`,'cache',json_object('cache_esperado',`ea`.`cache_esperado`,'cache_ofertado',`ea`.`cache_ofertado`,'cache_final',`ea`.`cache_final`,'contra_proposta',`ea`.`contra_proposta`),'sobre_artista',`ea`.`sobre_artista`,'motivo_inscricao',nullif(`ea`.`motivo_inscricao`,'null'),'status',(select json_object('id_status',`s`.`id_status`,'nome',`s`.`nome`,'data_hora',`eas`.`data_hora`) from (`tb_evento_artista_status` `eas` join `tb_status` `s` on((`s`.`id_status` = `eas`.`status_id`))) where (`eas`.`evento_artista_id` = `ea`.`id_evento_artista`) order by `eas`.`data_hora` desc limit 1))) from (`tb_evento_artista` `ea` join `tb_artista` `a` on((`a`.`id_artista` = `ea`.`artista_id`))) where (`ea`.`evento_id` = `ev`.`id_evento`)),json_array()),'media_avaliacao',(select round(avg(`ae`.`numero_estrelas`),1) from `tb_avaliacao_evento` `ae` where (`ae`.`evento_id` = `ev`.`id_evento`)),'total_avaliacoes',(select count(0) from `tb_avaliacao_evento` `ae` where (`ae`.`evento_id` = `ev`.`id_evento`)))) from (`tb_evento_organizador` `eo` join `tb_evento` `ev` on((`ev`.`id_evento` = `eo`.`evento_id`))) where (`eo`.`organizador_id` = `org`.`id_organizador`)),json_array()) AS `eventos_organizador` from (((((`tb_usuario` `u` join `tb_genero` `g` on((`g`.`id_genero` = `u`.`genero_id`))) join `tb_nacionalidade` `n` on((`n`.`id_nacionalidade` = `u`.`nacionalidade_id`))) left join `tb_endereco` `e` on((`e`.`usuario_id` = `u`.`id_usuario`))) left join `tb_artista` `art` on((`art`.`usuario_id` = `u`.`id_usuario`))) left join `tb_organizador` `org` on((`org`.`usuario_id` = `u`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_endereco`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_endereco`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_endereco` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`cpf` AS `cpf`,`u`.`telefone` AS `telefone`,`u`.`foto` AS `foto`,`e`.`id_endereco` AS `id_endereco`,`e`.`cep` AS `cep`,`e`.`cidade` AS `cidade`,`e`.`estado` AS `estado`,`e`.`logradouro` AS `logradouro`,`e`.`numero` AS `numero`,`e`.`complemento` AS `complemento`,`e`.`bairro` AS `bairro` from (`tb_usuario` `u` left join `tb_endereco` `e` on((`e`.`usuario_id` = `u`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuario_login`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuario_login`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`sonara_adm`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuario_login` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`foto` AS `foto`,(case when (`art`.`id_artista` is not null) then 'Artista' when (`org`.`id_organizador` is not null) then 'Organizador' else 'Usuario' end) AS `tipo_usuario`,`art`.`id_artista` AS `id_artista`,`org`.`id_organizador` AS `id_organizador` from ((`tb_usuario` `u` left join `tb_artista` `art` on((`art`.`usuario_id` = `u`.`id_usuario`))) left join `tb_organizador` `org` on((`org`.`usuario_id` = `u`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-09 15:58:10
