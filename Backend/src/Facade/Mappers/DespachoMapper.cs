using Dto.Despachos;
using Infrastructure.Repositories.Results;

namespace Facade.Mappers;

public static class DespachoMapper
{
       public static CrearDespachoResponseDto ToResponseDto(CrearDespachoResult despacho)
    {
        return new CrearDespachoResponseDto
        {
            Mensaje = despacho.Mensaje,
            DespachoId = despacho.DespachoId
        };
    }

    public static AgregarProductoCarritoResponseDto ToResponseDto(
        AgregarProductoCarritoResult resultado)
    {
        return new AgregarProductoCarritoResponseDto
        {
            Mensaje = resultado.Mensaje,
            DespachoId = resultado.DespachoId,
            ProductoId = resultado.ProductoId,
            CantidadAgregada = resultado.CantidadAgregada
        };
    }

    public static ProcesarDespachoResponseDto ToResponseDto(
        ProcesarDespachoResult despacho)
    {
        return new ProcesarDespachoResponseDto
        {
            Mensaje = despacho.Mensaje,
            DespachoId = despacho.DespachoId
        };
    }

    public static DespachoResumenResponseDto ToResponseDto(
        DespachoResumenResult despacho)
    {
        return new DespachoResumenResponseDto
        {
            DespachoId = despacho.DespachoId,
            DespachoResourceId = despacho.DespachoResourceId,
            FechaDespacho = despacho.FechaDespacho,
            Cliente = despacho.Cliente,
            Estado = despacho.Estado,
            Operario = despacho.Operario
        };
    }

    public static DetalleDespachoResponseDto ToResponseDto(
        DetalleDespachoResult detalle)
    {
        return new DetalleDespachoResponseDto
        {
            DespachoId = detalle.DespachoId,
            Codigo = detalle.Codigo,
            Producto = detalle.Producto,
            CantidadDespachada = detalle.CantidadDespachada
        };
    }
}
