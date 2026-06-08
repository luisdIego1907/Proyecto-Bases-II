using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class DespachoService : IDespachoService
{
     private readonly IDespachoRepository _despachoRepository;

    public DespachoService(IDespachoRepository despachoRepository)
    {
        _despachoRepository = despachoRepository;
    }

    public async Task<CrearDespachoResult?> CrearAsync(
        int clienteId,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        if (clienteId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(clienteId),
                "El identificador del cliente debe ser mayor que cero.");
        }

        if (usuarioId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(usuarioId),
                "El identificador del usuario debe ser mayor que cero.");
        }

        return await _despachoRepository.CrearAsync(
            clienteId,
            usuarioId,
            cancellationToken);
    }

    public async Task<AgregarProductoCarritoResult?> AgregarProductoCarritoAsync(
        int despachoId,
        int productoId,
        int cantidadSolicitada,
        CancellationToken cancellationToken = default)
    {
        if (despachoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(despachoId),
                "El identificador del despacho debe ser mayor que cero.");
        }

        if (productoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(productoId),
                "El identificador del producto debe ser mayor que cero.");
        }

        if (cantidadSolicitada <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(cantidadSolicitada),
                "La cantidad solicitada debe ser mayor que cero.");
        }

        return await _despachoRepository.AgregarProductoCarritoAsync(
            despachoId,
            productoId,
            cantidadSolicitada,
            cancellationToken);
    }

    public async Task<ProcesarDespachoResult?> ProcesarAsync(
        int despachoId,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        if (despachoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(despachoId),
                "El identificador del despacho debe ser mayor que cero.");
        }

        if (usuarioId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(usuarioId),
                "El identificador del usuario debe ser mayor que cero.");
        }

        return await _despachoRepository.ProcesarAsync(
            despachoId,
            usuarioId,
            cancellationToken);
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default)
    {
        return await _despachoRepository.ListarUltimaSemanaAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<DespachoResumenResult>> ListarPorFechaAsync(
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        if (fechaInicio > fechaFin)
        {
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha final.");
        }

        return await _despachoRepository.ListarPorFechaAsync(
            fechaInicio,
            fechaFin,
            cancellationToken);
    }

    public async Task<IReadOnlyList<DetalleDespachoResult>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default)
    {
        if (despachoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(despachoId),
                "El identificador del despacho debe ser mayor que cero.");
        }

        return await _despachoRepository.VerDetalleAsync(
            despachoId,
            cancellationToken);
    }
}
