using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Domain.Entities;

[Table("RECEPCION")]
[Index(nameof(RecepcionResourceId), IsUnique = true, Name = "UQ_Recepcion_RecepcionResourceId")]
[Index(nameof(ProductoId), nameof(FechaRecepcion), Name = "ix_Recepcion_Producto_FechaRecepcion")]
public class Recepcion
{
     [Key]
    [Column("RecepcionId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RecepcionId { get; set; }

    [Required]
    [Column("RecepcionResourceId", TypeName = "char(36)")]
    public Guid RecepcionResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("ClienteId")]
    [ForeignKey(nameof(Cliente))]
    public int ClienteId { get; set; }

    [Required]
    [Column("ProductoId")]
    [ForeignKey(nameof(Producto))]
    public int ProductoId { get; set; }

    [Required]
    [Column("UsuarioId")]
    [ForeignKey(nameof(Usuario))]
    public int UsuarioId { get; set; }

    [Required]
    [StringLength(100)]
    [Column("NumeroLote")]
    public string NumeroLote { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    [Column("Cantidad")]
    public int Cantidad { get; set; }

    [Required]
    [Column("FechaRecepcion")]
    public DateTime FechaRecepcion { get; set; } = DateTime.Now;

    public Cliente Cliente { get; set; } = null!;

    public Producto Producto { get; set; } = null!;

    public Usuario Usuario { get; set; } = null!;
}
