using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("DESPACHO_DETALLE")]
[Index(nameof(DetalleResourceId), IsUnique = true)]
[Index(nameof(DespachoId), nameof(ProductoId), IsUnique = true)]
public class DespachoDetalle
{
    [Key]
    [Column("DetalleId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int DetalleId { get; set; }

    [Required]
    [Column("DetalleResourceId", TypeName = "char(36)")]
    public Guid DetalleResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("DespachoId")]
    public int DespachoId { get; set; }

    public Despacho Despacho { get; set; } = null!;

    [Required]
    [Column("ProductoId")]
    public int ProductoId { get; set; }

    public Producto Producto { get; set; } = null!;

    [Required]
    [Range(1, int.MaxValue)]
    [Column("CantidadDespachada")]
    public int CantidadDespachada { get; set; }
}

