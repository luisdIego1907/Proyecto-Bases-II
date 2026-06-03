using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

[Table("ROL_USUARIO")]
[Index(nameof(RolUsuarioResourceId), IsUnique = true)]
[Index(nameof(Nombre), IsUnique = true)]
public class RolUsuario
{
    [Key]
    [Column("RolUsuarioId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RolUsuarioId {get;set;}

    [Required]
    [Column("RolUsuarioResourceId" , TypeName = "char(36)")]
    public Guid RolUsuarioResourceId {get;set;} = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    [Column("Nombre")]
    public string Nombre {get;set;} = string.Empty;

    public List<UsuarioRol> UsuarioRoles {get;set;} = new();
}
