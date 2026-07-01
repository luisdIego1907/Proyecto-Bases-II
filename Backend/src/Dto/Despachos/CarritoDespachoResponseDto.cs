namespace Dto.Despachos;

public class CarritoDespachoResponseDto
{
    public int CarritoId { get; set; }

    public int ProductoId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public int CantidadSolicitada { get; set; }
}