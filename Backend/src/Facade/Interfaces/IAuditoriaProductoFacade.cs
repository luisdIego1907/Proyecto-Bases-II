using Dto;
using Dto.Auditoria;

namespace Facade.Interfaces;

public interface IAuditoriaProductoFacade
{
    Task<IReadOnlyList<AuditoriaProductoResponseDto>> ListarPorProductoAsync(
        int productoId,
        RangoFechaRequestDto request,
        CancellationToken cancellationToken = default);
}
