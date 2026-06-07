using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Values;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;


[Table("AUDITORIA_PRODUCTO")]
[Index(nameof(AuditoriaResourceId), IsUnique = true, Name = "UQ_AuditoriaProducto_AuditoriaResourceId")]
[Index(nameof(ProductoId), nameof(FechaCambio), Name = "ix_AuditoriaProducto_Producto_FechaCambio")]
[Index(nameof(UsuarioId), nameof(FechaCambio), Name = "ix_AuditoriaProducto_Usuario_FechaCambio")]
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
    [ForeignKey(nameof(Producto))]
    public int ProductoId { get; set; }

    [Required]
    [Column("UsuarioId")]
    [ForeignKey(nameof(Usuario))]
    public int UsuarioId { get; set; }

    [Required]
    [Column("FechaCambio")]
    public DateTime FechaCambio { get; set; } = DateTime.Now;

    [Required]
    [Range(0, int.MaxValue)]
    [Column("CantidadAnterior")]
    public int CantidadAnterior { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    [Column("CantidadNueva")]
    public int CantidadNueva { get; set; }

    [Required]
    [Column("TipoMovimiento", TypeName = "enum('INCREMENTO','REDUCCION')")]
    public TipoMovimientoValues TipoMovimiento { get; set; }

    public Producto Producto { get; set; } = null!;

    public Usuario Usuario { get; set; } = null!;
}
