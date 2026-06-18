using DomainService.Interfaces;
using DomainService.Services;
using Facade;
using Facade.Interfaces;
using Infrastructure;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);


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


builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<IRecepcionRepository, RecepcionRepository>();
builder.Services.AddScoped<IDespachoRepository, DespachoRepository>();
builder.Services.AddScoped<IAuditoriaProductoRepository, AuditoriaProductoRepository>();


builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IRecepcionService, RecepcionService>();
builder.Services.AddScoped<IDespachoService, DespachoService>();
builder.Services.AddScoped<IAuditoriaProductoService, AuditoriaProductoService>();


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

app.UseAuthorization();

app.MapControllers();

app.Run();