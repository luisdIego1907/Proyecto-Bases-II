
USE sgid_db;


CREATE USER 'app_sgid'@'localhost' IDENTIFIED BY 'AppSgid_12345';

GRANT EXECUTE ON SGID_DB.* TO 'app_sgid'@'localhost';

FLUSH PRIVILEGES;

INSERT INTO ROL_USUARIO (Nombre) VALUES
('ADMIN'),
('OPERARIO'),
('SUPERVISOR');

SELECT * FROM ROL_USUARIO;

INSERT INTO USUARIO (
    NombreUsuario,
    Nombre,
    Apellidos,
    Correo,
    ContrasenaHash,
    Activo
) VALUES
('admin01', 'Luis Diego', 'Quesada', 'luis.diego@sgid.test',"PASSWORDHASH", 1),
('admin02', 'Andrea', 'Gonzalez', 'andrea.paola@sgid.test',"PASSWORDHASH", 1),
('admin03', 'Evelyn', 'Martinez', 'evelyn.martinez@sgid.test',"PASSWORDHASH", 1),
('operario01', 'Carlos', 'Mendez Rojas', 'carlos.mendez@sgid.test',"PASSWORDHASH" , 1),
('operario02', 'Andrea', 'Vargas Mora', 'andrea.vargas@sgid.test',"PASSWORDHASH" , 1),
('supervisor01', 'Luis', 'Araya Segura', 'luis.araya@sgid.test',"PASSWORDHASH" , 1),
('operario03', 'Valeria', 'Jimenez Soto', 'valeria.jimenez@sgid.test',"PASSWORDHASH" , 1),
('operario04', 'Daniel', 'Rojas Mora', 'daniel.rojas@sgid.test', "PASSWORDHASH", 1),
('supervisor02', 'Natalia', 'Campos Vega', 'natalia.campos@sgid.test', "PASSWORDHASH", 1),
('operario05', 'Jose', 'Ramirez Leon', 'jose.ramirez@sgid.test',"PASSWORDHASH", 1),
('admin04', 'Fernanda', 'Lopez Ruiz', 'fernanda.lopez@sgid.test', "PASSWORDHASH", 1),
('operario06', 'Esteban', 'Castro Arias', 'esteban.castro@sgid.test',"PASSWORDHASH" , 1);

UPDATE USUARIO
SET ContrasenaHash = '$2a$11$l6w2fI6jAPhEoRs.Y3zhvO8S7QdtJauybJgGkB/xhIe.SIxglMxW.'
WHERE NombreUsuario IN (
    'admin01',
    'admin02',
    'admin03',
    'operario01',
    'operario02',
    'supervisor01',
    'operario03',
    'operario04',
    'supervisor02',
    'operario05',
    'admin04',
    'operario06'
);

SET @RolAdmin = (
    SELECT RolUsuarioId
    FROM ROL_USUARIO
    WHERE Nombre = 'ADMIN'
    LIMIT 1
);

SET @RolOperario = (
    SELECT RolUsuarioId
    FROM ROL_USUARIO
    WHERE Nombre = 'OPERARIO'
    LIMIT 1
);

SET @RolSupervisor = (
    SELECT RolUsuarioId
    FROM ROL_USUARIO
    WHERE Nombre = 'SUPERVISOR'
    LIMIT 1
);

SET @UserAdmin01 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'admin01' LIMIT 1
);

SET @UserAdmin02 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'admin02' LIMIT 1
);

SET @UserAdmin03 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'admin03' LIMIT 1
);

SET @UserAdmin04 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'admin04' LIMIT 1
);

SET @UserOperario01 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario01' LIMIT 1
);

SET @UserOperario02 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario02' LIMIT 1
);

SET @UserOperario03 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario03' LIMIT 1
);

SET @UserOperario04 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario04' LIMIT 1
);

SET @UserOperario05 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario05' LIMIT 1
);

SET @UserOperario06 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario06' LIMIT 1
);

