using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("ESTANTE")]
[Index(nameof(EstanteResourceId), IsUnique = true, Name = "UQ_Estante_EstanteResourceId")]
[Index(nameof(PasilloId), nameof(Codigo), IsUnique = true, Name = "UQ_Estante_Pasillo_Codigo")]
public class Estante
{
   [Key]
    [Column("EstanteId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int EstanteId { get; set; }

    [Required]
    [Column("EstanteResourceId", TypeName = "char(36)")]
    public Guid EstanteResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("PasilloId")]
    [ForeignKey(nameof(Pasillo))]
    public int PasilloId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("Codigo")]
    public string Codigo { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("Descripcion")]
    public string? Descripcion { get; set; }

    public Pasillo Pasillo { get; set; } = null!;

    public Ubicacion? Ubicacion { get; set; }
}
