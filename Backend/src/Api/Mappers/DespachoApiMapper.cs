using Api.Models.Despachos;
using Dto.Despachos;

namespace Api.Mappers;

public static class DespachoApiMapper
{
     public static CrearDespachoRequestDto ToDto(CrearDespachoRequestModel model)
    {
        return new CrearDespachoRequestDto
        {
            ClienteId = model.ClienteId,
            UsuarioId = model.UsuarioId
        };
    }

    public static AgregarProductoCarritoRequestDto ToDto(
        AgregarProductoCarritoRequestModel model)
    {
        return new AgregarProductoCarritoRequestDto
        {
            DespachoId = model.DespachoId,
            ProductoId = model.ProductoId,
            CantidadSolicitada = model.CantidadSolicitada
        };
    }

    public static ProcesarDespachoRequestDto ToDto(ProcesarDespachoRequestModel model)
    {
        return new ProcesarDespachoRequestDto
        {
            DespachoId = model.DespachoId,
            UsuarioId = model.UsuarioId
        };
    }

    public static CrearDespachoResponseModel ToModel(CrearDespachoResponseDto dto)
    {
        return new CrearDespachoResponseModel
        {
            Mensaje = dto.Mensaje,
            DespachoId = dto.DespachoId
        };
    }

    public static AgregarProductoCarritoResponseModel ToModel(
        AgregarProductoCarritoResponseDto dto)
    {
        return new AgregarProductoCarritoResponseModel
        {
            Mensaje = dto.Mensaje,
            DespachoId = dto.DespachoId,
            ProductoId = dto.ProductoId,
            CantidadAgregada = dto.CantidadAgregada
        };
    }

    public static ProcesarDespachoResponseModel ToModel(
        ProcesarDespachoResponseDto dto)
    {
        return new ProcesarDespachoResponseModel
        {
            Mensaje = dto.Mensaje,
            DespachoId = dto.DespachoId
        };
    }

    public static DespachoResumenResponseModel ToModel(
        DespachoResumenResponseDto dto)
    {
        return new DespachoResumenResponseModel
        {
            DespachoId = dto.DespachoId,
            DespachoResourceId = dto.DespachoResourceId,
            FechaDespacho = dto.FechaDespacho,
            Cliente = dto.Cliente,
            Estado = dto.Estado,
            Operario = dto.Operario
        };
    }

    public static DetalleDespachoResponseModel ToModel(
        DetalleDespachoResponseDto dto)
    {
        return new DetalleDespachoResponseModel
        {
            DespachoId = dto.DespachoId,
            Codigo = dto.Codigo,
            Producto = dto.Producto,
            CantidadDespachada = dto.CantidadDespachada
        };
    }
}
