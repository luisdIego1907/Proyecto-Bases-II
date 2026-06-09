using Domain.Entities;
using Domain.Entities.Values;
using Dto;


namespace Facade.Mappers;

public static class ClienteMapper
{
     public static Cliente ToEntity(CrearClienteRequestDto request)
    {
        return new Cliente
        {
            Nombre = request.Nombre.Trim(),
            RolCliente = Enum.Parse<RolClienteValues>(request.RolCliente, true),
            Telefono = request.Telefono?.Trim(),
            Correo = request.Correo?.Trim(),
            Direccion = request.Direccion?.Trim()
        };
    }

    public static Cliente ToEntity(Guid clienteResourceId, ModificarClienteRequestDto request)
    {
        return new Cliente
        {
            ClienteResourceId = clienteResourceId,
            Nombre = request.Nombre.Trim(),
            RolCliente = Enum.Parse<RolClienteValues>(request.RolCliente, true),
            Telefono = request.Telefono?.Trim(),
            Correo = request.Correo?.Trim(),
            Direccion = request.Direccion?.Trim(),
            Activo = request.Activo
        };
    }

    public static ClienteResponseDto ToResponseDto(Cliente cliente)
    {
        return new ClienteResponseDto
        {
            ClienteId = cliente.ClienteId,
            ClienteResourceId = cliente.ClienteResourceId,
            Nombre = cliente.Nombre,
            RolCliente = cliente.RolCliente.ToString(),
            Telefono = cliente.Telefono,
            Correo = cliente.Correo,
            Direccion = cliente.Direccion,
            Activo = cliente.Activo
        };
    }
}
