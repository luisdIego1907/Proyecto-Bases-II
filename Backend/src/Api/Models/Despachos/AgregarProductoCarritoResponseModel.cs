using System.ComponentModel.DataAnnotations;

namespace Api.Models.Despachos;

public class AgregarProductoCarritoResponseModel
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
