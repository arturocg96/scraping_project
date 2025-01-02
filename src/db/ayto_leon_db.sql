-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `ayto_leon_db`;
USE `ayto_leon_db`;

-- ====================================
-- Tabla: Eventos generales
-- ====================================
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL AUTO_INCREMENT,              -- Identificador único
  `title` VARCHAR(255) NOT NULL,                -- Título del evento
  `event_date` VARCHAR(255) NOT NULL,           -- Fecha del evento
  `event_time` VARCHAR(10) DEFAULT NULL,        -- Hora del evento
  `location` VARCHAR(255) DEFAULT NULL,         -- Ubicación del evento
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_event` (`event_date`, `event_time`, `title`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- Tabla: Eventos de agenda
-- ====================================
CREATE TABLE IF NOT EXISTS `agenda_events` (
  `id` INT NOT NULL AUTO_INCREMENT,              -- Identificador único
  `title` VARCHAR(255) NOT NULL,                -- Título del evento de agenda
  `event_date` VARCHAR(255) NOT NULL,           -- Fecha del evento de agenda
  `event_time` VARCHAR(10) DEFAULT NULL,        -- Hora del evento de agenda
  `location` VARCHAR(255) DEFAULT NULL,         -- Ubicación del evento de agenda
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_agenda_event` (`event_date`, `event_time`, `title`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- Tabla: Avisos
-- ====================================
CREATE TABLE IF NOT EXISTS `avisos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,          -- Identificador único
  `title` VARCHAR(255) NOT NULL,                -- Título del aviso
  `category` VARCHAR(255) NOT NULL DEFAULT 'Sin categoría', -- Categoría del aviso
  `subtitle` VARCHAR(255),                      -- Subtítulo del aviso
  `link` VARCHAR(2083),                         -- Enlace al aviso
  `content` TEXT DEFAULT NULL,                  -- Contenido del aviso
  UNIQUE(`title`, `subtitle`)                   -- Llave única por título y subtítulo
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- Tabla: Noticias
-- ====================================
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT NOT NULL AUTO_INCREMENT,             -- Identificador único
  `title` VARCHAR(255) NOT NULL,               -- Título de la noticia
  `raw_date` VARCHAR(255) NOT NULL,            -- Fecha de la noticia (cruda)
  `content` TEXT DEFAULT NULL,                 -- Contenido de la noticia
  `link` VARCHAR(2083) NOT NULL,               -- Enlace a la noticia
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_news` (`title`, `raw_date`)  -- Llave única por título y fecha
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
