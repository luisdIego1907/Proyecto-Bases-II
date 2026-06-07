using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Domain.Entities;

[Table("RECEPCION")]
[Index(nameof(RecepcionResourceId), IsUnique = true)]
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
    public int ClienteId { get; set; }

    public Cliente Cliente { get; set; } = null!;

    [Required]
    [Column("ProductoId")]
    public int ProductoId { get; set; }

    public Producto Producto { get; set; } = null!;

    [Required]
    [Column("UsuarioId")]
    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    [Column("NumeroLote")]
    public string NumeroLote { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    [Column("Cantidad")]
    public int Cantidad { get; set; }

    [Required]
    [Column("FechaRecepcion")]
    public DateTime FechaRecepcion { get; set; } = DateTime.Now;
}
