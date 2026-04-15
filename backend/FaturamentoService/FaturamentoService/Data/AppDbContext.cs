using Microsoft.EntityFrameworkCore;
using FaturamentoService.Models;

namespace FaturamentoService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Nota> Notas { get; set; }
    public DbSet<ItemNota> ItensNota { get; set; }
}