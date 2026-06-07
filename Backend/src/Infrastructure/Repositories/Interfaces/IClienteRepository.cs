using Domain.Entities;

namespace Infrastructure.Repositories.Interfaces;

public interface IClienteRepository
{
     Task<IReadOnlyList<Cliente>> ListarAsync(CancellationToken cancellationToken = default);

    Task<Cliente?> CrearAsync(Cliente cliente, CancellationToken cancellationToken = default);

    Task<Cliente?> ModificarAsync(Cliente cliente, CancellationToken cancellationToken = default);

    Task EliminarAsync(Guid clienteResourceId, CancellationToken cancellationToken = default);
}
