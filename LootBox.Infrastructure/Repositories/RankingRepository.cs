using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class RankingRepository: IRankingRepository
    {
        private readonly LootBoxDbContext _dbContext;

        public RankingRepository(LootBoxDbContext dbContext)
        {
            _dbContext= dbContext;
        }

        public async Task<List<(User User, Equipment BestItem)>> GetUsersWithBestItems()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var equipmentList = await _dbContext.Equipments
        .Include(e => e.Item)
            .ThenInclude(i => i.Rarity)
        .Include(e => e.Item)
            .ThenInclude(i => i.WearRating)
        .Include(e => e.Item)
            .ThenInclude(i => i.TypeItem)
        .Include(e => e.User)
        .Where(e => e.Added.Month == currentMonth && e.Added.Year == currentYear)
        .ToListAsync();

            // Krok 2: Grupowanie i sortowanie w pamięci
            var result = equipmentList
                .GroupBy(e => e.UserId)
                .Select(g => new
                {
                    User = g.First().User,
                    BestItem = g.OrderByDescending(i => i.Item.Price).FirstOrDefault()
                })
                .OrderByDescending(x => x.BestItem.Item.Price)
                .Take(10)
                .Select(x => (x.User, x.BestItem))
                .ToList();

            // Krok 3: Mapowanie wyników
            return result;
        }
    }
}
