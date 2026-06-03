using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("DESPACHO_CARRITO")]
[Index(nameof(CarritoResourceId), IsUnique = true)]
[Index(nameof(DespachoId), nameof(ProductoId), IsUnique = true)]
public class DespachoCarrito
{
    [Key]
    [Column("CarritoId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CarritoId { get; set; }

    [Required]
    [Column("CarritoResourceId", TypeName = "char(36)")]
    public Guid CarritoResourceId { get; set; } = Guid.NewGuid();

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
    [Column("CantidadSolicitada")]
    public int CantidadSolicitada { get; set; }
}