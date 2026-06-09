namespace Infrastructure.Repositories.Results;

public class AuditoriaProductoResult
{
    public int AuditoriaId { get; set; }
    public Guid AuditoriaResourceId { get; set; }

    public DateTime FechaCambio { get; set; }

    public string CodigoProducto { get; set; } = string.Empty;

    public string Producto { get; set; } = string.Empty;

    public int CantidadAnterior { get; set; }

    public int CantidadNueva { get; set; }

    public string TipoMovimiento { get; set; } = string.Empty;

    public string Usuario { get; set; } = string.Empty;
}
