/* 
    Verifica si un producto esta por debajo o igual a su stock critico.
    Retorna:
    'REORDEN' si CantidadInventario <= StockCritico
    'OK' si CantidadInventario > StockCritico
*/
DELIMITER $$
DROP FUNCTION IF EXISTS fn_VerificarAlertaStock$$
CREATE FUNCTION fn_VerificarAlertaStock(
    p_ProductoId INT
)
RETURNS VARCHAR(20)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_CantidadInventario INT DEFAULT NULL;
    DECLARE v_StockCritico INT DEFAULT NULL;
    DECLARE v_Estado VARCHAR(20);

    SELECT 
        CantidadInventario,
        StockCritico
    INTO 
        v_CantidadInventario,
        v_StockCritico
    FROM PRODUCTO
    WHERE ProductoId = p_ProductoId
      AND Activo = 1
    LIMIT 1;

    IF v_CantidadInventario IS NULL THEN
        SET v_Estado = 'NO_EXISTE';
    ELSEIF v_CantidadInventario <= v_StockCritico THEN
        SET v_Estado = 'REORDEN';
    ELSE
        SET v_Estado = 'OK';
    END IF;

    RETURN v_Estado;
END
$$
DELIMITER ;
/*
    Se ejecuta despues de actualizar un producto. Si la cantidad de inventario
    cambia, valida que exista la variable de sesion @UsuarioId para identificar al
    usuario responsable. Luego inserta un registro de auditoria con la cantidad
    anterior, la cantidad nueva, la fecha del cambio y el tipo de movimiento
    generado: 'INCREMENTO' o 'REDUCCION'.
*/
DELIMITER $$
DROP TRIGGER IF EXISTS tg_AuditoriaInventario$$
CREATE TRIGGER tg_AuditoriaInventario
AFTER UPDATE ON PRODUCTO
FOR EACH ROW
BEGIN
    IF OLD.CantidadInventario <> NEW.CantidadInventario THEN

        IF @UsuarioId IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se puede auditar el cambio de inventario porque no se establecio @UsuarioId.';
        END IF;

        INSERT INTO AUDITORIA_PRODUCTO (
            ProductoId,
            UsuarioId,
            FechaCambio,
            CantidadAnterior,
            CantidadNueva,
            TipoMovimiento
        )
        VALUES (
            NEW.ProductoId,
            @UsuarioId,
            NOW(),
            OLD.CantidadInventario,
            NEW.CantidadInventario,
            CASE
                WHEN NEW.CantidadInventario > OLD.CantidadInventario THEN 'INCREMENTO'
                ELSE 'REDUCCION'
            END
        );

    END IF;
