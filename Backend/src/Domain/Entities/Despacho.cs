using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("DESPACHO")]
[Index(nameof(DespachoResourceId), IsUnique = true)]
public class Despacho
{
    [Key]
    [Column("DespachoId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int DespachoId { get; set; }

    [Required]
    [Column("DespachoResourceId", TypeName = "char(36)")]
    public Guid DespachoResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("ClienteId")]
    public int ClienteId { get; set; }

    public Cliente Cliente { get; set; } = null!;

    [Required]
    [Column("UsuarioId")]
    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;

    [Required]
    [Column("FechaDespacho")]
    public DateTime FechaDespacho { get; set; } = DateTime.Now;

    [Required]
    [MaxLength(20)]
    [Column("Estado")]
    public string Estado { get; set; } = "PENDIENTE";

    public List<DespachoCarrito> DespachoCarritos { get; set; } = new();

    public List<DespachoDetalle> DespachoDetalles { get; set; } = new();
}