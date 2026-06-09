namespace Dto;

public class InventarioProductoResponseDto
{
    public int ProductoId { get; set; }

    public Guid ProductoResourceId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public string? Detalle { get; set; }

    public string CodigoBodega { get; set; } = string.Empty;

    public string Bodega { get; set; } = string.Empty;

    public string Pasillo { get; set; } = string.Empty;

    public string Estante { get; set; } = string.Empty;

    public Guid UbicacionResourceId { get; set; }

    public int CantidadInventario { get; set; }

    public int StockCritico { get; set; }

    public string EstadoStock { get; set; } = string.Empty;

    public DateTime? UltimoIngreso { get; set; }

    public DateTime? UltimoDespacho { get; set; }
}
