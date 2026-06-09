namespace Dto.Despachos;

public class AgregarProductoCarritoResponseDto
{
    public string Mensaje { get; set; } = string.Empty;

    public int DespachoId { get; set; }

    public int ProductoId { get; set; }

    public int CantidadAgregada { get; set; }
}
