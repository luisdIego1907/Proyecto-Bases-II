using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("USUARIO_ROL")]
[PrimaryKey(nameof(UsuarioId) , nameof(RolUsuarioId))]
[Index(nameof(UsuarioRolResourceid) , IsUnique = true)]
public class UsuarioRol
{
    public int UsuarioId {get;set;}

    public int RolUsuarioId {get;set;}

    [Required]
    [Column("UsuarioRolResourceId" , TypeName = "char(36)")]
    public Guid UsuarioRolResourceid {get;set;} = Guid.NewGuid();

    public Usuario Usuario {get;set;} = null!;

    public RolUsuario RolUsuario {get;set;} = null!;
}
