public class CarritoDespachoResult
{
    public int CarritoId { get; set; }

    public int ProductoId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public int CantidadSolicitada { get; set; }
}