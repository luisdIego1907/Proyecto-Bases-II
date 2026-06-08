using Api.Models.Common;
using Dto;

namespace Api.Mappers;

public static class CommonApiMapper
{
     public static RangoFechaRequestDto ToDto(RangoFechaRequestModel model)
    {
        return new RangoFechaRequestDto
        {
            FechaInicio = model.FechaInicio,
            FechaFin = model.FechaFin
        };
    }
}