SET @UserSupervisor01 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'supervisor01' LIMIT 1
);

SET @UserSupervisor02 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'supervisor02' LIMIT 1
);

INSERT INTO USUARIO_ROL (UsuarioId, RolUsuarioId) VALUES
(@UserAdmin01, @RolAdmin),
(@UserAdmin02, @RolAdmin),
(@UserAdmin03, @RolAdmin),
(@UserAdmin04, @RolAdmin),

(@UserOperario01, @RolOperario),
(@UserOperario02, @RolOperario),
(@UserOperario03, @RolOperario),
(@UserOperario04, @RolOperario),
(@UserOperario05, @RolOperario),
(@UserOperario06, @RolOperario),

(@UserSupervisor01, @RolSupervisor),
(@UserSupervisor02, @RolSupervisor);

-- ============================================================
-- 4. CLIENTES
-- Se usa el procedimiento sp_CrearCliente.
-- ============================================================
-- Nombre, RolCliente, Felefono, Correo, DIRECCION
CALL sp_CrearCliente('TechSource Costa Rica', 'ORIGEN', '2222-1001', 'contacto@techsource.test', 'Zona Franca Coyol, Alajuela');
CALL sp_CrearCliente('RetailMax San Jose', 'DESTINO', '2222-1002', 'logistica@retailmax.test', 'Barrio Tournon, San Jose');
CALL sp_CrearCliente('CompuGlobal LATAM', 'AMBOS', '2222-1003', 'operaciones@compuglobal.test', 'La Lima, Cartago');
CALL sp_CrearCliente('Hardware Import CR', 'ORIGEN', '2222-1004', 'ventas@hardwareimport.test', 'Barreal, Heredia');
CALL sp_CrearCliente('Distribuidora Central', 'DESTINO', '2222-1005', 'despachos@distcentral.test', 'Pavas, San Jose');
CALL sp_CrearCliente('SmartLogix Partners', 'AMBOS', '2222-1006', 'cedis@smartlogix.test', 'Guadalupe, San Jose');
CALL sp_CrearCliente('Componentes del Norte', 'ORIGEN', '2222-1007', 'bodega@componentesnorte.test', 'Liberia, Guanacaste');
CALL sp_CrearCliente('Electronica Cartago', 'DESTINO', '2222-1008', 'compras@electronicacartago.test', 'Oriental, Cartago');
CALL sp_CrearCliente('DataCenter Supplies', 'AMBOS', '2222-1009', 'supply@datacenter.test', 'San Rafael, Escazu');
CALL sp_CrearCliente('MobileHub Regional', 'AMBOS', '2222-1010', 'logistica@mobilehub.test', 'San Francisco, Heredia');

-- Variables de apoyo para no depender de IDs escritos a mano en clientes.
SELECT ClienteId INTO @ClienteOrigen01 FROM CLIENTE WHERE Correo = 'contacto@techsource.test' LIMIT 1;
SELECT ClienteId INTO @ClienteDestino01 FROM CLIENTE WHERE Correo = 'logistica@retailmax.test' LIMIT 1;
SELECT ClienteId INTO @ClienteAmbos01 FROM CLIENTE WHERE Correo = 'operaciones@compuglobal.test' LIMIT 1;
SELECT ClienteId INTO @ClienteOrigen02 FROM CLIENTE WHERE Correo = 'ventas@hardwareimport.test' LIMIT 1;
SELECT ClienteId INTO @ClienteDestino02 FROM CLIENTE WHERE Correo = 'despachos@distcentral.test' LIMIT 1;
SELECT ClienteId INTO @ClienteAmbos02 FROM CLIENTE WHERE Correo = 'cedis@smartlogix.test' LIMIT 1;
SELECT ClienteId INTO @ClienteOrigen03 FROM CLIENTE WHERE Correo = 'bodega@componentesnorte.test' LIMIT 1;
SELECT ClienteId INTO @ClienteDestino03 FROM CLIENTE WHERE Correo = 'compras@electronicacartago.test' LIMIT 1;
SELECT ClienteId INTO @ClienteAmbos03 FROM CLIENTE WHERE Correo = 'supply@datacenter.test' LIMIT 1;
SELECT ClienteId INTO @ClienteAmbos04 FROM CLIENTE WHERE Correo = 'logistica@mobilehub.test' LIMIT 1;

