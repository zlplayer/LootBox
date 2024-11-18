using LootBox.Domain.Entities;
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
        public DbSet<Case> Cases { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<TypeItem> TypeItems { get; set; }
        public DbSet<CaseAndItem> CaseAndItems { get; set; }
        public DbSet<Rarity> Rarities { get; set; }
        public DbSet<WearRating> WearRatings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Equipment> Equipments { get; set; }

        public LootBoxDbContext(DbContextOptions<LootBoxDbContext> options) : base(options)
        {
        }
    }
}
