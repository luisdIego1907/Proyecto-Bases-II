using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("UBICACION")]
[Index(nameof(UbicacionResourceId), IsUnique = true)]
[Index(nameof(Bodega), nameof(Pasillo), nameof(Estante), IsUnique = true)]
public class Ubicacion
{
    [Key]
    [Column("UbicacionId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UbicacionId { get; set; }

    [Required]
    [Column("UbicacionResourceId", TypeName = "char(36)")]
    public Guid UbicacionResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    [Column("Bodega")]
    public string Bodega { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("Pasillo")]
    public string Pasillo { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("Estante")]
    public string Estante { get; set; } = string.Empty;

    public List<Producto> Productos { get; set; } = new();
}
