using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("DESPACHO_DETALLE")]
[Index(nameof(DetalleResourceId), IsUnique = true, Name = "UQ_DespachoDetalle_DetalleResourceId")]
[Index(nameof(DespachoId), nameof(ProductoId), IsUnique = true, Name = "UQ_DespachoDetalle_Despacho_Producto")]
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
    [ForeignKey(nameof(Despacho))]
    public int DespachoId { get; set; }

    [Required]
    [Column("ProductoId")]
    [ForeignKey(nameof(Producto))]
    public int ProductoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    [Column("CantidadDespachada")]
    public int CantidadDespachada { get; set; }

    public Despacho Despacho { get; set; } = null!;

    public Producto Producto { get; set; } = null!;
}

