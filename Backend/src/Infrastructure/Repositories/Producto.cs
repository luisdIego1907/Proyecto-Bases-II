using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

[Table("PRODUCTO")]
[Index(nameof(ProductoResourceId), IsUnique = true)]
[Index(nameof(Codigo), IsUnique = true)]
public class Producto
{
    
    [Key]
    [Column("ProductoId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductoId { get; set; }

    [Required]
    [Column("ProductoResourceId", TypeName = "char(36)")]
    public Guid ProductoResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    [Column("Codigo")]
    public string Codigo { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(500)]
    [Column("Detalle")]
    public string? Detalle { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    [Column("CantidadActual")]
    public int CantidadActual { get; set; } = 0;

    [Required]
    [Range(0, int.MaxValue)]
    [Column("StockCritico")]
    public int StockCritico { get; set; }

    [Required]
    [Column("UbicacionId")]
    public int UbicacionId { get; set; }

    public Ubicacion Ubicacion { get; set; } = null!;

    [Required]
    [Column("Activo", TypeName = "tinyint(1)")]
    public bool Activo { get; set; } = true;

    public List<Recepcion> Recepciones { get; set; } = new();

    public List<DespachoCarrito> DespachoCarritos { get; set; } = new();

    public List<DespachoDetalle> DespachoDetalles { get; set; } = new();

    public List<AuditoriaProducto> AuditoriasProducto { get; set; } = new();
}
