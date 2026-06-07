using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities;

[Table("USUARIO")]
[Index(nameof(UsuarioResourceId), IsUnique = true, Name = "UQ_Usuario_UsuarioResourceId")]
[Index(nameof(NombreUsuario), IsUnique = true, Name = "UQ_Usuario_NombreUsuario")]
[Index(nameof(Correo) , IsUnique = true)]
public class Usuario
{
   [Key]
    [Column("UsuarioId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UsuarioId { get; set; }

    [Required]
    [Column("UsuarioResourceId", TypeName = "char(36)")]
    public Guid UsuarioResourceId { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(50)]
    [Column("NombreUsuario")]
    public string NombreUsuario { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("Nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("Apellidos")]
    public string Apellidos { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column("Correo")]
    public string Correo { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [Column("ContrasenaHash")]
    public string ContrasenaHash { get; set; } = string.Empty;

    [Required]
    [Column("Activo")]
    public bool Activo { get; set; } = true;

    public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();

    public ICollection<Recepcion> Recepciones { get; set; } = new List<Recepcion>();

    public ICollection<Despacho> Despachos { get; set; } = new List<Despacho>();

    public ICollection<AuditoriaProducto> AuditoriasProducto { get; set; } = new List<AuditoriaProducto>();
}
