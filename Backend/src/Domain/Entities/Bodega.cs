using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("BODEGA")]
[Index(nameof(BodegaResourceId), IsUnique = true, Name = "UQ_Bodega_BodegaResourceId")]
[Index(nameof(Codigo), IsUnique = true, Name = "UQ_Bodega_Codigo")]
public class Bodega
{
    [Key]
    [Column("BodegaId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int BodegaId { get; set; }

    [Required]
    [Column("BodegaResourceId", TypeName = "char(36)")]
    public Guid BodegaResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(50)]
    [Column("Codigo")]
    public string Codigo { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("Descripcion")]
    public string? Descripcion { get; set; }

    public ICollection<Pasillo> Pasillos { get; set; } = new List<Pasillo>();
}
