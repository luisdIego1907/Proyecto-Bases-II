using System.ComponentModel.DataAnnotations;

namespace Dto;

public class RangoFechaRequestDto
{
     [Required]
    public DateTime FechaInicio { get; set; }

    [Required]
    public DateTime FechaFin { get; set; }
}