END
$$
DELIMITER ;
/*
    Valida que el producto, cliente y usuario existan y esten activos. Tambien
    verifica que el cliente pueda registrar recepciones y que la cantidad sea
    mayor que cero. Ejecuta una transaccion donde inserta la recepcion y aumenta
    la cantidad de inventario del producto. El cambio de inventario activa el
    trigger de auditoria mediante la variable @UsuarioId.
    Devuelve un mensaje de confirmacion, el producto afectado y la cantidad
    ingresada.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_RegistrarRecepcion$$
CREATE PROCEDURE sp_RegistrarRecepcion(
    IN p_ProductoId INT,
    IN p_Cantidad INT,
    IN p_ClienteId INT,
    IN p_NumeroLote VARCHAR(100),
    IN p_UsuarioId INT
)
BEGIN
    DECLARE v_ExisteProducto INT DEFAULT 0;
    DECLARE v_ExisteCliente INT DEFAULT 0;
    DECLARE v_ExisteUsuario INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET @UsuarioId = NULL;
        RESIGNAL;
    END;

    IF p_ProductoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto es obligatorio.';
    END IF;

    IF p_ClienteId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente es obligatorio.';
    END IF;

    IF p_UsuarioId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario es obligatorio.';
    END IF;

    IF p_Cantidad IS NULL OR p_Cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad de recepcion debe ser mayor que cero.';
    END IF;

    IF p_NumeroLote IS NULL OR TRIM(p_NumeroLote) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El numero de lote es obligatorio.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteProducto
    FROM PRODUCTO
    WHERE ProductoId = p_ProductoId
      AND Activo = 1;

    IF v_ExisteProducto = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe o esta inactivo.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteCliente
    FROM CLIENTE
    WHERE ClienteId = p_ClienteId
      AND Activo = 1
      AND RolCliente IN ('ORIGEN', 'AMBOS');

    IF v_ExisteCliente = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe, esta inactivo o no puede registrar recepciones.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteUsuario
    FROM USUARIO
    WHERE UsuarioId = p_UsuarioId
      AND Activo = 1;

    IF v_ExisteUsuario = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no existe o esta inactivo.';
    END IF;

    START TRANSACTION;

        SET @UsuarioId = p_UsuarioId;

        INSERT INTO RECEPCION (
            ClienteId,
            ProductoId,
            UsuarioId,
            NumeroLote,
            Cantidad,
            FechaRecepcion
        )
        VALUES (
            p_ClienteId,
            p_ProductoId,
            p_UsuarioId,
            TRIM(p_NumeroLote),
            p_Cantidad,
            NOW()
        );

        UPDATE PRODUCTO
        SET CantidadInventario = CantidadInventario + p_Cantidad
        WHERE ProductoId = p_ProductoId;

    COMMIT;

    SET @UsuarioId = NULL;

    SELECT 
        'Recepcion registrada correctamente.' AS Mensaje,
        p_ProductoId AS ProductoId,
        p_Cantidad AS CantidadIngresada;
END
$$
DELIMITER ;

/*
    Valida que el cliente exista, este activo y pueda recibir despachos. Tambien
    valida que el usuario exista y este activo. Si las validaciones son correctas,
    inserta una nueva orden en la tabla DESPACHO con fecha actual y estado
    'PENDIENTE'.
    Devuelve un mensaje de confirmacion y el identificador del despacho creado.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_CrearDespacho$$
CREATE PROCEDURE sp_CrearDespacho(
    IN p_ClienteId INT,
    IN p_UsuarioId INT
)
BEGIN
    DECLARE v_ExisteCliente INT DEFAULT 0;
    DECLARE v_ExisteUsuario INT DEFAULT 0;
    DECLARE v_DespachoId INT;

    IF p_ClienteId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente es obligatorio.';
    END IF;

    IF p_UsuarioId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario es obligatorio.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteCliente
    FROM CLIENTE
    WHERE ClienteId = p_ClienteId
      AND Activo = 1
      AND RolCliente IN ('DESTINO', 'AMBOS');

    IF v_ExisteCliente = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe, esta inactivo o no puede recibir despachos.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteUsuario
    FROM USUARIO
    WHERE UsuarioId = p_UsuarioId
      AND Activo = 1;

    IF v_ExisteUsuario = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no existe o esta inactivo.';
    END IF;

    INSERT INTO DESPACHO (
        ClienteId,
        UsuarioId,
        FechaDespacho,
        Estado
    )
    VALUES (
        p_ClienteId,
        p_UsuarioId,
        NOW(),
        'PENDIENTE'
    );

    SET v_DespachoId = LAST_INSERT_ID();

    SELECT 
        'Despacho creado correctamente.' AS Mensaje,
        v_DespachoId AS DespachoId;
END
$$
DELIMITER ;

/*
    Valida que el despacho exista y se encuentre pendiente. Tambien valida que el
    producto exista, este activo y tenga inventario disponible. Luego inserta el
    producto en DESPACHO_CARRITO. Si el producto ya estaba agregado al mismo
    despacho, acumula la cantidad solicitada.
    Devuelve un mensaje de confirmacion con el despacho, producto y cantidad
    agregada.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_AgregarProductoCarrito$$
CREATE PROCEDURE sp_AgregarProductoCarrito(
    IN p_DespachoId INT,
    IN p_ProductoId INT,
    IN p_CantidadSolicitada INT
)
BEGIN
    DECLARE v_ExisteDespacho INT DEFAULT 0;
    DECLARE v_ExisteProducto INT DEFAULT 0;

    IF p_DespachoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho es obligatorio.';
    END IF;

    IF p_ProductoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto es obligatorio.';
    END IF;

    IF p_CantidadSolicitada IS NULL OR p_CantidadSolicitada <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad solicitada debe ser mayor que cero.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteDespacho
    FROM DESPACHO
    WHERE DespachoId = p_DespachoId
      AND Estado = 'PENDIENTE';

    IF v_ExisteDespacho = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho no existe o no esta pendiente.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteProducto
    FROM PRODUCTO
    WHERE ProductoId = p_ProductoId
      AND Activo = 1
      AND CantidadInventario > 0;

    IF v_ExisteProducto = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe, esta inactivo o no tiene inventario disponible.';
    END IF;

    INSERT INTO DESPACHO_CARRITO (
        DespachoId,
        ProductoId,
        CantidadSolicitada
    )
    VALUES (
        p_DespachoId,
        p_ProductoId,
        p_CantidadSolicitada
    )
    ON DUPLICATE KEY UPDATE
        CantidadSolicitada = CantidadSolicitada + p_CantidadSolicitada;

    SELECT 
        'Producto agregado al carrito del despacho.' AS Mensaje,
        p_DespachoId AS DespachoId,
        p_ProductoId AS ProductoId,
        p_CantidadSolicitada AS CantidadAgregada;
END
$$
DELIMITER ;

/*
    Valida que el despacho exista, este pendiente y tenga productos agregados.
    Tambien valida al usuario responsable. Dentro de una transaccion verifica si
    existen productos inactivos o sin stock suficiente. Si hay problemas de stock,
    cancela el despacho y limpia el carrito. Si todo es correcto, traslada los
    productos del carrito al detalle del despacho, descuenta el inventario,
    cambia el estado del despacho a 'PROCESADO' y limpia el carrito. Los cambios
    de inventario se auditan mediante el trigger correspondiente.
    Devuelve un mensaje indicando si el despacho fue procesado correctamente o
    cancelado por stock insuficiente.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ProcesarDespacho$$
CREATE PROCEDURE sp_ProcesarDespacho(
    IN p_DespachoId INT,
    IN p_UsuarioId INT
)
BEGIN
    DECLARE v_ExisteDespacho INT DEFAULT 0;
    DECLARE v_ExisteUsuario INT DEFAULT 0;
    DECLARE v_CantidadItems INT DEFAULT 0;
    DECLARE v_ProductosSinStock INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET @UsuarioId = NULL;
        RESIGNAL;
    END;

    IF p_DespachoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho es obligatorio.';
    END IF;

    IF p_UsuarioId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario es obligatorio.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteDespacho
    FROM DESPACHO D
    INNER JOIN CLIENTE C ON C.ClienteId = D.ClienteId
    WHERE D.DespachoId = p_DespachoId
      AND D.Estado = 'PENDIENTE'
      AND C.Activo = 1
      AND C.RolCliente IN ('DESTINO', 'AMBOS');

    IF v_ExisteDespacho = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho no existe, no esta pendiente o el cliente no puede recibir despachos.';
    END IF;

    SELECT COUNT(*)
    INTO v_ExisteUsuario
    FROM USUARIO
    WHERE UsuarioId = p_UsuarioId
      AND Activo = 1;

    IF v_ExisteUsuario = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no existe o esta inactivo.';
    END IF;

    SELECT COUNT(*)
    INTO v_CantidadItems
    FROM DESPACHO_CARRITO
    WHERE DespachoId = p_DespachoId;

    IF v_CantidadItems = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho no tiene productos agregados.';
    END IF;

    START TRANSACTION;

        SELECT COUNT(*)
        INTO v_ProductosSinStock
        FROM DESPACHO_CARRITO DC
        INNER JOIN PRODUCTO P ON P.ProductoId = DC.ProductoId
        WHERE DC.DespachoId = p_DespachoId
          AND (
                P.Activo = 0
                OR P.CantidadInventario < DC.CantidadSolicitada
              );

        IF v_ProductosSinStock > 0 THEN

            UPDATE DESPACHO
            SET Estado = 'CANCELADO',
                UsuarioId = p_UsuarioId,
                FechaDespacho = NOW()
            WHERE DespachoId = p_DespachoId;

            DELETE FROM DESPACHO_CARRITO
            WHERE DespachoId = p_DespachoId;

            COMMIT;

            SELECT 
                'Despacho cancelado por stock insuficiente.' AS Mensaje,
                p_DespachoId AS DespachoId;

        ELSE

            SET @UsuarioId = p_UsuarioId;

            INSERT INTO DESPACHO_DETALLE (
                DespachoId,
                ProductoId,
                CantidadDespachada
            )
            SELECT
                DespachoId,
                ProductoId,
                CantidadSolicitada
            FROM DESPACHO_CARRITO
            WHERE DespachoId = p_DespachoId;

            UPDATE PRODUCTO P
            INNER JOIN DESPACHO_CARRITO DC 
                ON DC.ProductoId = P.ProductoId
            SET P.CantidadInventario = P.CantidadInventario - DC.CantidadSolicitada
            WHERE DC.DespachoId = p_DespachoId;

            UPDATE DESPACHO
            SET Estado = 'PROCESADO',
                UsuarioId = p_UsuarioId,
                FechaDespacho = NOW()
            WHERE DespachoId = p_DespachoId;

            DELETE FROM DESPACHO_CARRITO
            WHERE DespachoId = p_DespachoId;

            COMMIT;

            SET @UsuarioId = NULL;

            SELECT 
                'Despacho procesado correctamente.' AS Mensaje,
                p_DespachoId AS DespachoId;

        END IF;
END
$$
DELIMITER ;


/*
    Consulta las recepciones del producto indicado, mostrando fecha, lote,
    cliente, codigo del producto, nombre del producto, cantidad recibida y usuario
    que registro el movimiento. Ordena los resultados desde la recepcion mas
    reciente hasta la mas antigua.
    Devuelve el historial de recepciones del producto.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarRecepcionesPorProducto$$
CREATE PROCEDURE sp_ListarRecepcionesPorProducto(
    IN p_ProductoId INT
)
BEGIN
    SELECT
        R.RecepcionId,
        R.RecepcionResourceId,
        R.FechaRecepcion,
        R.NumeroLote,
        C.Nombre AS Cliente,
        P.Codigo AS CodigoProducto,
        P.Nombre AS Producto,
        R.Cantidad,
        U.NombreUsuario AS Usuario
    FROM RECEPCION R
    INNER JOIN CLIENTE C ON C.ClienteId = R.ClienteId
    INNER JOIN PRODUCTO P ON P.ProductoId = R.ProductoId
    INNER JOIN USUARIO U ON U.UsuarioId = R.UsuarioId
    WHERE R.ProductoId = p_ProductoId
    ORDER BY R.FechaRecepcion DESC;
END
$$
DELIMITER ;


/*
    Consulta los despachos cuya fecha sea mayor o igual a la fecha actual menos
    siete dias. Muestra informacion del despacho, cliente, estado y usuario
    operario. Ordena los resultados desde el despacho mas reciente.
    Devuelve el listado de despachos de la ultima semana.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarDespachosUltimaSemana$$
CREATE PROCEDURE sp_ListarDespachosUltimaSemana()
BEGIN
    SELECT
        D.DespachoId,
        D.DespachoResourceId,
        D.FechaDespacho,
        C.Nombre AS Cliente,
        D.Estado,
        U.NombreUsuario AS Operario
    FROM DESPACHO D
    INNER JOIN CLIENTE C ON C.ClienteId = D.ClienteId
    INNER JOIN USUARIO U ON U.UsuarioId = D.UsuarioId
    WHERE D.FechaDespacho >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY D.FechaDespacho DESC;
END
$$
DELIMITER ;


/*
   Consulta los despachos cuya fecha se encuentre entre la fecha inicial y la
    fecha final indicadas. Muestra informacion del despacho, cliente, estado y
    usuario operario.
    Devuelve los despachos encontrados en el rango indicado.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarDespachosPorFecha$$
CREATE PROCEDURE sp_ListarDespachosPorFecha(
    IN p_FechaInicio DATETIME,
    IN p_FechaFin DATETIME
)
BEGIN
    SELECT
        D.DespachoId,
        D.DespachoResourceId,
        D.FechaDespacho,
        C.Nombre AS Cliente,
        D.Estado,
        U.NombreUsuario AS Operario
    FROM DESPACHO D
    INNER JOIN CLIENTE C ON C.ClienteId = D.ClienteId
    INNER JOIN USUARIO U ON U.UsuarioId = D.UsuarioId
    WHERE D.FechaDespacho BETWEEN p_FechaInicio AND p_FechaFin
    ORDER BY D.FechaDespacho DESC;
END
$$
DELIMITER ;

/*
    Consulta el detalle de productos despachados para el despacho indicado,
    siempre que el despacho tenga estado 'PROCESADO'. Muestra el codigo, nombre
    del producto y cantidad despachada.
    Devuelve el detalle de productos del despacho procesado.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_VerDetalleDespacho$$
CREATE PROCEDURE sp_VerDetalleDespacho(
    IN p_DespachoId INT
)
BEGIN
    SELECT
        D.DespachoId,
        P.Codigo,
        P.Nombre AS Producto,
        DD.CantidadDespachada
    FROM DESPACHO_DETALLE DD
    INNER JOIN DESPACHO D ON D.DespachoId = DD.DespachoId
    INNER JOIN PRODUCTO P ON P.ProductoId = DD.ProductoId
    WHERE DD.DespachoId = p_DespachoId
      AND D.Estado = 'PROCESADO'
    ORDER BY P.Nombre ASC;
END
$$
DELIMITER ;


/*
    Consulta los productos activos junto con su bodega, pasillo, estante,
    cantidad actual, stock critico, ultimo ingreso, ultimo despacho y estado de
    stock. El estado de stock se calcula llamando a fn_VerificarAlertaStock.
    Devuelve el listado general de inventario activo ordenado por nombre del
    producto.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarInventario$$
CREATE PROCEDURE sp_ListarInventario()
BEGIN
    SELECT
        P.ProductoId,
        P.ProductoResourceId,
        P.Codigo,
        P.Nombre,
        P.Detalle,
        B.Codigo AS CodigoBodega,
        B.Nombre AS Bodega,
        PA.Codigo AS Pasillo,
        E.Codigo AS Estante,
        UB.UbicacionResourceId,
        P.CantidadInventario,
        P.StockCritico,
        fn_VerificarAlertaStock(P.ProductoId) AS EstadoStock,
        (
            SELECT MAX(R.FechaRecepcion)
            FROM RECEPCION R
            WHERE R.ProductoId = P.ProductoId
        ) AS UltimoIngreso,
        (
            SELECT MAX(D.FechaDespacho)
            FROM DESPACHO_DETALLE DD
            INNER JOIN DESPACHO D ON D.DespachoId = DD.DespachoId
            WHERE DD.ProductoId = P.ProductoId
              AND D.Estado = 'PROCESADO'
        ) AS UltimoDespacho
    FROM PRODUCTO P
    INNER JOIN UBICACION UB ON UB.UbicacionId = P.UbicacionId
    INNER JOIN ESTANTE E ON E.EstanteId = UB.EstanteId
    INNER JOIN PASILLO PA ON PA.PasilloId = E.PasilloId
    INNER JOIN BODEGA B ON B.BodegaId = PA.BodegaId
    WHERE P.Activo = 1
    ORDER BY P.Nombre ASC;
END
$$
DELIMITER ;

/*
    Une las recepciones y los despachos procesados de un producto dentro del rango
    de fechas indicado. Cada registro muestra la fecha, tipo de movimiento,
    cliente, codigo del producto, nombre del producto, cantidad y usuario
    asociado.
    Devuelve los movimientos del producto ordenados desde el mas reciente.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarMovimientosProducto$$
CREATE PROCEDURE sp_ListarMovimientosProducto(
    IN p_ProductoId INT,
    IN p_FechaInicio DATETIME,
    IN p_FechaFin DATETIME
)
BEGIN
    SELECT
        R.FechaRecepcion AS Fecha,
        'RECEPCION' AS TipoMovimiento,
        C.Nombre AS Cliente,
        P.Codigo AS CodigoProducto,
        P.Nombre AS Producto,
        R.Cantidad AS Cantidad,
        U.NombreUsuario AS Usuario
    FROM RECEPCION R
    INNER JOIN CLIENTE C ON C.ClienteId = R.ClienteId
    INNER JOIN PRODUCTO P ON P.ProductoId = R.ProductoId
    INNER JOIN USUARIO U ON U.UsuarioId = R.UsuarioId
    WHERE R.ProductoId = p_ProductoId
      AND R.FechaRecepcion BETWEEN p_FechaInicio AND p_FechaFin

    UNION ALL

    SELECT
        D.FechaDespacho AS Fecha,
        'DESPACHO' AS TipoMovimiento,
        C.Nombre AS Cliente,
        P.Codigo AS CodigoProducto,
        P.Nombre AS Producto,
        DD.CantidadDespachada AS Cantidad,
        U.NombreUsuario AS Usuario
    FROM DESPACHO_DETALLE DD
    INNER JOIN DESPACHO D ON D.DespachoId = DD.DespachoId
    INNER JOIN CLIENTE C ON C.ClienteId = D.ClienteId
    INNER JOIN PRODUCTO P ON P.ProductoId = DD.ProductoId
    INNER JOIN USUARIO U ON U.UsuarioId = D.UsuarioId
    WHERE DD.ProductoId = p_ProductoId
      AND D.Estado = 'PROCESADO'
      AND D.FechaDespacho BETWEEN p_FechaInicio AND p_FechaFin

    ORDER BY Fecha DESC;
END
$$
DELIMITER ;

/*
    Consulta los cambios de inventario registrados para un producto dentro del
    rango de fechas indicado. Muestra cantidad anterior, cantidad nueva, tipo de
    movimiento, fecha y usuario responsable.
    Devuelve el historial de auditoria del producto.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarAuditoriaProducto$$
CREATE PROCEDURE sp_ListarAuditoriaProducto(
    IN p_ProductoId INT,
    IN p_FechaInicio DATETIME,
    IN p_FechaFin DATETIME
)
BEGIN
    SELECT
        A.AuditoriaId,
        A.AuditoriaResourceId,
        A.FechaCambio,
        P.Codigo AS CodigoProducto,
        P.Nombre AS Producto,
        A.CantidadAnterior,
        A.CantidadNueva,
        A.TipoMovimiento,
        U.NombreUsuario AS Usuario
    FROM AUDITORIA_PRODUCTO A
    INNER JOIN PRODUCTO P ON P.ProductoId = A.ProductoId
    INNER JOIN USUARIO U ON U.UsuarioId = A.UsuarioId
    WHERE A.ProductoId = p_ProductoId
      AND A.FechaCambio BETWEEN p_FechaInicio AND p_FechaFin
    ORDER BY A.FechaCambio DESC;
END
$$
DELIMITER ;

/*
    Consulta los datos principales de todos los clientes, incluyendo su rol,
    telefono, correo, direccion y estado activo. Ordena los resultados por nombre.
    Devuelve el listado de clientes.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarClientes$$
CREATE PROCEDURE sp_ListarClientes()
BEGIN
    SELECT
        ClienteId,
        ClienteResourceId,
        Nombre,
        RolCliente,
        Telefono,
        Correo,
        Direccion,
        Activo
    FROM CLIENTE
    ORDER BY Nombre ASC;
END $$
DELIMITER ;

/*
    Valida que el identificador y el nombre no esten vacios, que el rol sea
    valido, que el estado sea 0 o 1, y que el cliente exista. Luego actualiza los
    datos del cliente y normaliza los campos opcionales vacios como NULL.
    Devuelve el registro actualizado del cliente.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ModificarCliente$$
CREATE PROCEDURE sp_ModificarCliente(
    IN p_ClienteResourceId CHAR(36),
    IN p_Nombre VARCHAR(150),
    IN p_RolCliente VARCHAR(20),
    IN p_Telefono VARCHAR(30),
    IN p_Correo VARCHAR(120),
    IN p_Direccion VARCHAR(250),
    IN p_Activo TINYINT
)
BEGIN
    IF p_ClienteResourceId IS NULL OR TRIM(p_ClienteResourceId) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El identificador del cliente es obligatorio.';
    END IF;

    IF p_Nombre IS NULL OR TRIM(p_Nombre) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del cliente es obligatorio.';
    END IF;

    IF p_RolCliente NOT IN ('ORIGEN', 'DESTINO', 'AMBOS') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El rol del cliente debe ser ORIGEN, DESTINO o AMBOS.';
    END IF;

    IF p_Activo NOT IN (0, 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estado activo debe ser 0 o 1.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM CLIENTE
        WHERE ClienteResourceId = p_ClienteResourceId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe.';
    END IF;

    UPDATE CLIENTE
    SET
        Nombre = TRIM(p_Nombre),
        RolCliente = p_RolCliente,
        Telefono = NULLIF(TRIM(p_Telefono), ''),
        Correo = NULLIF(TRIM(p_Correo), ''),
        Direccion = NULLIF(TRIM(p_Direccion), ''),
        Activo = p_Activo
    WHERE ClienteResourceId = p_ClienteResourceId;

    SELECT
        ClienteId,
        ClienteResourceId,
        Nombre,
        RolCliente,
        Telefono,
        Correo,
        Direccion,
        Activo
    FROM CLIENTE
    WHERE ClienteResourceId = p_ClienteResourceId;
END $$
DELIMITER ;

/*
    Valida que el nombre no este vacio y que el rol sea permitido. Inserta el
    cliente como activo y convierte los campos opcionales vacios en NULL.
    Devuelve el registro del cliente creado.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_CrearCliente$$
CREATE PROCEDURE sp_CrearCliente(
    IN p_Nombre VARCHAR(150),
    IN p_RolCliente VARCHAR(20),
    IN p_Telefono VARCHAR(30),
    IN p_Correo VARCHAR(120),
    IN p_Direccion VARCHAR(250)
)
BEGIN
    IF p_Nombre IS NULL OR TRIM(p_Nombre) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del cliente es obligatorio.';
    END IF;

    IF p_RolCliente NOT IN ('ORIGEN', 'DESTINO', 'AMBOS') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El rol del cliente debe ser ORIGEN, DESTINO o AMBOS.';
    END IF;
    
    INSERT INTO CLIENTE (
        Nombre,
        RolCliente,
        Telefono,
        Correo,
        Direccion,
        Activo
    )
    VALUES (
        TRIM(p_Nombre),
        p_RolCliente,
        NULLIF(TRIM(p_Telefono), ''),
        NULLIF(TRIM(p_Correo), ''),
        NULLIF(TRIM(p_Direccion), ''),
        1
    );

    SELECT
        ClienteId,
        ClienteResourceId,
        Nombre,
        RolCliente,
        Telefono,
        Correo,
        Direccion,
        Activo
    FROM CLIENTE
    WHERE ClienteId = LAST_INSERT_ID();
END 
$$
DELIMITER ;


/*
    Obtiene el identificador interno del cliente y valida que exista. Luego
    verifica que no tenga recepciones ni despachos asociados. Si no existen
    dependencias, elimina el registro de CLIENTE.
    Devuelve un mensaje de eliminacion correcta.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_EliminarCliente$$
CREATE PROCEDURE sp_EliminarCliente(
    IN p_ClienteResourceId CHAR(36)
)
BEGIN
    DECLARE v_ClienteId INT DEFAULT NULL;

    SELECT ClienteId
    INTO v_ClienteId
    FROM CLIENTE
    WHERE ClienteResourceId = p_ClienteResourceId
    LIMIT 1;

    IF v_ClienteId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente no existe.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM RECEPCION
        WHERE ClienteId = v_ClienteId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el cliente porque tiene recepciones asociadas.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM DESPACHO
        WHERE ClienteId = v_ClienteId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el cliente porque tiene despachos asociados.';
    END IF;

    DELETE FROM CLIENTE
    WHERE ClienteId = v_ClienteId;

    SELECT 'Cliente eliminado correctamente.' AS Mensaje;
END $$
DELIMITER ;


/*
    Valida que el producto y la ubicacion existan. Tambien valida que el nombre no
    este vacio y que el stock critico sea mayor o igual a cero. Actualiza el
    nombre, stock critico y ubicacion del producto, sin modificar la cantidad de
    inventario.
    Devuelve el producto actualizado junto con su ubicacion.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ModificarProducto$$
CREATE PROCEDURE sp_ModificarProducto(
    IN p_ProductoResourceId CHAR(36),
    IN p_Nombre VARCHAR(100),
    IN p_StockCritico INT,
    IN p_UbicacionResourceId CHAR(36)
)
BEGIN
    DECLARE v_ProductoId INT DEFAULT NULL;
    DECLARE v_UbicacionId INT DEFAULT NULL;

    SELECT ProductoId
    INTO v_ProductoId
    FROM PRODUCTO
    WHERE ProductoResourceId = p_ProductoResourceId
    LIMIT 1;

    IF v_ProductoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe.';
    END IF;

    SELECT UbicacionId
    INTO v_UbicacionId
    FROM UBICACION
    WHERE UbicacionResourceId = p_UbicacionResourceId
    LIMIT 1;

    IF v_UbicacionId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La ubicacion no existe.';
    END IF;

    IF p_Nombre IS NULL OR TRIM(p_Nombre) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del producto es obligatorio.';
    END IF;

    IF p_StockCritico IS NULL OR p_StockCritico < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock critico debe ser mayor o igual a cero.';
    END IF;

    UPDATE PRODUCTO
    SET
        Nombre = TRIM(p_Nombre),
        StockCritico = p_StockCritico,
        UbicacionId = v_UbicacionId
    WHERE ProductoId = v_ProductoId;

    SELECT
        P.ProductoId,
        P.ProductoResourceId,
        P.Codigo,
        P.Nombre,
        P.Detalle,
        P.CantidadInventario,
        P.StockCritico,
        P.Activo,
        UB.UbicacionResourceId,
        B.Codigo AS CodigoBodega,
        B.Nombre AS Bodega,
        PA.Codigo AS Pasillo,
        E.Codigo AS Estante
    FROM PRODUCTO P
    INNER JOIN UBICACION UB ON P.UbicacionId = UB.UbicacionId
    INNER JOIN ESTANTE E ON E.EstanteId = UB.EstanteId
    INNER JOIN PASILLO PA ON PA.PasilloId = E.PasilloId
    INNER JOIN BODEGA B ON B.BodegaId = PA.BodegaId
    WHERE P.ProductoId = v_ProductoId;
END $$
DELIMITER ;

/*
    Valida los datos obligatorios y verifica que no exista otro producto con el
    mismo codigo. Crea o reutiliza la bodega, pasillo, estante y ubicacion
    mediante operaciones con ON DUPLICATE KEY UPDATE. Luego inserta el producto
    con cantidad inicial de inventario en cero y estado activo.
    Devuelve el producto creado junto con su ubicacion.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_IngresarProducto$$
CREATE PROCEDURE sp_IngresarProducto(
    IN p_Codigo VARCHAR(50),
    IN p_Nombre VARCHAR(100),
    IN p_Detalle VARCHAR(255),
    IN p_StockCritico INT,
    IN p_Bodega VARCHAR(50),
    IN p_Pasillo VARCHAR(50),
    IN p_Estante VARCHAR(50)
)
BEGIN
    DECLARE v_BodegaId INT DEFAULT NULL;
    DECLARE v_PasilloId INT DEFAULT NULL;
    DECLARE v_EstanteId INT DEFAULT NULL;
    DECLARE v_UbicacionId INT DEFAULT NULL;
    DECLARE v_ProductoId INT DEFAULT NULL;

    IF p_Codigo IS NULL OR TRIM(p_Codigo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El codigo del producto es obligatorio.';
    END IF;

    IF p_Nombre IS NULL OR TRIM(p_Nombre) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del producto es obligatorio.';
    END IF;

    IF p_StockCritico IS NULL OR p_StockCritico < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock critico debe ser mayor o igual a cero.';
    END IF;

    IF p_Bodega IS NULL OR TRIM(p_Bodega) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La bodega es obligatoria.';
    END IF;

    IF p_Pasillo IS NULL OR TRIM(p_Pasillo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El pasillo es obligatorio.';
    END IF;

    IF p_Estante IS NULL OR TRIM(p_Estante) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El estante es obligatorio.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM PRODUCTO
        WHERE Codigo = TRIM(p_Codigo)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe un producto con ese codigo.';
    END IF;

    INSERT INTO BODEGA (
        Codigo,
        Nombre
    )
    VALUES (
        TRIM(p_Bodega),
        TRIM(p_Bodega)
    )
    ON DUPLICATE KEY UPDATE
        BodegaId = LAST_INSERT_ID(BodegaId);

    SET v_BodegaId = LAST_INSERT_ID();

    INSERT INTO PASILLO (
        BodegaId,
        Codigo
    )
    VALUES (
        v_BodegaId,
        TRIM(p_Pasillo)
    )
    ON DUPLICATE KEY UPDATE
        PasilloId = LAST_INSERT_ID(PasilloId);

    SET v_PasilloId = LAST_INSERT_ID();

    INSERT INTO ESTANTE (
        PasilloId,
        Codigo
    )
    VALUES (
        v_PasilloId,
        TRIM(p_Estante)
    )
    ON DUPLICATE KEY UPDATE
        EstanteId = LAST_INSERT_ID(EstanteId);

    SET v_EstanteId = LAST_INSERT_ID();

    INSERT INTO UBICACION (
        EstanteId
    )
    VALUES (
        v_EstanteId
    )
    ON DUPLICATE KEY UPDATE
        UbicacionId = LAST_INSERT_ID(UbicacionId);

    SET v_UbicacionId = LAST_INSERT_ID();

    INSERT INTO PRODUCTO (
        Codigo,
        Nombre,
        Detalle,
        StockCritico,
        CantidadInventario,
        UbicacionId,
        Activo
    )
    VALUES (
        TRIM(p_Codigo),
        TRIM(p_Nombre),
        NULLIF(TRIM(p_Detalle), ''),
        p_StockCritico,
        0,
        v_UbicacionId,
        1
    );

    SET v_ProductoId = LAST_INSERT_ID();

    SELECT
        P.ProductoId,
        P.ProductoResourceId,
        P.Codigo,
        P.Nombre,
        P.Detalle,
        P.CantidadInventario,
        P.StockCritico,
        P.Activo,
        UB.UbicacionResourceId,
        B.Codigo AS CodigoBodega,
        B.Nombre AS Bodega,
        PA.Codigo AS Pasillo,
        E.Codigo AS Estante
    FROM PRODUCTO P
    INNER JOIN UBICACION UB ON P.UbicacionId = UB.UbicacionId
    INNER JOIN ESTANTE E ON E.EstanteId = UB.EstanteId
    INNER JOIN PASILLO PA ON PA.PasilloId = E.PasilloId
    INNER JOIN BODEGA B ON B.BodegaId = PA.BodegaId
    WHERE P.ProductoId = v_ProductoId;
END $$
DELIMITER ;

/*
    Obtiene el identificador interno del producto y valida que exista. Luego
    verifica que no tenga recepciones, despachos, registros en carrito ni
    auditorias asociadas. Si no hay dependencias, elimina el producto.
    Devuelve un mensaje de eliminacion correcta.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_EliminarProducto$$
CREATE PROCEDURE sp_EliminarProducto(
    IN p_ProductoResourceId CHAR(36)
)
BEGIN
    DECLARE v_ProductoId INT DEFAULT NULL;

    SELECT ProductoId
    INTO v_ProductoId
    FROM PRODUCTO
    WHERE ProductoResourceId = p_ProductoResourceId
    LIMIT 1;

    IF v_ProductoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no existe.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM RECEPCION
        WHERE ProductoId = v_ProductoId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el producto porque tiene recepciones asociadas.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM DESPACHO_DETALLE
        WHERE ProductoId = v_ProductoId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el producto porque tiene despachos asociados.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM DESPACHO_CARRITO
        WHERE ProductoId = v_ProductoId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el producto porque esta asociado a un carrito de despacho.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM AUDITORIA_PRODUCTO
        WHERE ProductoId = v_ProductoId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el producto porque tiene movimientos de auditoria asociados.';
    END IF;

    DELETE FROM PRODUCTO
    WHERE ProductoId = v_ProductoId;

    SELECT 'Producto eliminado correctamente.' AS Mensaje;
END $$
DELIMITER ;

/*
    Consulta el producto indicado y lo relaciona con su ubicacion fisica,
    incluyendo bodega, pasillo y estante.
    Devuelve los datos del producto y su ubicacion.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ObtenerProductoPorId$$

CREATE PROCEDURE sp_ObtenerProductoPorId(
    IN p_ProductoId INT
)
BEGIN
    SELECT
        p.ProductoId,
        p.ProductoResourceId,
        p.Codigo,
        p.Nombre,
        p.Detalle,
        p.CantidadInventario,
        p.StockCritico,
        p.Activo,
        u.UbicacionResourceId,
        b.Codigo AS CodigoBodega,
        b.Nombre AS Bodega,
        pa.Codigo AS Pasillo,
        e.Codigo AS Estante
    FROM PRODUCTO p
    INNER JOIN UBICACION u ON p.UbicacionId = u.UbicacionId
    INNER JOIN ESTANTE e ON u.EstanteId = e.EstanteId
    INNER JOIN PASILLO pa ON e.PasilloId = pa.PasilloId
    INNER JOIN BODEGA b ON pa.BodegaId = b.BodegaId
    WHERE p.ProductoId = p_ProductoId;
END$$
DELIMITER ;

#ROLES Y USUARIOS

/*
    Consulta los identificadores y nombres de los roles registrados, ordenados por
    nombre.
    Devuelve el listado de roles de usuario.
*/
DELIMITER $$ 
DROP PROCEDURE IF EXISTS sp_ListarRolesUsuario$$
CREATE PROCEDURE sp_ListarRolesUsuario()
BEGIN
    SELECT
        RolUsuarioId,
        RolUsuarioResourceId,
        Nombre
    FROM ROL_USUARIO
    ORDER BY Nombre;
