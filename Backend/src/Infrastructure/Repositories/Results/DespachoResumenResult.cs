namespace Infrastructure.Repositories.Results;

public class DespachoResumenResult
{
     public int DespachoId { get; set; }
    public Guid DespachoResourceId { get; set; }

    public DateTime FechaDespacho { get; set; }

    public string Cliente { get; set; } = string.Empty;

    public string Estado { get; set; } = string.Empty;

    public string Operario { get; set; } = string.Empty;
}
