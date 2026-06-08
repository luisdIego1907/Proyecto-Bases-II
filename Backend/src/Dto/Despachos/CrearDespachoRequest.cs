using System.ComponentModel.DataAnnotations;

namespace Dto.Despachos;

public class CrearDespachoRequest
{
     [Required]
    [Range(1, int.MaxValue)]
    public int ClienteId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int UsuarioId { get; set; }
}
