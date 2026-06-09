using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Values;
using Microsoft.EntityFrameworkCore;
namespace Domain.Entities;

[Table("ROL_USUARIO")]
[Index(nameof(RolUsuarioResourceId), IsUnique = true, Name = "UQ_RolUsuario_RolUsuarioResourceId")]
[Index(nameof(Nombre), IsUnique = true)]
public class RolUsuario
{
   [Key]
    [Column("RolUsuarioId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RolUsuarioId { get; set; }

    [Required]
    [Column("RolUsuarioResourceId", TypeName = "char(36)")]
    public Guid RolUsuarioResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [Column("Nombre", TypeName = "enum('ADMIN','OPERARIO','SUPERVISOR')")]
    public RolUsuarioValues Nombre { get; set; }

    public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
}
