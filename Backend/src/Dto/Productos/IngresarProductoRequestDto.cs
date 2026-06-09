using System.ComponentModel.DataAnnotations;

namespace Dto;

public class IngresarProductoRequestDto
{
     [Required]
    [StringLength(50)]
    public string Codigo { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Detalle { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockCritico { get; set; }

    [Required]
    [StringLength(50)]
    public string Bodega { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Pasillo { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Estante { get; set; } = string.Empty;
}
