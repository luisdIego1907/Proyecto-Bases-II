using Dto;

namespace Facade.Interfaces;

public interface IClienteFacade
{
     Task<IReadOnlyList<ClienteResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default);

    Task<ClienteResponseDto?> CrearAsync(
        CrearClienteRequestDto request,
        CancellationToken cancellationToken = default);

    Task<ClienteResponseDto?> ModificarAsync(
        Guid clienteResourceId,
        ModificarClienteRequestDto request,
        CancellationToken cancellationToken = default);

    Task EliminarAsync(
        Guid clienteResourceId,
        CancellationToken cancellationToken = default);
}
