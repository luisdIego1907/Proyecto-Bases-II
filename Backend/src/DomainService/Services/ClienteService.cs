using Domain.Entities;
using DomainService.Interfaces;
using Infrastructure.Repositories.Interfaces;

namespace DomainService.Services;

public class ClienteService : IClienteService
{
     private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<IReadOnlyList<Cliente>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        return await _clienteRepository.ListarAsync(cancellationToken);
    }

    public async Task<Cliente?> CrearAsync(
        Cliente cliente,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(cliente.Nombre))
        {
            throw new ArgumentException("El nombre del cliente es obligatorio.");
        }

        return await _clienteRepository.CrearAsync(cliente, cancellationToken);
    }

    public async Task<Cliente?> ModificarAsync(
        Cliente cliente,
        CancellationToken cancellationToken = default)
    {
        if (cliente.ClienteResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del cliente es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(cliente.Nombre))
        {
            throw new ArgumentException("El nombre del cliente es obligatorio.");
        }

        return await _clienteRepository.ModificarAsync(cliente, cancellationToken);
    }

    public async Task EliminarAsync(
        Guid clienteResourceId,
        CancellationToken cancellationToken = default)
    {
        if (clienteResourceId == Guid.Empty)
        {
            throw new ArgumentException("El identificador del cliente es obligatorio.");
        }

        await _clienteRepository.EliminarAsync(clienteResourceId, cancellationToken);
    }
}
