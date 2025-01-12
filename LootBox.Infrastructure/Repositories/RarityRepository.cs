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
    public class RarityRepository: IRarityRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public RarityRepository(LootBoxDbContext dbContext)
        {
            _dbContext = dbContext;   
        }

        public async Task<IEnumerable<Rarity>> GetAllRarity() => await _dbContext.Rarities.ToListAsync();

        public async Task<Rarity> GetRarityById(int id) => await _dbContext.Rarities.FirstOrDefaultAsync(x => x.Id == id);

        public async Task Create(Rarity rarity)
        {
            await _dbContext.AddAsync(rarity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update(Rarity rarity)
        {
            _dbContext.Update(rarity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var rarity = await GetRarityById(id);
            _dbContext.Remove(rarity);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<Rarity> GetHigherRarityAsync(int currentRarityId)
        {
            return await _dbContext.Rarities
                .Where(r => r.Id > currentRarityId)
                .OrderBy(r => r.Id)
                .FirstOrDefaultAsync();
        }
    }
}