END
$$
DELIMITER ;

/*
    Consulta los datos principales de los usuarios, incluyendo nombre de usuario,
    nombre, apellidos, correo, contrasena cifrada y estado activo. Ordena los
    resultados por nombre de usuario.
    Devuelve el listado de usuarios.
*/
DELIMITER $$ 
DROP PROCEDURE IF EXISTS sp_ListarUsuarios$$
CREATE PROCEDURE sp_ListarUsuarios()
BEGIN
    SELECT
        UsuarioId,
        UsuarioResourceId,
        NombreUsuario,
        Nombre,
        Apellidos,
        Correo,
        ContrasenaHash,
        Activo
    FROM USUARIO
    ORDER BY NombreUsuario;
END
$$
DELIMITER ;

/*
    Consulta la tabla USUARIO filtrando por UsuarioResourceId y limita el
    resultado a un solo registro.
    Devuelve los datos del usuario encontrado.
*/
DELIMITER $$ 
DROP PROCEDURE IF EXISTS sp_ObtenerUsuarioPorResourceId$$
CREATE PROCEDURE sp_ObtenerUsuarioPorResourceId(
    IN p_UsuarioResourceId CHAR(36)
)
BEGIN
    SELECT
        UsuarioId,
        UsuarioResourceId,
        NombreUsuario,
        Nombre,
        Apellidos,
        Correo,
        ContrasenaHash,
        Activo
    FROM USUARIO
    WHERE UsuarioResourceId = p_UsuarioResourceId
    LIMIT 1;
