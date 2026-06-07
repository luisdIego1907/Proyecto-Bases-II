DROP DATABASE IF EXISTS SGID_DB;

CREATE DATABASE SGID_DB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE SGID_DB;

CREATE TABLE ROL_USUARIO (
    RolUsuarioId INT NOT NULL AUTO_INCREMENT,
    RolUsuarioResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    Nombre ENUM("ADMIN","OPERARIO","SUPERVISOR") NOT NULL,

    CONSTRAINT PK_RolUsuario
        PRIMARY KEY (RolUsuarioId),

    CONSTRAINT UQ_RolUsuario_RolUsuarioResourceId
        UNIQUE (RolUsuarioResourceId)
);

-- Atienden recepciones, procesan despachos
CREATE TABLE USUARIO (
    UsuarioId INT NOT NULL AUTO_INCREMENT,
    UsuarioResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    NombreUsuario VARCHAR(50) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Correo VARCHAR(50) NOT NULL UNIQUE,
    ContrasenaHash VARCHAR(255) NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Usuario
        PRIMARY KEY (UsuarioId),

    CONSTRAINT UQ_Usuario_UsuarioResourceId
        UNIQUE (UsuarioResourceId),

    CONSTRAINT UQ_Usuario_NombreUsuario
        UNIQUE (NombreUsuario),
        
	CONSTRAINT CK_Usuario_Activo
    CHECK (Activo IN (0, 1))
);

CREATE TABLE USUARIO_ROL (
    UsuarioId INT NOT NULL,
    RolUsuarioId INT NOT NULL,
    UsuarioRolResourceId CHAR(36) NOT NULL DEFAULT (UUID()),

    CONSTRAINT PK_UsuarioRol
        PRIMARY KEY (UsuarioId, RolUsuarioId),

    CONSTRAINT UQ_UsuarioRol_UsuarioRolResourceId
        UNIQUE (UsuarioRolResourceId),

    CONSTRAINT FK_UsuarioRol_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES USUARIO(UsuarioId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_UsuarioRol_RolUsuario
        FOREIGN KEY (RolUsuarioId)
        REFERENCES ROL_USUARIO(RolUsuarioId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Pueden enviar productos, recibir productos o ambas cosas.
-- RolCliente:
-- ORIGEN  = puede registrar recepciones.
-- DESTINO = puede recibir despachos.
-- AMBOS   = puede registrar recepciones y recibir despachos.
CREATE TABLE CLIENTE (
    ClienteId INT NOT NULL AUTO_INCREMENT,
    ClienteResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    Nombre VARCHAR(150) NOT NULL,
    RolCliente ENUM('ORIGEN', 'DESTINO', 'AMBOS') NOT NULL,
    Telefono VARCHAR(30) NULL,
    Correo VARCHAR(120) NULL,
    Direccion VARCHAR(250) NULL,
    Activo TINYINT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Cliente
        PRIMARY KEY (ClienteId),

    CONSTRAINT UQ_Cliente_ClienteResourceId
        UNIQUE (ClienteResourceId),
        
	CONSTRAINT CK_Cliente_Activo
		CHECK (Activo IN (0, 1))
);

CREATE TABLE BODEGA (
    BodegaId INT NOT NULL AUTO_INCREMENT,
    BodegaResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    Codigo VARCHAR(50) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255) NULL,

    CONSTRAINT PK_Bodega
        PRIMARY KEY (BodegaId),

    CONSTRAINT UQ_Bodega_BodegaResourceId
        UNIQUE (BodegaResourceId),

    CONSTRAINT UQ_Bodega_Codigo
        UNIQUE (Codigo)
);

CREATE TABLE PASILLO (
    PasilloId INT NOT NULL AUTO_INCREMENT,
    PasilloResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    BodegaId INT NOT NULL,
    Codigo VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255) NULL,

    CONSTRAINT PK_Pasillo
        PRIMARY KEY (PasilloId),

    CONSTRAINT UQ_Pasillo_PasilloResourceId
        UNIQUE (PasilloResourceId),

    CONSTRAINT UQ_Pasillo_Bodega_Codigo
        UNIQUE (BodegaId, Codigo),

    CONSTRAINT FK_Pasillo_Bodega
        FOREIGN KEY (BodegaId)
        REFERENCES BODEGA(BodegaId)
);

CREATE TABLE ESTANTE (
    EstanteId INT NOT NULL AUTO_INCREMENT,
    EstanteResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    PasilloId INT NOT NULL,
    Codigo VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255) NULL,

    CONSTRAINT PK_Estante
        PRIMARY KEY (EstanteId),

    CONSTRAINT UQ_Estante_EstanteResourceId
        UNIQUE (EstanteResourceId),

    CONSTRAINT UQ_Estante_Pasillo_Codigo
        UNIQUE (PasilloId, Codigo),

    CONSTRAINT FK_Estante_Pasillo
        FOREIGN KEY (PasilloId)
        REFERENCES PASILLO(PasilloId)
);

