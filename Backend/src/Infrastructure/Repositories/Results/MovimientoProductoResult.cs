namespace Infrastructure.Repositories.Results;

public class MovimientoProductoResult
{
    public DateTime Fecha { get; set; }

    public string TipoMovimiento { get; set; } = string.Empty;

    public string Cliente { get; set; } = string.Empty;

    public string CodigoProducto { get; set; } = string.Empty;

    public string Producto { get; set; } = string.Empty;

    public int Cantidad { get; set; }

    public string Usuario { get; set; } = string.Empty;
}
