create database coworking;
create user 'coworking_user'@'localhost' identified by 'coworking123456';
grant all privileges on coworking.* to 'coworking_user'@'localhost';

CREATE TABLE `coworking`.`paquetes` (
  `idpaquete` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `servicios` TEXT(255) NOT NULL,
  `tarifa_hora` DECIMAL(5,2) NULL,
  `tarifa_dia` DECIMAL(5,2) NULL,
  `tarifa_semana` DECIMAL(5,2) NULL,
  `tarifa_mensual` DECIMAL(5,2) NULL,
  `capacidad_personas` TINYINT(2) NULL,
  `capacidad_instalada` TINYINT(2) NULL,
  `medidas` TEXT(255) NULL,
  PRIMARY KEY (`idpaquete`)
  );
  
  CREATE TABLE `coworking`.`reservaciones` (
  `idReservacion` INT NOT NULL AUTO_INCREMENT,
  `idPaquete` INT NOT NULL,
  `cliente` VARCHAR(60) NOT NULL,
  `fecha_contratacion` DATETIME NOT NULL,
  `fecha_finalizacion` DATETIME NOT NULL,
  `periodo_uso` TINYINT(1) NOT NULL,
  `tiempo_uso` TINYINT(2) NULL,
  `total_neto` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`idReservacion`),
  CONSTRAINT `idPaquete`
    FOREIGN KEY (`idPaquete`)
    REFERENCES `coworking`.`paquetes` (`idpaquete`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
  