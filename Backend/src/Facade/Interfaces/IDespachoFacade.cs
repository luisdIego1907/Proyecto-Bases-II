using Dto;
using Dto.Despachos;

namespace Facade.Interfaces;

public interface IDespachoFacade
{
    Task<CrearDespachoResponseDto?> CrearAsync(
       CrearDespachoRequestDto request,
       CancellationToken cancellationToken = default);

    Task<AgregarProductoCarritoResponseDto?> AgregarProductoCarritoAsync(
        AgregarProductoCarritoRequestDto request,
        CancellationToken cancellationToken = default);

    Task<ProcesarDespachoResponseDto?> ProcesarAsync(
        ProcesarDespachoRequestDto request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DespachoResumenResponseDto>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DespachoResumenResponseDto>> ListarPorFechaAsync(
        RangoFechaRequestDto request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DetalleDespachoResponseDto>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CarritoDespachoResponseDto>> VerCarritoAsync(
        int despachoId,
    CancellationToken cancellationToken = default);
}
