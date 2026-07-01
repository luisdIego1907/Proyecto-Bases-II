using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("DESPACHO_CARRITO")]
[Index(nameof(CarritoResourceId), IsUnique = true, Name = "UQ_DespachoCarrito_CarritoResourceId")]
[Index(nameof(DespachoId), nameof(ProductoId), IsUnique = true, Name = "UQ_DespachoCarrito_Despacho_Producto")]
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
    [ForeignKey(nameof(Despacho))]
    public int DespachoId { get; set; }

    [Required]
    [Column("ProductoId")]
    [ForeignKey(nameof(Producto))]
    public int ProductoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    [Column("CantidadSolicitada")]
    public int CantidadSolicitada { get; set; }

    public Despacho Despacho { get; set; } = null!;

    public Producto Producto { get; set; } = null!;
}