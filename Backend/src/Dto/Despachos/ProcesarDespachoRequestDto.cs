using System.ComponentModel.DataAnnotations;

namespace Dto.Despachos;

public class ProcesarDespachoRequestDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int DespachoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int UsuarioId { get; set; }
}
