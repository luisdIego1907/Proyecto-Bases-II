namespace Api.Models.Despachos;

public class DetalleDespachoResponseModel
{
    public int DespachoId { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Producto { get; set; } = string.Empty;

    public int CantidadDespachada { get; set; }
}
