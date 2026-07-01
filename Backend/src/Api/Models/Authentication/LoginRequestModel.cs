using System.ComponentModel.DataAnnotations;

namespace Api.Models.Authentication;

public class LoginRequestModel
{
    [Required]
    [MaxLength(50)]
    public string NombreUsuario { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Contrasena { get; set; } = string.Empty;
}
