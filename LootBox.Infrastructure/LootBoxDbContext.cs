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
        public DbSet<Wallet> Wallets { get; set; }

        public LootBoxDbContext(DbContextOptions<LootBoxDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Wallet)
                .WithOne(w => w.User)
                .HasForeignKey<Wallet>(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Albo DeleteBehavior.NoAction

            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithOne(u => u.Wallet)
                .HasForeignKey<User>(u => u.WalletId)
                .OnDelete(DeleteBehavior.Restrict); // Albo DeleteBehavior.NoAction

            base.OnModelCreating(modelBuilder);
        }
    }
}
