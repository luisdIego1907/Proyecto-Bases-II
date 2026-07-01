using System.Text;
using Api.Security;
using DomainService.Interfaces;
using DomainService.Services;
using Facade;
using Facade.Interfaces;
using Infrastructure;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Secret"]!)
            )
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Usuarios y roles
    options.AddPolicy(AuthorizationPolicies.CanManageUsers, policy =>
        policy.RequireRole(RoleNames.Admin));

    // Clientes
    options.AddPolicy(AuthorizationPolicies.CanReadClients, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
        ));

    options.AddPolicy(AuthorizationPolicies.CanCreateClients, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    options.AddPolicy(AuthorizationPolicies.CanUpdateClients, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    options.AddPolicy(AuthorizationPolicies.CanDeleteClients, policy =>
        policy.RequireRole(RoleNames.Admin));

    // Productos
    options.AddPolicy(AuthorizationPolicies.CanReadProducts, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
        ));

    options.AddPolicy(AuthorizationPolicies.CanCreateProducts, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    options.AddPolicy(AuthorizationPolicies.CanUpdateProducts, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    options.AddPolicy(AuthorizationPolicies.CanDeleteProducts, policy =>
        policy.RequireRole(RoleNames.Admin));

    // Recepciones
    options.AddPolicy(AuthorizationPolicies.CanCreateReceptions, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
        ));

    options.AddPolicy(AuthorizationPolicies.CanReadReceptions, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    // Despachos
    options.AddPolicy(AuthorizationPolicies.CanCreateDispatches, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
        ));

    options.AddPolicy(AuthorizationPolicies.CanProcessDispatches, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
        ));

    options.AddPolicy(AuthorizationPolicies.CanReadDispatches, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor,
            RoleNames.Operario
            ));

    // Reportes y auditoría
    options.AddPolicy(AuthorizationPolicies.CanReadReports, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));

    options.AddPolicy(AuthorizationPolicies.CanReadAudit, policy =>
        policy.RequireRole(
            RoleNames.Admin,
            RoleNames.Supervisor
        ));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowedOriginsPolicy", policy =>
    {
        policy
            .WithOrigins(allowedOrigins!)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

builder.Services.AddScoped<IAuthorizationFacade, AuthorizationFacade>();

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IRecepcionRepository, RecepcionRepository>();
builder.Services.AddScoped<IDespachoRepository, DespachoRepository>();
builder.Services.AddScoped<IAuditoriaProductoRepository, AuditoriaProductoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IRecepcionService, RecepcionService>();
builder.Services.AddScoped<IDespachoService, DespachoService>();
builder.Services.AddScoped<IAuditoriaProductoService, AuditoriaProductoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

builder.Services.AddScoped<IClienteFacade, ClienteFacade>();
builder.Services.AddScoped<IProductoFacade, ProductoFacade>();
builder.Services.AddScoped<IRecepcionFacade, RecepcionFacade>();
builder.Services.AddScoped<IDespachoFacade, DespachoFacade>();
builder.Services.AddScoped<IAuditoriaProductoFacade, AuditoriaProductoFacade>();

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IRolUsuarioRepository, RolUsuarioRepository>();

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IRolUsuarioService, RolUsuarioService>();

builder.Services.AddScoped<IUsuarioFacade, UsuarioFacade>();
builder.Services.AddScoped<IRolUsuarioFacade, RolUsuarioFacade>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowedOriginsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();