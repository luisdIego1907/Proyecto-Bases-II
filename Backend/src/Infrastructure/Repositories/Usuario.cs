using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

[Table("USUARIO")]
[Index(nameof(UsuarioResourceId) , IsUnique = true)]
[Index(nameof(NombreUsuario) , IsUnique = true)]
[Index(nameof(Correo) , IsUnique = true)]
public class Usuario
{
    [Key]
    [Column("UsuarioId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UsuarioId {get;set;}

    [Required]
    [Column("UsuarioResourceId", TypeName = "char(36)")]
    public Guid UsuarioResourceId {get;set;} = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    [Column("NombreUsuario")]
    public string NombreUsuario {get;set;} = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("NombreCompleto")]
    public string NombreCompleto {get;set;} = string.Empty;

    [MaxLength(120)]
    [EmailAddress]
    [Required]
    [Column("Correo")]
    public string Correo {get;set;} = string.Empty;

    [MaxLength(255)]
    [Column("ContrasenaHash")]
    [Required]
    public string ContrasenaHash {get;set;} = string.Empty;

    [Required]
    [Column("Activo" , TypeName = "tinyint(1)")]
    public bool Activo {get;set;} = true;

    public List<UsuarioRol> UsuarioRoles {get;set;} = new();

    public List<Recepcion> Recepciones {get;set;} = new();

    public List<Despacho> Despachos {get;set;} = new();

    public List<AuditoriaProducto> AuditoriasProducto {get;set;} = new();

    public void CleareRoles()
    {
        UsuarioRoles.Clear();
    }
}
