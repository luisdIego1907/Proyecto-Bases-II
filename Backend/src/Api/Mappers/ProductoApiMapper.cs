using Api.Models.Productos;
using Dto;

namespace Api.Mappers;

public static class ProductoApiMapper
{
     public static IngresarProductoRequestDto ToDto(IngresarProductoRequestModel model)
    {
        return new IngresarProductoRequestDto
        {
            Codigo = model.Codigo,
            Nombre = model.Nombre,
            Detalle = model.Detalle,
            StockCritico = model.StockCritico,
            Bodega = model.Bodega,
            Pasillo = model.Pasillo,
            Estante = model.Estante
        };
    }

    public static ModificarProductoRequestDto ToDto(ModificarProductoRequestModel model)
    {
        return new ModificarProductoRequestDto
        {
            Nombre = model.Nombre,
            StockCritico = model.StockCritico,
            UbicacionResourceId = model.UbicacionResourceId
        };
    }

    public static ProductoDetalleResponseModel ToModel(ProductoDetalleResponseDto dto)
    {
        return new ProductoDetalleResponseModel
        {
            ProductoId = dto.ProductoId,
            ProductoResourceId = dto.ProductoResourceId,
            Codigo = dto.Codigo,
            Nombre = dto.Nombre,
            Detalle = dto.Detalle,
            CantidadInventario = dto.CantidadInventario,
            StockCritico = dto.StockCritico,
            Activo = dto.Activo,
            UbicacionResourceId = dto.UbicacionResourceId,
            CodigoBodega = dto.CodigoBodega,
            Bodega = dto.Bodega,
            Pasillo = dto.Pasillo,
            Estante = dto.Estante
        };
    }

    public static InventarioProductoResponseModel ToModel(InventarioProductoResponseDto dto)
    {
        return new InventarioProductoResponseModel
        {
            ProductoId = dto.ProductoId,
            ProductoResourceId = dto.ProductoResourceId,
            Codigo = dto.Codigo,
            Nombre = dto.Nombre,
            Detalle = dto.Detalle,
            CodigoBodega = dto.CodigoBodega,
            Bodega = dto.Bodega,
            Pasillo = dto.Pasillo,
            Estante = dto.Estante,
            UbicacionResourceId = dto.UbicacionResourceId,
            CantidadInventario = dto.CantidadInventario,
            StockCritico = dto.StockCritico,
            EstadoStock = dto.EstadoStock,
            UltimoIngreso = dto.UltimoIngreso,
            UltimoDespacho = dto.UltimoDespacho
        };
    }

    public static MovimientoProductoResponseModel ToModel(MovimientoProductoResponseDto dto)
    {
        return new MovimientoProductoResponseModel
        {
            Fecha = dto.Fecha,
            TipoMovimiento = dto.TipoMovimiento,
            Cliente = dto.Cliente,
            CodigoProducto = dto.CodigoProducto,
            Producto = dto.Producto,
            Cantidad = dto.Cantidad,
            Usuario = dto.Usuario
        };
    }
}
