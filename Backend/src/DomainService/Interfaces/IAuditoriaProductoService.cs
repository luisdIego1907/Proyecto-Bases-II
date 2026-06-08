using Infrastructure.Repositories.Results;

namespace DomainService.Interfaces;

public interface IAuditoriaProductoService
{
    Task<IReadOnlyList<AuditoriaProductoResult>> ListarPorProductoAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default);
}