END
$$
DELIMITER ;

/*
    Relaciona el usuario con la tabla intermedia USUARIO_ROL y con ROL_USUARIO
    para obtener los roles asignados al usuario indicado. Ordena los roles por
    nombre.
    Devuelve los roles asociados al usuario.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ListarRolesPorUsuarioResourceId$$

CREATE PROCEDURE sp_ListarRolesPorUsuarioResourceId(
    IN p_UsuarioResourceId CHAR(36)
)
BEGIN
    SELECT
        r.RolUsuarioId,
        r.RolUsuarioResourceId,
        r.Nombre
    FROM USUARIO u
    INNER JOIN USUARIO_ROL ur
        ON ur.UsuarioId = u.UsuarioId
    INNER JOIN ROL_USUARIO r
        ON r.RolUsuarioId = ur.RolUsuarioId
    WHERE u.UsuarioResourceId = p_UsuarioResourceId
    ORDER BY r.Nombre;
END$$

DELIMITER ;

/*
    Consulta la tabla USUARIO filtrando por NombreUsuario y validando que el campo
    Activo sea igual a 1. Limita el resultado a un solo registro.
    Devuelve los datos del usuario activo encontrado.
*/
DELIMITER $$
DROP PROCEDURE IF EXISTS  sp_ObtenerUsuarioPorNombreUsuario$$

