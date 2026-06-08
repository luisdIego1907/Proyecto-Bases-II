using Api.Models.Auditorias;
using Dto.Auditoria;

namespace Api.Mappers;

public static class AuditoriaProductoApiMapper
{
     public static AuditoriaProductoResponseModel ToModel(
        AuditoriaProductoResponseDto dto)
    {
        return new AuditoriaProductoResponseModel
        {
            AuditoriaId = dto.AuditoriaId,
            AuditoriaResourceId = dto.AuditoriaResourceId,
            FechaCambio = dto.FechaCambio,
            CodigoProducto = dto.CodigoProducto,
            Producto = dto.Producto,
            CantidadAnterior = dto.CantidadAnterior,
            CantidadNueva = dto.CantidadNueva,
            TipoMovimiento = dto.TipoMovimiento,
            Usuario = dto.Usuario
        };
    }
}