CREATE TABLE UBICACION (
    UbicacionId INT NOT NULL AUTO_INCREMENT,
    UbicacionResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    EstanteId INT NOT NULL,

    CONSTRAINT PK_Ubicacion
        PRIMARY KEY (UbicacionId),

    CONSTRAINT UQ_Ubicacion_UbicacionResourceId
        UNIQUE (UbicacionResourceId),

    CONSTRAINT UQ_Ubicacion_Estante
        UNIQUE (EstanteId),

    CONSTRAINT FK_Ubicacion_Estante
        FOREIGN KEY (EstanteId)
        REFERENCES ESTANTE(EstanteId)
);

CREATE TABLE PRODUCTO (
    ProductoId INT NOT NULL AUTO_INCREMENT,
    ProductoResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    Codigo VARCHAR(50) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Detalle VARCHAR(255) NULL,
    StockCritico INT NOT NULL,
    CantidadInventario INT NOT NULL DEFAULT 0,
    UbicacionId INT NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Producto
        PRIMARY KEY (ProductoId),

    CONSTRAINT UQ_Producto_ProductoResourceId
        UNIQUE (ProductoResourceId),

    CONSTRAINT UQ_Producto_Codigo
        UNIQUE (Codigo),

    CONSTRAINT CK_Producto_StockCritico
        CHECK (StockCritico >= 0),

    CONSTRAINT CK_Producto_CantidadInventario
        CHECK (CantidadInventario >= 0),

    CONSTRAINT CK_Producto_Activo
        CHECK (Activo IN (0, 1)),

    CONSTRAINT FK_Producto_Ubicacion
        FOREIGN KEY (UbicacionId)
        REFERENCES UBICACION(UbicacionId)
);

