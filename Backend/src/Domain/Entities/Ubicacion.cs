using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("UBICACION")]
[Index(nameof(UbicacionResourceId), IsUnique = true, Name = "UQ_Ubicacion_UbicacionResourceId")]
[Index(nameof(EstanteId), IsUnique = true, Name = "UQ_Ubicacion_Estante")]
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
    [Column("EstanteId")]
    [ForeignKey(nameof(Estante))]
    public int EstanteId { get; set; }

    public Estante Estante { get; set; } = null!;

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
