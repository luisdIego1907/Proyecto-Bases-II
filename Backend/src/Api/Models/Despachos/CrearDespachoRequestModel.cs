using System.ComponentModel.DataAnnotations;

namespace Api.Models.Despachos;

public class CrearDespachoRequestModel
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ClienteId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int UsuarioId { get; set; }
}
