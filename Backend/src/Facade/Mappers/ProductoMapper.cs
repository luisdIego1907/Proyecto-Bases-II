using Dto;
using Infrastructure.Repositories.Results;

namespace Facade.Mappers;

public static class ProductoMapper
{
    public static ProductoDetalleResponseDto ToResponseDto(ProductoDetalleResult producto)
    {
        return new ProductoDetalleResponseDto
        {
            ProductoId = producto.ProductoId,
            ProductoResourceId = producto.ProductoResourceId,
            Codigo = producto.Codigo,
            Nombre = producto.Nombre,
            Detalle = producto.Detalle,
            CantidadInventario = producto.CantidadInventario,
            StockCritico = producto.StockCritico,
            Activo = producto.Activo,
            UbicacionResourceId = producto.UbicacionResourceId,
            CodigoBodega = producto.CodigoBodega,
            Bodega = producto.Bodega,
            Pasillo = producto.Pasillo,
            Estante = producto.Estante
        };
    }

     public static InventarioProductoResponseDto ToResponseDto(InventarioProductoResult producto)
    {
        return new InventarioProductoResponseDto
        {
            ProductoId = producto.ProductoId,
            ProductoResourceId = producto.ProductoResourceId,
            Codigo = producto.Codigo,
            Nombre = producto.Nombre,
            Detalle = producto.Detalle,
            CodigoBodega = producto.CodigoBodega,
            Bodega = producto.Bodega,
            Pasillo = producto.Pasillo,
            Estante = producto.Estante,
            UbicacionResourceId = producto.UbicacionResourceId,
            CantidadInventario = producto.CantidadInventario,
            StockCritico = producto.StockCritico,
            EstadoStock = producto.EstadoStock,
            UltimoIngreso = producto.UltimoIngreso,
            UltimoDespacho = producto.UltimoDespacho
        };
    }

    public static MovimientoProductoResponseDto ToResponseDto(MovimientoProductoResult movimiento)
    {
        return new MovimientoProductoResponseDto
        {
            Fecha = movimiento.Fecha,
            TipoMovimiento = movimiento.TipoMovimiento,
            Cliente = movimiento.Cliente,
            CodigoProducto = movimiento.CodigoProducto,
            Producto = movimiento.Producto,
            Cantidad = movimiento.Cantidad,
            Usuario = movimiento.Usuario
        };
    }

}
