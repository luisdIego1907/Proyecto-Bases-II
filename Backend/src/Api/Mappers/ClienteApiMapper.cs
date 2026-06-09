using Api.Models.Clientes;
using Dto;

namespace Api.Mappers;

public static class ClienteApiMapper
{
      public static CrearClienteRequestDto ToDto(CrearClienteRequestModel model)
    {
        return new CrearClienteRequestDto
        {
            Nombre = model.Nombre,
            RolCliente = model.RolCliente,
            Telefono = model.Telefono,
            Correo = model.Correo,
            Direccion = model.Direccion
        };
    }

    public static ModificarClienteRequestDto ToDto(ModificarClienteRequestModel model)
    {
        return new ModificarClienteRequestDto
        {
            Nombre = model.Nombre,
            RolCliente = model.RolCliente,
            Telefono = model.Telefono,
            Correo = model.Correo,
            Direccion = model.Direccion,
            Activo = model.Activo
        };
    }

    public static ClienteResponseModel ToModel(ClienteResponseDto dto)
    {
        return new ClienteResponseModel
        {
            ClienteId = dto.ClienteId,
            ClienteResourceId = dto.ClienteResourceId,
            Nombre = dto.Nombre,
            RolCliente = dto.RolCliente,
            Telefono = dto.Telefono,
            Correo = dto.Correo,
            Direccion = dto.Direccion,
            Activo = dto.Activo
        };
    }
}
