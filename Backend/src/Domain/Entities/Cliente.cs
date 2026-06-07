using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;


[Table("CLIENTE")]
[Index(nameof(ClienteResourceId), IsUnique = true)]
[Index(nameof(Nombre), IsUnique = true)]
public class Cliente
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ClienteId {get; set;}

    [Required]
    [Column("ClienteResourceId" , TypeName = "char(36)")]
    public Guid ClienteResourceId {get;set;} = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Nombre {get;set;} = string.Empty;

    [Required]
    [MaxLength(20)]
    public string RolCliente {get;set;} = string.Empty;

    [MaxLength(30)]
    [Required]
    public string Telefono {get;set;} = string.Empty;

    [MaxLength(120)]
    [EmailAddress]
    public string Correo {get;set;} = string.Empty;

    [MaxLength(250)]
    public string Direccion {get;set;} = string.Empty;

    [Required]
    [Column("Activo" , TypeName = "tinyint(1)")]
    public bool Activo {get;set;} = true;

    public List<Recepcion> Recepciones {get;set;} = new();

    public List<Despacho> Despachos {get;set;} = new();
}