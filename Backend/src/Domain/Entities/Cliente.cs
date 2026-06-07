using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Values;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;


[Table("CLIENTE")]
[Index(nameof(ClienteResourceId), IsUnique = true, Name = "UQ_Cliente_ClienteResourceId")]
[Index(nameof(RolCliente), nameof(Activo), nameof(Nombre), Name = "ix_Cliente_RolCliente_Activo_Nombre")]
public class Cliente
{
    [Key]
    [Column("ClienteId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ClienteId { get; set; }

    [Required]
    [Column("ClienteResourceId", TypeName = "char(36)")]
    public Guid ClienteResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(150)]
    [Column("Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [Column("RolCliente", TypeName = "enum('ORIGEN','DESTINO','AMBOS')")]
    public RolClienteValues RolCliente { get; set; }

    [StringLength(30)]
    [Column("Telefono")]
    public string? Telefono { get; set; }

    [StringLength(120)]
    [Column("Correo")]
    public string? Correo { get; set; }

    [StringLength(250)]
    [Column("Direccion")]
    public string? Direccion { get; set; }

    [Required]
    [Column("Activo")]
    public bool Activo { get; set; } = true;

    public ICollection<Recepcion> Recepciones { get; set; } = new List<Recepcion>();

    public ICollection<Despacho> Despachos { get; set; } = new List<Despacho>();
}