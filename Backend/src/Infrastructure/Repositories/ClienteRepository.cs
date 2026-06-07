using Domain.Entities;
using Infrastructure.Repositories.Interfaces;
using Infrastructure.Repositories.Results;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ClienteRepository : IClienteRepository
{
      private readonly AppDbContext _context;

    public ClienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Cliente>> ListarAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Clientes
            .FromSqlInterpolated($"CALL sp_ListarClientes()")
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<Cliente?> CrearAsync(Cliente cliente, CancellationToken cancellationToken = default)
    {
        return await _context.Clientes
            .FromSqlInterpolated($"""
                CALL sp_CrearCliente(
                    {cliente.Nombre},
                    {cliente.RolCliente.ToString()},
                    {cliente.Telefono},
                    {cliente.Correo},
                    {cliente.Direccion}
                )
                """)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Cliente?> ModificarAsync(Cliente cliente, CancellationToken cancellationToken = default)
    {
        return await _context.Clientes
            .FromSqlInterpolated($"""
                CALL sp_ModificarCliente(
                    {cliente.ClienteResourceId.ToString()},
                    {cliente.Nombre},
                    {cliente.RolCliente.ToString()},
                    {cliente.Telefono},
                    {cliente.Correo},
                    {cliente.Direccion},
                    {cliente.Activo}
                )
                """)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task EliminarAsync(Guid clienteResourceId, CancellationToken cancellationToken = default)
    {
        await _context.Database
            .SqlQuery<MensajeResult>($"CALL sp_EliminarCliente({clienteResourceId.ToString()})")
            .FirstOrDefaultAsync(cancellationToken);
    }
}
