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
    public class WearRatingRepository: IWearRatingRepository
    {
        private readonly LootBoxDbContext _dbContext;

        public WearRatingRepository(LootBoxDbContext dbContext)
        {
            _dbContext=dbContext;
        }

        public async Task<IEnumerable<WearRating>> GetAllWearRating() => await _dbContext.WearRatings.ToListAsync();

        public async Task<WearRating> GetWearRatingById(int id)=> await _dbContext.WearRatings.FirstOrDefaultAsync(x=>x.Id== id);

        public async Task Create(WearRating wearRating)
        {
            await _dbContext.AddAsync(wearRating);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update(WearRating wearRating)
        {
            _dbContext.Update(wearRating);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var wearRating = await GetWearRatingById(id);
            _dbContext.Remove(wearRating);
            await _dbContext.SaveChangesAsync();
        }
    }
}
