using System.ComponentModel.DataAnnotations;

namespace Dto;

public class ModificarProductoRequestDto
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
