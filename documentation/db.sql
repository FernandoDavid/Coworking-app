create database coworking;
create user 'coworking_user'@'localhost' identified by 'coworking123456';
grant all privileges on coworking.* to 'coworking_user'@'localhost';

CREATE TABLE `coworking`.`paquetes` (
  `idpaquete` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `servicios` TEXT(255) NOT NULL,
  `tarifa_hora` DECIMAL(7,2) NULL,
  `tarifa_dia` DECIMAL(7,2) NULL,
  `tarifa_semana` DECIMAL(7,2) NULL,
  `tarifa_mensual` DECIMAL(7,2) NULL,
  `capacidad_personas` TINYINT(2) NULL,
  `capacidad_instalada` TINYINT(2) NULL,
  `medidas` TEXT(255) NULL,
  PRIMARY KEY (`idpaquete`)
  );
  
  CREATE TABLE `coworking`.`reservaciones` (
  `idReservacion` INT NOT NULL AUTO_INCREMENT,
  `idPaquete` INT NOT NULL,
  `cliente` VARCHAR(60) NOT NULL,
  `fecha_registro` DATE NOT NULL,
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
    
    -- INSERTS TABLA PAQUETES
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`, `capacidad_personas`, `capacidad_instalada`, `medidas`) VALUES ('HOT DESK', 'Internet, barra de café y té, reserva inmediata, electricidad, mobiliario, limpieza y sanitización.', '89.62', '119.99', '449.99', '1199.99', '1', '10', 'Escritorios de 1.10m de largo x 1m de ancho.');
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`, `capacidad_personas`, `capacidad_instalada`, `medidas`) VALUES ('PRIVATE DESK', 'Internet, barra de café y té, escritorio individual, 5 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '107.54', '179.99', '659.99', '1999.99', '1', '1', 'Oficina personal de 4.15m de largo x 1.95 de ancho.');
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`, `capacidad_personas`, `capacidad_instalada`, `medidas`) VALUES ('DESK PLUS', 'Internet, barra de café y té, 10 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '129.99', '199.99', '749.99', '2999.99', '3', '4', 'Oficinas para recibir personas de 4.50m de largo x 3m de ancho y otra de 2.80m de L x 3.10m de A.');
INSERT INTO `coworking`.`paquetes` (`nombre`, `servicios`, `tarifa_hora`, `tarifa_dia`, `tarifa_semana`, `tarifa_mensual`,`capacidad_personas`) VALUES ('SALA DE JUNTAS', 'Internet, barra de café y té, 5 impresiones a blanco y negro, electricidad, mobiliario, limpieza y sanitización.', '139.99', '189.99', '599.99', '749.99', '5');

delimiter $$
create function verificarReservacion(reserv datetime, id int) returns tinyint(1)
begin 
	declare nodisponible tinyint default 0;
	declare done int default 0; 
	declare fecha_ini datetime;
    declare fecha_fin datetime;
    declare disponibles tinyint default 0;
    declare ocupados tinyint default 0;
    
    declare revisar cursor for
		select fecha_contratacion, fecha_finalizacion from reservaciones where idpaquete = id;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    select capacidad_instalada into disponibles from paquetes where idpaquete = id;
    select count(*) into ocupados from reservaciones where idpaquete = id and (reserv between fecha_contratacion and fecha_finalizacion); 
    
    open revisar;
		revisar_loop:
			loop fetch revisar into fecha_ini, fecha_fin;
            if (done) then
				leave revisar_loop;
			end if;
            if ((reserv between fecha_ini and fecha_fin) and (disponibles<=ocupados)) then
				set nodisponible=1;
			end if;
		end loop revisar_loop;
	close revisar;
    
    return nodisponible;
end;
$$

