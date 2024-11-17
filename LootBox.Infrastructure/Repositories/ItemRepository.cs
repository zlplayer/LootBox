﻿using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public ItemRepository(LootBoxDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Create(Item item)
        {
            await _dbContext.AddAsync(item);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Item>> GetAllItem() => await _dbContext.Items.Include(x=>x.TypeItem).Include(x=>x.Rarity).Include(x=>x.WearRating).ToListAsync();

        public async Task<Item> GetItemById(int id) => await _dbContext.Items.Include(x => x.TypeItem).Include(x => x.Rarity).Include(x => x.WearRating).FirstOrDefaultAsync(x => x.Id == id);

        public async Task<Item> GetItemByIdItem(int id) => await _dbContext.Items.FirstOrDefaultAsync(x => x.Id == id);

        public async Task Update(Item item)
        {
            _dbContext.Update(item);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var item = await GetItemById(id);
            _dbContext.Remove(item);
            await _dbContext.SaveChangesAsync();
        }
    }
}