namespace Api.Models.Clientes;

public class ClienteResponseModel
{
    public int ClienteId { get; set; }

    public Guid ClienteResourceId { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string RolCliente { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public string? Direccion { get; set; }

    public bool Activo { get; set; }
}
