using Domain.Entities;
using Domain.Entities.Values;
using DomainService.Interfaces;
using Dto;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class ClienteFacade : IClienteFacade
{
     private readonly IClienteService _clienteService;

    public ClienteFacade(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

 public async Task<IReadOnlyList<ClienteResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default)
    {
        var clientes = await _clienteService.ListarAsync(cancellationToken);

        return clientes
            .Select(ClienteMapper.ToResponseDto)
            .ToList();
    }

    public async Task<ClienteResponseDto?> CrearAsync(
        CrearClienteRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var cliente = ClienteMapper.ToEntity(request);

        var clienteCreado = await _clienteService.CrearAsync(
            cliente,
            cancellationToken);

        return clienteCreado is null
            ? null
            : ClienteMapper.ToResponseDto(clienteCreado);
    }

    public async Task<ClienteResponseDto?> ModificarAsync(
        Guid clienteResourceId,
        ModificarClienteRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var cliente = ClienteMapper.ToEntity(clienteResourceId, request);

        var clienteModificado = await _clienteService.ModificarAsync(
            cliente,
            cancellationToken);

        return clienteModificado is null
            ? null
            : ClienteMapper.ToResponseDto(clienteModificado);
    }

    public async Task EliminarAsync(
        Guid clienteResourceId,
        CancellationToken cancellationToken = default)
    {
        await _clienteService.EliminarAsync(
            clienteResourceId,
            cancellationToken);
    }
}
