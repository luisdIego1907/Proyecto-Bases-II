using System.ComponentModel.DataAnnotations;

namespace Api.Models.Despachos;

public class ProcesarDespachoRequestModel
{
     [Required]
    [Range(1, int.MaxValue)]
    public int DespachoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int UsuarioId { get; set; }
}
