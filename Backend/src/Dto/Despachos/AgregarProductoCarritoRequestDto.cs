using System.ComponentModel.DataAnnotations;

namespace Dto.Despachos;

public class AgregarProductoCarritoRequestDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int DespachoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int ProductoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int CantidadSolicitada { get; set; }
}
