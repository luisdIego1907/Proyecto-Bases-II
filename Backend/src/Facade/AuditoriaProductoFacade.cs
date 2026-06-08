using DomainService.Interfaces;
using Dto;
using Dto.Auditoria;
using Facade.Interfaces;
using Facade.Mappers;

namespace Facade;

public class AuditoriaProductoFacade : IAuditoriaProductoFacade
{
    private readonly IAuditoriaProductoService _auditoriaProductoService;

    public AuditoriaProductoFacade(
        IAuditoriaProductoService auditoriaProductoService)
    {
        _auditoriaProductoService = auditoriaProductoService;
    }

    public async Task<IReadOnlyList<AuditoriaProductoResponseDto>> ListarPorProductoAsync(
           int productoId,
           RangoFechaRequestDto request,
           CancellationToken cancellationToken = default)
    {
        var auditorias = await _auditoriaProductoService.ListarPorProductoAsync(
            productoId,
            request.FechaInicio,
            request.FechaFin,
            cancellationToken);

        return auditorias
            .Select(AuditoriaProductoMapper.ToResponseDto)
            .ToList();
    }
}
