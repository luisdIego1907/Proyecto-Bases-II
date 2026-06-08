using System.ComponentModel.DataAnnotations;

namespace Api.Models.Productos;

public class ModificarProductoRequestModel
{
    [Required]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [Range(0, int.MaxValue)]
    public int StockCritico { get; set; }

    [Required]
    public Guid UbicacionResourceId { get; set; }
}
