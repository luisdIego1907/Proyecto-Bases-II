using DomainService.Interfaces;
using Dto.Recepcion;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class RecepcionFacade : IRecepcionFacade
{
    private readonly IRecepcionService _recepcionService;

    public RecepcionFacade(IRecepcionService recepcionService)
    {
        _recepcionService = recepcionService;
    }

    public async Task<RegistrarRecepcionResponseDto?> RegistrarAsync(
        RegistrarRecepcionRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var recepcion = await _recepcionService.RegistrarAsync(
            request.ProductoId,
            request.Cantidad,
            request.ClienteId,
            request.NumeroLote,
            request.UsuarioId,
            cancellationToken);

        return recepcion is null
            ? null
            : RecepcionMapper.ToResponseDto(recepcion);
    }

    public async Task<IReadOnlyList<RecepcionProductoResponseDto>> ListarPorProductoAsync(
        int productoId,
        CancellationToken cancellationToken = default)
    {
        var recepciones = await _recepcionService.ListarPorProductoAsync(
            productoId,
            cancellationToken);

        return recepciones
            .Select(RecepcionMapper.ToResponseDto)
            .ToList();
    }
}
