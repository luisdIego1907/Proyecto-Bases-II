using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class RecepcionService :IRecepcionService
{
      private readonly IRecepcionRepository _recepcionRepository;

    public RecepcionService(IRecepcionRepository recepcionRepository)
    {
        _recepcionRepository = recepcionRepository;
    }

    public async Task<RegistrarRecepcionResult?> RegistrarAsync(
        int productoId,
        int cantidad,
        int clienteId,
        string numeroLote,
        int usuarioId,
        CancellationToken cancellationToken = default)
    {
        if (productoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(productoId),
                "El identificador del producto debe ser mayor que cero.");
        }

        if (cantidad <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(cantidad),
                "La cantidad recibida debe ser mayor que cero.");
        }

        if (clienteId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(clienteId),
                "El identificador del cliente debe ser mayor que cero.");
        }

        if (string.IsNullOrWhiteSpace(numeroLote))
        {
            throw new ArgumentException("El número de lote es obligatorio.");
        }

        if (usuarioId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(usuarioId),
                "El identificador del usuario debe ser mayor que cero.");
        }

        return await _recepcionRepository.RegistrarAsync(
            productoId,
            cantidad,
            clienteId,
            numeroLote.Trim(),
            usuarioId,
            cancellationToken);
    }

    public async Task<IReadOnlyList<RecepcionProductoResult>> ListarPorProductoAsync(
        int productoId,
        CancellationToken cancellationToken = default)
    {
        if (productoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(productoId),
                "El identificador del producto debe ser mayor que cero.");
        }

        return await _recepcionRepository.ListarPorProductoAsync(
            productoId,
            cancellationToken);
    }
}
