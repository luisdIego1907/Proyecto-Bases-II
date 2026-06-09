using Infrastructure.Repositories.Results;

namespace Infrastructure.Repositories.Interfaces;

public interface IAuditoriaProductoRepository
{
     Task<IReadOnlyList<AuditoriaProductoResult>> ListarPorProductoAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default);
}
