using Infrastructure.Repositories.Results;

namespace Infrastructure.Repositories.Interfaces;

public interface IRecepcionRepository
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
