namespace Api.Models.Productos;

public class ProductoDetalleResponseModel
{
    public int ProductoId { get; set; }

    public Guid ProductoResourceId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;

    public string? Detalle { get; set; }

    public int CantidadInventario { get; set; }

    public int StockCritico { get; set; }

    public bool Activo { get; set; }

    public Guid UbicacionResourceId { get; set; }

    public string CodigoBodega { get; set; } = string.Empty;

    public string Bodega { get; set; } = string.Empty;

    public string Pasillo { get; set; } = string.Empty;

    public string Estante { get; set; } = string.Empty;
}
