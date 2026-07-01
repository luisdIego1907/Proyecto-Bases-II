using Dto.Auditoria;
using Infrastructure.Repositories.Results;

namespace Facade.Mappers;

public static class AuditoriaProductoMapper
{
     public static AuditoriaProductoResponseDto ToResponseDto(
        AuditoriaProductoResult auditoria)
    {
        return new AuditoriaProductoResponseDto
        {
            AuditoriaId = auditoria.AuditoriaId,
            AuditoriaResourceId = auditoria.AuditoriaResourceId,
            FechaCambio = auditoria.FechaCambio,
            CodigoProducto = auditoria.CodigoProducto,
            Producto = auditoria.Producto,
            CantidadAnterior = auditoria.CantidadAnterior,
            CantidadNueva = auditoria.CantidadNueva,
            TipoMovimiento = auditoria.TipoMovimiento,
            Usuario = auditoria.Usuario
        };
    }
}
