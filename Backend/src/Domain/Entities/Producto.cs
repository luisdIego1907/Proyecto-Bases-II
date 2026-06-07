using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("PRODUCTO")]
[Index(nameof(ProductoResourceId), IsUnique = true, Name = "UQ_Producto_ProductoResourceId")]
[Index(nameof(Codigo), IsUnique = true, Name = "UQ_Producto_Codigo")]
[Index(nameof(Activo), nameof(Nombre), Name = "ix_Producto_Activo_Nombre")]
[Index(nameof(Activo), nameof(CantidadInventario), Name = "ix_Producto_Activo_CantidadInventario")]
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
    [StringLength(50)]
    [Column("Codigo")]
    public string Codigo { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("Detalle")]
    public string? Detalle { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    [Column("StockCritico")]
    public int StockCritico { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    [Column("CantidadInventario")]
    public int CantidadInventario { get; set; } = 0;

    [Required]
    [Column("UbicacionId")]
    [ForeignKey(nameof(Ubicacion))]
    public int UbicacionId { get; set; }

    [Required]
    [Column("Activo")]
    public bool Activo { get; set; } = true;

    public Ubicacion Ubicacion { get; set; } = null!;

    public ICollection<Recepcion> Recepciones { get; set; } = new List<Recepcion>();

    public ICollection<DespachoCarrito> DespachoCarritos { get; set; } = new List<DespachoCarrito>();

    public ICollection<DespachoDetalle> DespachoDetalles { get; set; } = new List<DespachoDetalle>();

    public ICollection<AuditoriaProducto> AuditoriasProducto { get; set; } = new List<AuditoriaProducto>();
}
