using Api.Models.Recepciones;
using Dto.Recepcion;

namespace Api.Mappers;

public static class RecepcionApiMapper
{
    public static RegistrarRecepcionRequestDto ToDto(RegistrarRecepcionRequestModel model)
    {
        return new RegistrarRecepcionRequestDto
        {
            ProductoId = model.ProductoId,
            Cantidad = model.Cantidad,
            ClienteId = model.ClienteId,
            NumeroLote = model.NumeroLote,
            UsuarioId = model.UsuarioId
        };
    }

    public static RegistrarRecepcionResponseModel ToModel(RegistrarRecepcionResponseDto dto)
    {
        return new RegistrarRecepcionResponseModel
        {
            Mensaje = dto.Mensaje,
            ProductoId = dto.ProductoId,
            CantidadIngresada = dto.CantidadIngresada
        };
    }

    public static RecepcionProductoResponseModel ToModel(RecepcionProductoResponseDto dto)
    {
        return new RecepcionProductoResponseModel
        {
            RecepcionId = dto.RecepcionId,
            RecepcionResourceId = dto.RecepcionResourceId,
            FechaRecepcion = dto.FechaRecepcion,
            NumeroLote = dto.NumeroLote,
            Cliente = dto.Cliente,
            CodigoProducto = dto.CodigoProducto,
            Producto = dto.Producto,
            Cantidad = dto.Cantidad,
            Usuario = dto.Usuario
        };
    }
}
