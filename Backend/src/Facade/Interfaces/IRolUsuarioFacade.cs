using Dto.Usuario_Roles;

namespace Facade.Interfaces;

public interface IRolUsuarioFacade
{
     Task<IReadOnlyList<RolUsuarioResponseDto>> ListarAsync(
        CancellationToken cancellationToken = default);
}
