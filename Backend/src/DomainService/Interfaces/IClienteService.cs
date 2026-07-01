using Domain.Entities;

namespace DomainService.Interfaces;

public interface IClienteService
{
    Task<IReadOnlyList<Cliente>> ListarAsync(
        CancellationToken cancellationToken = default);

    Task<Cliente?> CrearAsync(
        Cliente cliente,
        CancellationToken cancellationToken = default);

    Task<Cliente?> ModificarAsync(
        Cliente cliente,
        CancellationToken cancellationToken = default);

    Task EliminarAsync(
        Guid clienteResourceId,
        CancellationToken cancellationToken = default);
}
