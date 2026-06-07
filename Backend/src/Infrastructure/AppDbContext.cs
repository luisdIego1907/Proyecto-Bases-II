using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<RolUsuario> RolesUsuario { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<UsuarioRol> UsuarioRoles { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Ubicacion> Ubicaciones { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Recepcion> Recepciones { get; set; }
    public DbSet<Despacho> Despachos { get; set; }
    public DbSet<DespachoCarrito> DespachoCarritos { get; set; }
    public DbSet<DespachoDetalle> DespachoDetalles { get; set; }
    public DbSet<AuditoriaProducto> AuditoriasProducto { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureUsuarioRol(modelBuilder);
        ConfigureProducto(modelBuilder);
        ConfigureRecepcion(modelBuilder);
        ConfigureDespacho(modelBuilder);
        ConfigureDespachoCarrito(modelBuilder);
        ConfigureDespachoDetalle(modelBuilder);
        ConfigureAuditoriaProducto(modelBuilder);
    }
    private static void ConfigureUsuarioRol(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsuarioRol>()
            .HasKey(ur => new { ur.UsuarioId, ur.RolUsuarioId });

        modelBuilder.Entity<UsuarioRol>()
            .HasOne(ur => ur.Usuario)
            .WithMany(u => u.UsuarioRoles)
            .HasForeignKey(ur => ur.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UsuarioRol>()
            .HasOne(ur => ur.RolUsuario)
            .WithMany(r => r.UsuarioRoles)
            .HasForeignKey(ur => ur.RolUsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureProducto(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Producto>()
            .HasOne(p => p.Ubicacion)
            .WithMany(u => u.Productos)
            .HasForeignKey(p => p.UbicacionId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureRecepcion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recepcion>()
            .HasOne(r => r.Cliente)
            .WithMany(c => c.Recepciones)
            .HasForeignKey(r => r.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Recepcion>()
            .HasOne(r => r.Producto)
            .WithMany(p => p.Recepciones)
            .HasForeignKey(r => r.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Recepcion>()
            .HasOne(r => r.Usuario)
            .WithMany(u => u.Recepciones)
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureDespacho(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Despacho>()
            .HasOne(d => d.Cliente)
            .WithMany(c => c.Despachos)
            .HasForeignKey(d => d.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Despacho>()
            .HasOne(d => d.Usuario)
            .WithMany(u => u.Despachos)
            .HasForeignKey(d => d.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureDespachoCarrito(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DespachoCarrito>()
            .HasOne(dc => dc.Despacho)
            .WithMany(d => d.DespachoCarritos)
            .HasForeignKey(dc => dc.DespachoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DespachoCarrito>()
            .HasOne(dc => dc.Producto)
            .WithMany(p => p.DespachoCarritos)
            .HasForeignKey(dc => dc.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DespachoCarrito>()
            .HasIndex(dc => new { dc.DespachoId, dc.ProductoId })
            .IsUnique();
    }

    private static void ConfigureDespachoDetalle(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DespachoDetalle>()
            .HasOne(dd => dd.Despacho)
            .WithMany(d => d.DespachoDetalles)
            .HasForeignKey(dd => dd.DespachoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DespachoDetalle>()
            .HasOne(dd => dd.Producto)
            .WithMany(p => p.DespachoDetalles)
            .HasForeignKey(dd => dd.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DespachoDetalle>()
            .HasIndex(dd => new { dd.DespachoId, dd.ProductoId })
            .IsUnique();
    }

    private static void ConfigureAuditoriaProducto(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditoriaProducto>()
            .HasOne(a => a.Producto)
            .WithMany(p => p.AuditoriasProducto)
            .HasForeignKey(a => a.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AuditoriaProducto>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.AuditoriasProducto)
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
