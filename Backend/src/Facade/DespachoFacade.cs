using DomainService.Interfaces;
using Dto;
using Dto.Despachos;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class DespachoFacade : IDespachoFacade
{
    private readonly IDespachoService _despachoService;

    public DespachoFacade(IDespachoService despachoService)
    {
        _despachoService = despachoService;
    }

    public async Task<CrearDespachoResponseDto?> CrearAsync(
           CrearDespachoRequestDto request,
           CancellationToken cancellationToken = default)
    {
        var despacho = await _despachoService.CrearAsync(
            request.ClienteId,
            request.UsuarioId,
            cancellationToken);

        return despacho is null
            ? null
            : DespachoMapper.ToResponseDto(despacho);
    }

    public async Task<AgregarProductoCarritoResponseDto?> AgregarProductoCarritoAsync(
        AgregarProductoCarritoRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _despachoService.AgregarProductoCarritoAsync(
            request.DespachoId,
            request.ProductoId,
            request.CantidadSolicitada,
            cancellationToken);

        return resultado is null
            ? null
            : DespachoMapper.ToResponseDto(resultado);
    }

    public async Task<ProcesarDespachoResponseDto?> ProcesarAsync(
        ProcesarDespachoRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var resultado = await _despachoService.ProcesarAsync(
            request.DespachoId,
            request.UsuarioId,
            cancellationToken);

        return resultado is null
            ? null
            : DespachoMapper.ToResponseDto(resultado);
    }

    public async Task<IReadOnlyList<DespachoResumenResponseDto>> ListarUltimaSemanaAsync(
        CancellationToken cancellationToken = default)
    {
        var despachos = await _despachoService.ListarUltimaSemanaAsync(
            cancellationToken);

        return despachos
            .Select(DespachoMapper.ToResponseDto)
            .ToList();
    }

    public async Task<IReadOnlyList<DespachoResumenResponseDto>> ListarPorFechaAsync(
        RangoFechaRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var despachos = await _despachoService.ListarPorFechaAsync(
            request.FechaInicio,
            request.FechaFin,
            cancellationToken);

        return despachos
            .Select(DespachoMapper.ToResponseDto)
            .ToList();
    }

    public async Task<IReadOnlyList<DetalleDespachoResponseDto>> VerDetalleAsync(
        int despachoId,
        CancellationToken cancellationToken = default)
    {
        var detalles = await _despachoService.VerDetalleAsync(
            despachoId,
            cancellationToken);

        return detalles
            .Select(DespachoMapper.ToResponseDto)
            .ToList();
    }
}