CREATE PROCEDURE sp_ObtenerUsuarioPorNombreUsuario(
    IN p_Username VARCHAR(50)
)
BEGIN
    SELECT
        UsuarioId,
        UsuarioResourceId,
        NombreUsuario,
        Nombre,
        Apellidos,
        Correo,
        ContrasenaHash,
        Activo
    FROM USUARIO
    WHERE NombreUsuario = p_Username
      AND Activo = 1
    LIMIT 1;
END $$
DELIMITER ;

/*
    Valida que el identificador del despacho no sea nulo y que el despacho exista
    con estado 'PENDIENTE'. Luego consulta los productos activos agregados al
    carrito del despacho, mostrando su identificador, codigo, nombre y cantidad
    solicitada.
    Devuelve el contenido actual del carrito del despacho
*/
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_VerCarritoDespacho$$
CREATE PROCEDURE sp_VerCarritoDespacho(
    IN p_DespachoId INT
)
BEGIN
    IF p_DespachoId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho es obligatorio.';
    END IF;

    -- validar que el despacho exista y esté pendiente
    IF NOT EXISTS (
        SELECT 1
        FROM DESPACHO
        WHERE DespachoId = p_DespachoId
          AND Estado = 'PENDIENTE'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El despacho no existe o no está pendiente.';
    END IF;

    
    SELECT
        DC.CarritoId,
        DC.ProductoId,
        P.Codigo,
        P.Nombre,
        DC.CantidadSolicitada
    FROM DESPACHO_CARRITO DC
    INNER JOIN PRODUCTO P
        ON P.ProductoId = DC.ProductoId
    WHERE DC.DespachoId = p_DespachoId
      AND P.Activo = 1
    ORDER BY P.Nombre;
END$$

DELIMITER ;