using Infrastructure.Repositories.Results;

namespace DomainService.Interfaces;

public interface IRecepcionService
{
    Task<RegistrarRecepcionResult?> RegistrarAsync(
        int productoId,
        int cantidad,
        int clienteId,
        string numeroLote,
        int usuarioId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RecepcionProductoResult>> ListarPorProductoAsync(
        int productoId,
        CancellationToken cancellationToken = default);
}
