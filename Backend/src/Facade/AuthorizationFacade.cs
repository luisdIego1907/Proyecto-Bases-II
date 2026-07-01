using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using DomainService.Interfaces;
using Dto;
using Exceptions;
using Facade.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Facade;

public class AuthorizationFacade : IAuthorizationFacade
{
    private readonly IUsuarioService _userService;
    private readonly IRolUsuarioService _rolUsuarioService;
    private readonly IConfiguration _configuration;

    public AuthorizationFacade(
        IUsuarioService userService,
        IRolUsuarioService rolUsuarioService,
        IConfiguration configuration)
    {
        _userService = userService;
        _rolUsuarioService = rolUsuarioService;
        _configuration = configuration;
    }

    public async Task<AuthorizationResponseDto> AuthorizeAsync(
        AuthorizationRequestDto request)
    {
        var user = await _userService.GetByUserAndPassword(request);

        if (user == null)
        {
            throw new UnauthorizedResponseException("Usuario o contraseña incorrectos.");
        }

        if (!user.Activo)
        {
            throw new UnauthorizedResponseException("El usuario se encuentra inactivo.");
        }

        var roles = await _rolUsuarioService.ListarPorUsuarioResourceIdAsync(
            user.UsuarioResourceId);

        var jwtSettings = _configuration.GetSection("Jwt");

        var expirationMinutesValue = jwtSettings["ExpirationMinutes"];

        if (string.IsNullOrWhiteSpace(expirationMinutesValue))
        {
            throw new BadRequestResponseException("No se configuró Jwt:ExpirationMinutes.");
        }

        var expirationMinutes = int.Parse(expirationMinutesValue);

        var token = GenerateJwtToken(
            user,
            roles,
            jwtSettings,
            expirationMinutes);

        return new AuthorizationResponseDto
        {
            BearerToken = token,
            ExpiresIn = DateTime.UtcNow.AddMinutes(expirationMinutes)
        };
    }

    private static string GenerateJwtToken(
        Usuario user,
        IReadOnlyList<string> roles,
        IConfigurationSection jwtSettings,
        int expirationMinutes)
    {
        var secret = jwtSettings["Secret"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new BadRequestResponseException("No se configuró Jwt:Secret.");
        }

        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new BadRequestResponseException("No se configuró Jwt:Issuer.");
        }

        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new BadRequestResponseException("No se configuró Jwt:Audience.");
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secret));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.NombreUsuario),
            new("externalId", user.UsuarioResourceId.ToString()),
            new("usuarioId", user.UsuarioId.ToString()),
            new("correo", user.Correo)
        };

        claims.AddRange(
            roles.Select(role =>
                new Claim(ClaimTypes.Role, role)
            )
        );

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}