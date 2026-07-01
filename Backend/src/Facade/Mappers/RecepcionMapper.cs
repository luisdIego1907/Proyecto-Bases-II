using Dto.Recepcion;
using Infrastructure.Repositories.Results;

namespace Facade.Mappers;

public static class RecepcionMapper
{
     public static RegistrarRecepcionResponseDto ToResponseDto(RegistrarRecepcionResult recepcion)
    {
        return new RegistrarRecepcionResponseDto
        {
            Mensaje = recepcion.Mensaje,
            ProductoId = recepcion.ProductoId,
            CantidadIngresada = recepcion.CantidadIngresada
        };
    }

    public static RecepcionProductoResponseDto ToResponseDto(RecepcionProductoResult recepcion)
    {
        return new RecepcionProductoResponseDto
        {
            RecepcionId = recepcion.RecepcionId,
            RecepcionResourceId = recepcion.RecepcionResourceId,
            FechaRecepcion = recepcion.FechaRecepcion,
            NumeroLote = recepcion.NumeroLote,
            Cliente = recepcion.Cliente,
            CodigoProducto = recepcion.CodigoProducto,
            Producto = recepcion.Producto,
            Cantidad = recepcion.Cantidad,
            Usuario = recepcion.Usuario
        };
    }
}