-- Usuarios de apoyo.
SET @Usuario01 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario01' LIMIT 1
);

SET @Usuario02 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario02' LIMIT 1
);

SET @Usuario03 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario03' LIMIT 1
);

SET @Usuario04 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario04' LIMIT 1
);

SET @Usuario05 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario05' LIMIT 1
);

SET @Usuario06 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'operario06' LIMIT 1
);

SET @Supervisor01 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'supervisor01' LIMIT 1
);

SET @Supervisor02 = (
    SELECT UsuarioId FROM USUARIO WHERE NombreUsuario = 'supervisor02' LIMIT 1
);

SELECT
    @Usuario01 AS Usuario01,
    @Usuario02 AS Usuario02,
    @Usuario03 AS Usuario03,
    @Usuario04 AS Usuario04,
    @Usuario05 AS Usuario05,
    @Usuario06 AS Usuario06,
    @Supervisor01 AS Supervisor01,
    @Supervisor02 AS Supervisor02;

-- ============================================================
-- 5. PRODUCTOS, BODEGAS, PASILLOS, ESTANTES Y UBICACIONES
-- Se usa sp_IngresarProducto.
-- Cada producto usa una bodega/pasillo/estante distinto para garantizar
-- al menos 10 registros tambien en BODEGA, PASILLO, ESTANTE y UBICACION.
-- ============================================================
-- Codigo, Nombre, Detalle, StockCritico, Bodega, Pasillo, Estante
CALL sp_IngresarProducto('PRD-001', 'Smartphone XPro 128GB', 'Telefono inteligente gama alta, color negro', 15, 'BOD-01', 'PAS-01', 'EST-01');
CALL sp_IngresarProducto('PRD-002', 'Laptop Ultrabook 14', 'Laptop liviana para uso empresarial', 10, 'BOD-02', 'PAS-02', 'EST-02');
CALL sp_IngresarProducto('PRD-003', 'Monitor LED 27', 'Monitor LED 27 pulgadas, resolucion QHD', 12, 'BOD-03', 'PAS-03', 'EST-03');
CALL sp_IngresarProducto('PRD-004', 'Teclado Mecanico RGB', 'Teclado mecanico con distribucion latinoamericana', 20, 'BOD-04', 'PAS-04', 'EST-04');
CALL sp_IngresarProducto('PRD-005', 'Mouse Inalambrico Pro', 'Mouse inalambrico ergonomico', 25, 'BOD-05', 'PAS-05', 'EST-05');
CALL sp_IngresarProducto('PRD-006', 'Disco SSD NVMe 1TB', 'Unidad de estado solido NVMe de alto rendimiento', 18, 'BOD-06', 'PAS-06', 'EST-06');
CALL sp_IngresarProducto('PRD-007', 'Memoria RAM 32GB DDR5', 'Modulo de memoria DDR5 para estaciones de trabajo', 16, 'BOD-07', 'PAS-07', 'EST-07');
CALL sp_IngresarProducto('PRD-008', 'Router WiFi 6 Empresarial', 'Router empresarial con soporte WiFi 6', 8, 'BOD-08', 'PAS-08', 'EST-08');
CALL sp_IngresarProducto('PRD-009', 'Switch Gigabit 24 Puertos', 'Switch administrable para red corporativa', 6, 'BOD-09', 'PAS-09', 'EST-09');
CALL sp_IngresarProducto('PRD-010', 'Camara IP Seguridad 4K', 'Camara IP de seguridad con vision nocturna', 14, 'BOD-10', 'PAS-10', 'EST-10');

