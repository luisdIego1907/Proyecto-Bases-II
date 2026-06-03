using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

[Table("AUDITORIA_PRODUCTO")]
[Index(nameof(AuditoriaResourceId), IsUnique = true)]
public class AuditoriaProducto
{
    [Key]
    [Column("AuditoriaId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AuditoriaId { get; set; }

    [Required]
    [Column("AuditoriaResourceId", TypeName = "char(36)")]
    public Guid AuditoriaResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("ProductoId")]
    public int ProductoId { get; set; }

    public Producto Producto { get; set; } = null!;

    [Required]
    [Column("UsuarioId")]
    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;

    [Required]
    [Column("FechaCambio")]
    public DateTime FechaCambio { get; set; } = DateTime.Now;

    [Required]
    [Column("CantidadAnterior")]
    public int CantidadAnterior { get; set; }

    [Required]
    [Column("CantidadNueva")]
    public int CantidadNueva { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("TipoMovimiento")]
    public string TipoMovimiento { get; set; } = string.Empty;
}
