using Infrastructure.Repositories.Results;

namespace Infrastructure.Repositories.Interfaces;

public interface IDespachoRepository
{
    Task<CrearDespachoResult?> CrearAsync(
        int clienteId,
        int usuarioId,
        CancellationToken cancellationToken = default);

    Task<AgregarProductoCarritoResult?> AgregarProductoCarritoAsync(
        int despachoId,
        int productoId,
        int cantidadSolicitada,
        CancellationToken cancellationToken = default);

    Task<ProcesarDespachoResult?> ProcesarAsync(
        int despachoId,
        int usuarioId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DespachoResumenResult>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DespachoResumenResult>> ListarPorFechaAsync(
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DetalleDespachoResult>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default);
}