-- Variables de productos.
SELECT ProductoId INTO @Producto01 FROM PRODUCTO WHERE Codigo = 'PRD-001' LIMIT 1;
SELECT ProductoId INTO @Producto02 FROM PRODUCTO WHERE Codigo = 'PRD-002' LIMIT 1;
SELECT ProductoId INTO @Producto03 FROM PRODUCTO WHERE Codigo = 'PRD-003' LIMIT 1;
SELECT ProductoId INTO @Producto04 FROM PRODUCTO WHERE Codigo = 'PRD-004' LIMIT 1;
SELECT ProductoId INTO @Producto05 FROM PRODUCTO WHERE Codigo = 'PRD-005' LIMIT 1;
SELECT ProductoId INTO @Producto06 FROM PRODUCTO WHERE Codigo = 'PRD-006' LIMIT 1;
SELECT ProductoId INTO @Producto07 FROM PRODUCTO WHERE Codigo = 'PRD-007' LIMIT 1;
SELECT ProductoId INTO @Producto08 FROM PRODUCTO WHERE Codigo = 'PRD-008' LIMIT 1;
SELECT ProductoId INTO @Producto09 FROM PRODUCTO WHERE Codigo = 'PRD-009' LIMIT 1;
SELECT ProductoId INTO @Producto10 FROM PRODUCTO WHERE Codigo = 'PRD-010' LIMIT 1;

-- ============================================================
-- 6. RECEPCIONES
-- Se usa sp_RegistrarRecepcion.
-- Estas llamadas tambien alimentan AUDITORIA_PRODUCTO mediante el trigger.
-- ============================================================
--  IN p_ProductoId INT, IN p_Cantidad INT, IN p_ClienteId INT, IN p_NumeroLote VARCHAR(100), IN p_UsuarioId INT
CALL sp_RegistrarRecepcion(@Producto01, 120, @ClienteOrigen01, 'LOT-REC-001', @Usuario01);
CALL sp_RegistrarRecepcion(@Producto02, 90, @ClienteAmbos01, 'LOT-REC-002', @Usuario02);
CALL sp_RegistrarRecepcion(@Producto03, 75, @ClienteOrigen02, 'LOT-REC-003', @Usuario03);
CALL sp_RegistrarRecepcion(@Producto04, 140, @ClienteAmbos02, 'LOT-REC-004', @Usuario04);
CALL sp_RegistrarRecepcion(@Producto05, 160, @ClienteOrigen03, 'LOT-REC-005', @Usuario05);
CALL sp_RegistrarRecepcion(@Producto06, 110, @ClienteAmbos03, 'LOT-REC-006', @Usuario06);
CALL sp_RegistrarRecepcion(@Producto07, 95, @ClienteAmbos04, 'LOT-REC-007', @Supervisor01);
CALL sp_RegistrarRecepcion(@Producto08, 60, @ClienteOrigen01, 'LOT-REC-008', @Supervisor02);
CALL sp_RegistrarRecepcion(@Producto09, 55, @ClienteAmbos01, 'LOT-REC-009', @Usuario01);
CALL sp_RegistrarRecepcion(@Producto10, 100, @ClienteOrigen02, 'LOT-REC-010', @Usuario02);

-- ============================================================
-- 7. DESPACHOS PROCESADOS
-- Se usan sp_CrearDespacho, sp_AgregarProductoCarrito y sp_ProcesarDespacho.
-- Estas llamadas llenan DESPACHO, DESPACHO_DETALLE y AUDITORIA_PRODUCTO.
-- El carrito se limpia al procesar, como exige la regla de negocio.
-- ============================================================
CALL sp_CrearDespacho(@ClienteDestino01, @Usuario01);
SET @DespachoProcesado01 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado01, @Producto01, 8);
CALL sp_ProcesarDespacho(@DespachoProcesado01, @Usuario01);

CALL sp_CrearDespacho(@ClienteAmbos01, @Usuario02);
SET @DespachoProcesado02 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado02, @Producto02, 6);
CALL sp_ProcesarDespacho(@DespachoProcesado02, @Usuario02);

