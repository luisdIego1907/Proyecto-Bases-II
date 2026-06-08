namespace Dto.Recepcion;

public class RegistrarRecepcionResponseDto
{
    public string Mensaje { get; set; } = string.Empty;

    public int ProductoId { get; set; }

    public int CantidadIngresada { get; set; }
}
