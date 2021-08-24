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
  `total_neto` DECIMAL(7,2) NOT NULL,
  `pagado` TINYINT(1) NOT NULL,
  PRIMARY KEY (`idReservacion`),
  CONSTRAINT `idPaquete`
    FOREIGN KEY (`idPaquete`)
    REFERENCES `coworking`.`paquetes` (`idpaquete`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`, `capacidad_personas`, `capacidad_instalada`, `medidas`) VALUES ('PRIVATE DESK', 'Internet, barra de café y té, escritorio individual, 5 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '107.54', '179.99', '659.99', '1999.99', '1', '1', 'Oficina personal de 4.15m de largo x 1.95 de ancho.');
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`, `capacidad_personas`, `capacidad_instalada`, `medidas`) VALUES ('DESK PLUS', 'Internet, barra de café y té, 10 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '129.99', '199.99', '749.99', '2999.99', '3', '4', 'Oficinas para recibir personas de 4.50m de largo x 3m de ancho y otra de 2.80m de L x 3.10m de A.');
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`) VALUES ('SALA DE JUNTAS', 'Internet, barra de café y té, 5 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '139.99', '189.99', '599.99', '749.99');