CALL sp_CrearDespacho(@ClienteDestino02, @Usuario03);
SET @DespachoProcesado03 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado03, @Producto03, 5);
CALL sp_ProcesarDespacho(@DespachoProcesado03, @Usuario03);

CALL sp_CrearDespacho(@ClienteAmbos02, @Usuario04);
SET @DespachoProcesado04 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado04, @Producto04, 12);
CALL sp_ProcesarDespacho(@DespachoProcesado04, @Usuario04);

CALL sp_CrearDespacho(@ClienteDestino03, @Usuario05);
SET @DespachoProcesado05 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado05, @Producto05, 10);
CALL sp_ProcesarDespacho(@DespachoProcesado05, @Usuario05);

CALL sp_CrearDespacho(@ClienteAmbos03, @Usuario06);
SET @DespachoProcesado06 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado06, @Producto06, 7);
CALL sp_ProcesarDespacho(@DespachoProcesado06, @Usuario06);

CALL sp_CrearDespacho(@ClienteAmbos04, @Supervisor01);
SET @DespachoProcesado07 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado07, @Producto07, 9);
CALL sp_ProcesarDespacho(@DespachoProcesado07, @Supervisor01);

CALL sp_CrearDespacho(@ClienteDestino01, @Supervisor02);
SET @DespachoProcesado08 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado08, @Producto08, 4);
CALL sp_ProcesarDespacho(@DespachoProcesado08, @Supervisor02);

CALL sp_CrearDespacho(@ClienteDestino02, @Usuario01);
SET @DespachoProcesado09 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado09, @Producto09, 3);
CALL sp_ProcesarDespacho(@DespachoProcesado09, @Usuario01);

CALL sp_CrearDespacho(@ClienteAmbos01, @Usuario02);
SET @DespachoProcesado10 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoProcesado10, @Producto10, 6);
CALL sp_ProcesarDespacho(@DespachoProcesado10, @Usuario02);

-- ============================================================
-- 8. DESPACHOS PENDIENTES CON CARRITO
-- Se dejan pendientes para que DESPACHO_CARRITO tenga al menos 10 registros.
-- Si estos despachos se procesan, el procedimiento limpia el carrito.
-- ============================================================
CALL sp_CrearDespacho(@ClienteDestino01, @Usuario01);
SET @DespachoPendiente01 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente01, @Producto01, 3);

CALL sp_CrearDespacho(@ClienteAmbos01, @Usuario02);
SET @DespachoPendiente02 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente02, @Producto02, 4);

CALL sp_CrearDespacho(@ClienteDestino02, @Usuario03);
SET @DespachoPendiente03 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente03, @Producto03, 2);

CALL sp_CrearDespacho(@ClienteAmbos02, @Usuario04);
SET @DespachoPendiente04 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente04, @Producto04, 5);

CALL sp_CrearDespacho(@ClienteDestino03, @Usuario05);
SET @DespachoPendiente05 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente05, @Producto05, 6);

CALL sp_CrearDespacho(@ClienteAmbos03, @Usuario06);
SET @DespachoPendiente06 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente06, @Producto06, 3);

CALL sp_CrearDespacho(@ClienteAmbos04, @Supervisor01);
SET @DespachoPendiente07 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente07, @Producto07, 4);

CALL sp_CrearDespacho(@ClienteDestino01, @Supervisor02);
SET @DespachoPendiente08 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente08, @Producto08, 2);

CALL sp_CrearDespacho(@ClienteDestino02, @Usuario01);
SET @DespachoPendiente09 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente09, @Producto09, 1);

CALL sp_CrearDespacho(@ClienteAmbos01, @Usuario02);
SET @DespachoPendiente10 = LAST_INSERT_ID();
CALL sp_AgregarProductoCarrito(@DespachoPendiente10, @Producto10, 5);

