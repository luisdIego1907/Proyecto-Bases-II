using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;

namespace DomainService.Services;

public class AuditoriaProductoService : IAuditoriaProductoService
{
     private readonly IAuditoriaProductoRepository _auditoriaProductoRepository;

    public AuditoriaProductoService(
        IAuditoriaProductoRepository auditoriaProductoRepository)
    {
        _auditoriaProductoRepository = auditoriaProductoRepository;
    }

    public async Task<IReadOnlyList<AuditoriaProductoResult>> ListarPorProductoAsync(
        int productoId,
        DateTime fechaInicio,
        DateTime fechaFin,
        CancellationToken cancellationToken = default)
    {
        if (productoId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(productoId),
                "El identificador del producto debe ser mayor que cero.");
        }

        if (fechaInicio > fechaFin)
        {
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha final.");
        }

        return await _auditoriaProductoRepository.ListarPorProductoAsync(
            productoId,
            fechaInicio,
            fechaFin,
            cancellationToken);
    }
}
