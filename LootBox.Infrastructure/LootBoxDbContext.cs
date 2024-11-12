using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure
{
    public class LootBoxDbContext : DbContext
    {
        public DbSet<Domain.Entities.Case> Cases { get; set; }
        public DbSet<Domain.Entities.Item> Items { get; set; }
        public DbSet<Domain.Entities.TypeItem> TypeItems { get; set; }
        public DbSet<Domain.Entities.CaseAndItem> CaseAndItems { get; set; }
        public DbSet<Domain.Entities.Rarity> Rarities { get; set; }
        public DbSet<Domain.Entities.WearRating> WearRatings { get; set; }

        public LootBoxDbContext(DbContextOptions<LootBoxDbContext> options) : base(options)
        {
        }
    }
}
