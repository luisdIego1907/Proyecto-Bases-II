using System.ComponentModel.DataAnnotations;

namespace Api.Models.Recepciones;

public class RegistrarRecepcionRequestModel
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ProductoId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Cantidad { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int ClienteId { get; set; }

    [Required]
    [StringLength(100)]
    public string NumeroLote { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    public int UsuarioId { get; set; }
}
