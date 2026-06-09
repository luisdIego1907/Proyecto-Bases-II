using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("PASILLO")]
[Index(nameof(PasilloResourceId), IsUnique = true, Name = "UQ_Pasillo_PasilloResourceId")]
[Index(nameof(BodegaId), nameof(Codigo), IsUnique = true, Name = "UQ_Pasillo_Bodega_Codigo")]
public class Pasillo
{
    [Key]
    [Column("PasilloId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PasilloId { get; set; }

    [Required]
    [Column("PasilloResourceId", TypeName = "char(36)")]
    public Guid PasilloResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("BodegaId")]
    [ForeignKey(nameof(Bodega))]
    public int BodegaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("Codigo")]
    public string Codigo { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("Descripcion")]
    public string? Descripcion { get; set; }

    public Bodega Bodega { get; set; } = null!;

    public ICollection<Estante> Estantes { get; set; } = new List<Estante>();
}
