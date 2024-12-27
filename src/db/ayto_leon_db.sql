-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `ayto_leon_db`;
USE `ayto_leon_db`;

-- ====================================
-- Tabla: Eventos generales
-- ====================================
CREATE TABLE `events` (
  `id` INT NOT NULL AUTO_INCREMENT,            -- Identificador único
  `event_date` VARCHAR(255) NOT NULL,          -- Fecha del evento
  `event_time` VARCHAR(10) DEFAULT NULL,       -- Hora del evento (opcional)
  `title` VARCHAR(255) NOT NULL,               -- Título del evento
  `location` VARCHAR(255) DEFAULT NULL,        -- Ubicación del evento (opcional)
  PRIMARY KEY (`id`),                          -- Llave primaria
  UNIQUE KEY `key_event` (`event_date`, `event_time`, `title`) -- Restricción de unicidad
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- Tabla: Eventos de agenda
-- ====================================
CREATE TABLE `agenda_events` (
  `id` INT NOT NULL AUTO_INCREMENT,            -- Identificador único
  `event_date` VARCHAR(255) NOT NULL,          -- Fecha del evento
  `event_time` VARCHAR(10) DEFAULT NULL,       -- Hora del evento (opcional)
  `title` VARCHAR(255) NOT NULL,               -- Título del evento
  `location` VARCHAR(255) DEFAULT NULL,        -- Ubicación del evento (opcional)
  PRIMARY KEY (`id`),                          -- Llave primaria
  UNIQUE KEY `key_agenda_event` (`event_date`, `event_time`, `title`) -- Restricción de unicidad
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;

-- ====================================
-- Tabla: Avisos
-- ====================================
CREATE TABLE `avisos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único
  `title` VARCHAR(255) NOT NULL,               -- Título del aviso
  `subtitle` VARCHAR(255),                     -- Subtítulo del aviso (opcional)
  `link` VARCHAR(2083),                        -- Enlace al aviso
  UNIQUE(`title`, `subtitle`)                  -- Restricción de unicidad
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;
