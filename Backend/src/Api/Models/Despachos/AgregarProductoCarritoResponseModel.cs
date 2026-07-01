using System.ComponentModel.DataAnnotations;

namespace Api.Models.Despachos;

public class AgregarProductoCarritoResponseModel
{
  
    public string Mensaje { get; set; } = string.Empty;

    public int DespachoId { get; set; }

    public int ProductoId { get; set; }

    public int CantidadAgregada { get; set; }
}
