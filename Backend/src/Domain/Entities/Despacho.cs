using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Values;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("DESPACHO")]
[Index(nameof(DespachoResourceId), IsUnique = true, Name = "UQ_Despacho_DespachoResourceId")]
[Index(nameof(ClienteId), nameof(FechaDespacho), Name = "ix_Despacho_Cliente_FechaDespacho")]
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
    [ForeignKey(nameof(Cliente))]
    public int ClienteId { get; set; }

    [Required]
    [Column("UsuarioId")]
    [ForeignKey(nameof(Usuario))]
    public int UsuarioId { get; set; }

    [Required]
    [Column("FechaDespacho")]
    public DateTime FechaDespacho { get; set; } = DateTime.Now;

    [Required]
    [Column("Estado", TypeName = "enum('PENDIENTE','PROCESADO','CANCELADO')")]
    public EstadoDespachoValues Estado { get; set; } = EstadoDespachoValues.PENDIENTE;

    public Cliente Cliente { get; set; } = null!;

    public Usuario Usuario { get; set; } = null!;

    public ICollection<DespachoCarrito> Carrito { get; set; } = new List<DespachoCarrito>();

    public ICollection<DespachoDetalle> Detalles { get; set; } = new List<DespachoDetalle>();
}