using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Repositories.Results;

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

    public DbSet<Bodega> Bodegas { get; set; }
    public DbSet<Pasillo> Pasillos { get; set; }
    public DbSet<Estante> Estantes { get; set; }
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

        ConfigureStoredProcedureResults(modelBuilder);

        ConfigureRolUsuario(modelBuilder);
        ConfigureUsuario(modelBuilder);
        ConfigureUsuarioRol(modelBuilder);
        ConfigureCliente(modelBuilder);

        ConfigureBodega(modelBuilder);
        ConfigurePasillo(modelBuilder);
        ConfigureEstante(modelBuilder);
        ConfigureUbicacion(modelBuilder);

        ConfigureProducto(modelBuilder);
        ConfigureRecepcion(modelBuilder);
        ConfigureDespacho(modelBuilder);
        ConfigureDespachoCarrito(modelBuilder);
        ConfigureDespachoDetalle(modelBuilder);
        ConfigureAuditoriaProducto(modelBuilder);
    }

    private static void ConfigureStoredProcedureResults(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MensajeResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<ProductoDetalleResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<InventarioProductoResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<MovimientoProductoResult>().HasNoKey().ToView(null);

        modelBuilder.Entity<RecepcionProductoResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<RegistrarRecepcionResult>().HasNoKey().ToView(null);

        modelBuilder.Entity<CrearDespachoResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<AgregarProductoCarritoResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<ProcesarDespachoResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<DespachoResumenResult>().HasNoKey().ToView(null);
        modelBuilder.Entity<DetalleDespachoResult>().HasNoKey().ToView(null);

        modelBuilder.Entity<AuditoriaProductoResult>().HasNoKey().ToView(null);
    }

    private static void ConfigureRolUsuario(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RolUsuario>(entity =>
        {
            entity.ToTable("ROL_USUARIO");

            entity.HasIndex(r => r.RolUsuarioResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_RolUsuario_RolUsuarioResourceId");

            entity.Property(r => r.RolUsuarioResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(r => r.Nombre)
                .HasConversion<string>()
                .HasColumnType("enum('ADMIN','OPERARIO','SUPERVISOR')")
                .IsRequired();
        });
    }

    private static void ConfigureUsuario(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("USUARIO");

            entity.HasIndex(u => u.UsuarioResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Usuario_UsuarioResourceId");

            entity.HasIndex(u => u.NombreUsuario)
                .IsUnique()
                .HasDatabaseName("UQ_Usuario_NombreUsuario");

            entity.HasIndex(u => u.Correo)
                .IsUnique();

            entity.Property(u => u.UsuarioResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(u => u.NombreUsuario)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(u => u.Nombre)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(u => u.Apellidos)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(u => u.Correo)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(u => u.ContrasenaHash)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(u => u.Activo)
                .HasColumnType("tinyint")
                .HasDefaultValue(true)
                .IsRequired();
        });
    }

    private static void ConfigureUsuarioRol(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsuarioRol>(entity =>
        {
            entity.ToTable("USUARIO_ROL");

            entity.HasKey(ur => new { ur.UsuarioId, ur.RolUsuarioId });

            entity.HasIndex(ur => ur.UsuarioRolResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_UsuarioRol_UsuarioRolResourceId");

            entity.Property(ur => ur.UsuarioRolResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.HasOne(ur => ur.Usuario)
                .WithMany(u => u.UsuarioRoles)
                .HasForeignKey(ur => ur.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(ur => ur.RolUsuario)
                .WithMany(r => r.UsuarioRoles)
                .HasForeignKey(ur => ur.RolUsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureCliente(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("CLIENTE");

            entity.HasIndex(c => c.ClienteResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Cliente_ClienteResourceId");

            entity.HasIndex(c => new { c.RolCliente, c.Activo, c.Nombre })
                .HasDatabaseName("ix_Cliente_RolCliente_Activo_Nombre");

            entity.Property(c => c.ClienteResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(c => c.Nombre)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(c => c.RolCliente)
                .HasConversion<string>()
                .HasColumnType("enum('ORIGEN','DESTINO','AMBOS')")
                .IsRequired();

            entity.Property(c => c.Telefono)
                .HasMaxLength(30);

            entity.Property(c => c.Correo)
                .HasMaxLength(120);

            entity.Property(c => c.Direccion)
                .HasMaxLength(250);

            entity.Property(c => c.Activo)
                .HasColumnType("tinyint")
                .HasDefaultValue(true)
                .IsRequired();
        });
    }

    private static void ConfigureBodega(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bodega>(entity =>
        {
            entity.ToTable("BODEGA");

            entity.HasIndex(b => b.BodegaResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Bodega_BodegaResourceId");

            entity.HasIndex(b => b.Codigo)
                .IsUnique()
                .HasDatabaseName("UQ_Bodega_Codigo");

            entity.Property(b => b.BodegaResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(b => b.Codigo)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(b => b.Nombre)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(b => b.Descripcion)
                .HasMaxLength(255);

            entity.HasMany(b => b.Pasillos)
                .WithOne(p => p.Bodega)
                .HasForeignKey(p => p.BodegaId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigurePasillo(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pasillo>(entity =>
        {
            entity.ToTable("PASILLO");

            entity.HasIndex(p => p.PasilloResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Pasillo_PasilloResourceId");

            entity.HasIndex(p => new { p.BodegaId, p.Codigo })
                .IsUnique()
                .HasDatabaseName("UQ_Pasillo_Bodega_Codigo");

            entity.Property(p => p.PasilloResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(p => p.Codigo)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(p => p.Descripcion)
                .HasMaxLength(255);

            entity.HasOne(p => p.Bodega)
                .WithMany(b => b.Pasillos)
                .HasForeignKey(p => p.BodegaId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(p => p.Estantes)
                .WithOne(e => e.Pasillo)
                .HasForeignKey(e => e.PasilloId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureEstante(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Estante>(entity =>
        {
            entity.ToTable("ESTANTE");

            entity.HasIndex(e => e.EstanteResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Estante_EstanteResourceId");

            entity.HasIndex(e => new { e.PasilloId, e.Codigo })
                .IsUnique()
                .HasDatabaseName("UQ_Estante_Pasillo_Codigo");

            entity.Property(e => e.EstanteResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(e => e.Codigo)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Descripcion)
                .HasMaxLength(255);

            entity.HasOne(e => e.Pasillo)
                .WithMany(p => p.Estantes)
                .HasForeignKey(e => e.PasilloId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Ubicacion)
                .WithOne(u => u.Estante)
                .HasForeignKey<Ubicacion>(u => u.EstanteId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureUbicacion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ubicacion>(entity =>
        {
            entity.ToTable("UBICACION");

            entity.HasIndex(u => u.UbicacionResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Ubicacion_UbicacionResourceId");

            entity.HasIndex(u => u.EstanteId)
                .IsUnique()
                .HasDatabaseName("UQ_Ubicacion_Estante");

            entity.Property(u => u.UbicacionResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.HasOne(u => u.Estante)
                .WithOne(e => e.Ubicacion)
                .HasForeignKey<Ubicacion>(u => u.EstanteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(u => u.Productos)
                .WithOne(p => p.Ubicacion)
                .HasForeignKey(p => p.UbicacionId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureProducto(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Producto>(entity =>
        {
            entity.ToTable("PRODUCTO");

            entity.HasIndex(p => p.ProductoResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Producto_ProductoResourceId");

            entity.HasIndex(p => p.Codigo)
                .IsUnique()
                .HasDatabaseName("UQ_Producto_Codigo");

            entity.HasIndex(p => new { p.Activo, p.Nombre })
                .HasDatabaseName("ix_Producto_Activo_Nombre");

            entity.HasIndex(p => new { p.Activo, p.CantidadInventario })
                .HasDatabaseName("ix_Producto_Activo_CantidadInventario");

            entity.Property(p => p.ProductoResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(p => p.Codigo)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(p => p.Nombre)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(p => p.Detalle)
                .HasMaxLength(255);

            entity.Property(p => p.StockCritico)
                .IsRequired();

            entity.Property(p => p.CantidadInventario)
                .HasDefaultValue(0)
                .IsRequired();

            entity.Property(p => p.Activo)
                .HasColumnType("tinyint")
                .HasDefaultValue(true)
                .IsRequired();

            entity.HasOne(p => p.Ubicacion)
                .WithMany(u => u.Productos)
                .HasForeignKey(p => p.UbicacionId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureRecepcion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recepcion>(entity =>
        {
            entity.ToTable("RECEPCION");

            entity.HasIndex(r => r.RecepcionResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Recepcion_RecepcionResourceId");

            entity.HasIndex(r => new { r.ProductoId, r.FechaRecepcion })
                .HasDatabaseName("ix_Recepcion_Producto_FechaRecepcion");

            entity.Property(r => r.RecepcionResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(r => r.NumeroLote)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(r => r.Cantidad)
                .IsRequired();

            entity.Property(r => r.FechaRecepcion)
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();

            entity.HasOne(r => r.Cliente)
                .WithMany(c => c.Recepciones)
                .HasForeignKey(r => r.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Producto)
                .WithMany(p => p.Recepciones)
                .HasForeignKey(r => r.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Usuario)
                .WithMany(u => u.Recepciones)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureDespacho(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Despacho>(entity =>
        {
            entity.ToTable("DESPACHO");

            entity.HasIndex(d => d.DespachoResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_Despacho_DespachoResourceId");

            entity.HasIndex(d => new { d.ClienteId, d.FechaDespacho })
                .HasDatabaseName("ix_Despacho_Cliente_FechaDespacho");

            entity.Property(d => d.DespachoResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(d => d.FechaDespacho)
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();

            entity.Property(d => d.Estado)
                .HasConversion<string>()
                .HasColumnType("enum('PENDIENTE','PROCESADO','CANCELADO')")
                .HasDefaultValueSql("'PENDIENTE'")
                .IsRequired();

            entity.HasOne(d => d.Cliente)
                .WithMany(c => c.Despachos)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Usuario)
                .WithMany(u => u.Despachos)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureDespachoCarrito(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DespachoCarrito>(entity =>
        {
            entity.ToTable("DESPACHO_CARRITO");

            entity.HasIndex(dc => dc.CarritoResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_DespachoCarrito_CarritoResourceId");

            entity.HasIndex(dc => new { dc.DespachoId, dc.ProductoId })
                .IsUnique()
                .HasDatabaseName("UQ_DespachoCarrito_Despacho_Producto");

            entity.Property(dc => dc.CarritoResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(dc => dc.CantidadSolicitada)
                .IsRequired();

            entity.HasOne(dc => dc.Despacho)
                .WithMany(d => d.DespachoCarritos)
                .HasForeignKey(dc => dc.DespachoId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(dc => dc.Producto)
                .WithMany(p => p.DespachoCarritos)
                .HasForeignKey(dc => dc.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureDespachoDetalle(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DespachoDetalle>(entity =>
        {
            entity.ToTable("DESPACHO_DETALLE");

            entity.HasIndex(dd => dd.DetalleResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_DespachoDetalle_DetalleResourceId");

            entity.HasIndex(dd => new { dd.DespachoId, dd.ProductoId })
                .IsUnique()
                .HasDatabaseName("UQ_DespachoDetalle_Despacho_Producto");

            entity.Property(dd => dd.DetalleResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(dd => dd.CantidadDespachada)
                .IsRequired();

            entity.HasOne(dd => dd.Despacho)
                .WithMany(d => d.DespachoDetalles)
                .HasForeignKey(dd => dd.DespachoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(dd => dd.Producto)
                .WithMany(p => p.DespachoDetalles)
                .HasForeignKey(dd => dd.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureAuditoriaProducto(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditoriaProducto>(entity =>
        {
            entity.ToTable("AUDITORIA_PRODUCTO");

            entity.HasIndex(a => a.AuditoriaResourceId)
                .IsUnique()
                .HasDatabaseName("UQ_AuditoriaProducto_AuditoriaResourceId");

            entity.HasIndex(a => new { a.ProductoId, a.FechaCambio })
                .HasDatabaseName("ix_AuditoriaProducto_Producto_FechaCambio");

            entity.HasIndex(a => new { a.UsuarioId, a.FechaCambio })
                .HasDatabaseName("ix_AuditoriaProducto_Usuario_FechaCambio");

            entity.Property(a => a.AuditoriaResourceId)
                .HasColumnType("char(36)")
                .HasDefaultValueSql("(UUID())");

            entity.Property(a => a.FechaCambio)
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();

            entity.Property(a => a.CantidadAnterior)
                .IsRequired();

            entity.Property(a => a.CantidadNueva)
                .IsRequired();

            entity.Property(a => a.TipoMovimiento)
                .HasConversion<string>()
                .HasColumnType("enum('INCREMENTO','REDUCCION')")
                .IsRequired();

            entity.HasOne(a => a.Producto)
                .WithMany(p => p.AuditoriasProducto)
                .HasForeignKey(a => a.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Usuario)
                .WithMany(u => u.AuditoriasProducto)
                .HasForeignKey(a => a.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
