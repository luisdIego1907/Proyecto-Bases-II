using Dto.Recepcion;

namespace Facade.Interfaces;

public interface IRecepcionFacade
{
      Task<RegistrarRecepcionResponseDto?> RegistrarAsync(
        RegistrarRecepcionRequestDto request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RecepcionProductoResponseDto>> ListarPorProductoAsync(
        int productoId,
        CancellationToken cancellationToken = default);
}