-- Registra los ingresos de mercancía al inventario.
-- Cada recepción pertenece a un cliente, un producto y un usuario.
CREATE TABLE RECEPCION (
    RecepcionId INT NOT NULL AUTO_INCREMENT,
    RecepcionResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    ClienteId INT NOT NULL,
    ProductoId INT NOT NULL,
    UsuarioId INT NOT NULL,
    NumeroLote VARCHAR(100) NOT NULL,
    Cantidad INT NOT NULL,
    FechaRecepcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Recepcion
        PRIMARY KEY (RecepcionId),

    CONSTRAINT UQ_Recepcion_RecepcionResourceId
        UNIQUE (RecepcionResourceId),

    CONSTRAINT FK_Recepcion_Cliente
        FOREIGN KEY (ClienteId)
        REFERENCES CLIENTE(ClienteId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Recepcion_Producto
        FOREIGN KEY (ProductoId)
        REFERENCES PRODUCTO(ProductoId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Recepcion_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES USUARIO(UsuarioId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT CK_Recepcion_Cantidad
        CHECK (Cantidad > 0)
);

-- Registra las órdenes de salida.
-- El despacho inicia como PENDIENTE y luego puede pasar a PROCESADO o CANCELADO.

CREATE TABLE DESPACHO (
    DespachoId INT NOT NULL AUTO_INCREMENT,
    DespachoResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    ClienteId INT NOT NULL,
    UsuarioId INT NOT NULL,
    FechaDespacho DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Estado ENUM('PENDIENTE', 'PROCESADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT PK_Despacho
        PRIMARY KEY (DespachoId),

    CONSTRAINT UQ_Despacho_DespachoResourceId
        UNIQUE (DespachoResourceId),

    CONSTRAINT FK_Despacho_Cliente
        FOREIGN KEY (ClienteId)
        REFERENCES CLIENTE(ClienteId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_Despacho_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES USUARIO(UsuarioId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- TABLA: DESPACHO_CARRITO
-- Tabla lógica para agregar productos a un despacho antes de procesarlo.
-- Si el despacho se procesa correctamente, los datos pasan a DESPACHO_DETALLE.
-- Si falla por falta de stock, se limpia esta tabla.
CREATE TABLE DESPACHO_CARRITO (
    CarritoId INT NOT NULL AUTO_INCREMENT,
    CarritoResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    DespachoId INT NOT NULL,
    ProductoId INT NOT NULL,
    CantidadSolicitada INT NOT NULL,

    CONSTRAINT PK_DespachoCarrito
        PRIMARY KEY (CarritoId),

    CONSTRAINT UQ_DespachoCarrito_CarritoResourceId
        UNIQUE (CarritoResourceId),

    CONSTRAINT UQ_DespachoCarrito_Despacho_Producto
        UNIQUE (DespachoId, ProductoId),

    CONSTRAINT FK_DespachoCarrito_Despacho
        FOREIGN KEY (DespachoId)
        REFERENCES DESPACHO(DespachoId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT FK_DespachoCarrito_Producto
        FOREIGN KEY (ProductoId)
        REFERENCES PRODUCTO(ProductoId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT CK_DespachoCarrito_CantidadSolicitada
        CHECK (CantidadSolicitada > 0)
);

-- TABLA: DESPACHO_DETALLE
-- Almacena los productos oficialmente despachados. Se llena solo cuando el despacho fue procesado
CREATE TABLE DESPACHO_DETALLE (
    DetalleId INT NOT NULL AUTO_INCREMENT,
    DetalleResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    DespachoId INT NOT NULL,
    ProductoId INT NOT NULL,
    CantidadDespachada INT NOT NULL,

    CONSTRAINT PK_DespachoDetalle
        PRIMARY KEY (DetalleId),

    CONSTRAINT UQ_DespachoDetalle_DetalleResourceId
        UNIQUE (DetalleResourceId),

    CONSTRAINT UQ_DespachoDetalle_Despacho_Producto
        UNIQUE (DespachoId, ProductoId),

    CONSTRAINT FK_DespachoDetalle_Despacho
        FOREIGN KEY (DespachoId)
        REFERENCES DESPACHO(DespachoId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_DespachoDetalle_Producto
        FOREIGN KEY (ProductoId)
        REFERENCES PRODUCTO(ProductoId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT CK_DespachoDetalle_CantidadDespachada
        CHECK (CantidadDespachada > 0)
);

--  Registra los cambios de inventario. Alimentada por el trigger tg_AuditoriaInventario.
CREATE TABLE AUDITORIA_PRODUCTO (
    AuditoriaId INT NOT NULL AUTO_INCREMENT,
    AuditoriaResourceId CHAR(36) NOT NULL DEFAULT (UUID()),
    ProductoId INT NOT NULL,
    UsuarioId INT NOT NULL,
    FechaCambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CantidadAnterior INT NOT NULL,
    CantidadNueva INT NOT NULL,
    TipoMovimiento ENUM('INCREMENTO', 'REDUCCION') NOT NULL,

    CONSTRAINT PK_AuditoriaProducto
        PRIMARY KEY (AuditoriaId),

    CONSTRAINT UQ_AuditoriaProducto_AuditoriaResourceId
        UNIQUE (AuditoriaResourceId),

    CONSTRAINT FK_AuditoriaProducto_Producto
        FOREIGN KEY (ProductoId)
        REFERENCES PRODUCTO(ProductoId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT FK_AuditoriaProducto_Usuario
        FOREIGN KEY (UsuarioId)
        REFERENCES USUARIO(UsuarioId)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ÍNDICES 

-- CLIENTE
CREATE INDEX ix_Cliente_RolCliente_Activo_Nombre
ON CLIENTE (RolCliente, Activo, Nombre);

-- PRODUCTO
CREATE INDEX ix_Producto_Activo_Nombre
ON PRODUCTO (Activo, Nombre);

CREATE INDEX ix_Producto_Activo_CantidadInventario
ON PRODUCTO (Activo, CantidadInventario);

-- RECEPCION
CREATE INDEX ix_Recepcion_Producto_FechaRecepcion
ON RECEPCION (ProductoId, FechaRecepcion DESC);

-- DESPACHO
CREATE INDEX ix_Despacho_Cliente_FechaDespacho
ON DESPACHO (ClienteId, FechaDespacho DESC);

-- AUDITORIA_PRODUCTO
CREATE INDEX ix_AuditoriaProducto_Producto_FechaCambio
ON AUDITORIA_PRODUCTO (ProductoId, FechaCambio DESC);

CREATE INDEX ix_AuditoriaProducto_Usuario_FechaCambio
ON AUDITORIA_PRODUCTO (UsuarioId, FechaCambio DESC);
