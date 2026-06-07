using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("USUARIO_ROL")]
[PrimaryKey(nameof(UsuarioId) , nameof(RolUsuarioId))]
[Index(nameof(UsuarioRolResourceId) , IsUnique = true, Name = "UQ_UsuarioRol_UsuarioRolResourceId")]
public class UsuarioRol
{
   [Column("UsuarioId")]
    [ForeignKey(nameof(Usuario))]
    public int UsuarioId { get; set; }

    [Column("RolUsuarioId")]
    [ForeignKey(nameof(RolUsuario))]
    public int RolUsuarioId { get; set; }

    [Required]
    [Column("UsuarioRolResourceId", TypeName = "char(36)")]
    public Guid UsuarioRolResourceId { get; set; } = Guid.NewGuid();

    public Usuario Usuario { get; set; } = null!;

    public RolUsuario RolUsuario { get; set; } = null!;
}
