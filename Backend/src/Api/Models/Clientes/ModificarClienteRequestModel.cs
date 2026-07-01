using System.ComponentModel.DataAnnotations;

namespace Api.Models.Clientes;

public class ModificarClienteRequestModel
{
    [Required]
    [StringLength(150)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [RegularExpression("ORIGEN|DESTINO|AMBOS")]
    public string RolCliente { get; set; } = string.Empty;

    [StringLength(30)]
    public string? Telefono { get; set; }

    [StringLength(120)]
    public string? Correo { get; set; }

    [StringLength(250)]
    public string? Direccion { get; set; }

    [Required]
    public bool Activo { get; set; }
}
