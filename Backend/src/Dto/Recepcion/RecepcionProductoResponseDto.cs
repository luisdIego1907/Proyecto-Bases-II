namespace Dto.Recepcion;

public class RecepcionProductoResponseDto
{
     public int RecepcionId { get; set; }

    public Guid RecepcionResourceId { get; set; }

    public DateTime FechaRecepcion { get; set; }

    public string NumeroLote { get; set; } = string.Empty;

    public string Cliente { get; set; } = string.Empty;

    public string CodigoProducto { get; set; } = string.Empty;

    public string Producto { get; set; } = string.Empty;

    public int Cantidad { get; set; }

    public string Usuario { get; set; } = string.Empty;
}
