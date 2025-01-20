using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class ItemWithdrawalRepository: IItemWithdrawalRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public ItemWithdrawalRepository(LootBoxDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task AddItemWithdrawalAsync(ItemWithdrawal itemWithdrawal)
        {
            await _dbContext.ItemWithdrawals.AddAsync(itemWithdrawal);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalsAsync()
        {
           var itemWithdrawals = await _dbContext.ItemWithdrawals.Include(iw => iw.Item).Include(iw=>iw.Item.TypeItem).Include(iw => iw.Item.Rarity)
            .Include(iw => iw.Item.WearRating)
                .Include(iw => iw.User).Where(iw=>iw.IsAccepted==false).ToListAsync();
           
           return itemWithdrawals;
        }

        public async Task<ItemWithdrawal> GetItemWithdrawalById(int id)
        {
            var itemWithdrawal = await _dbContext.ItemWithdrawals.FirstOrDefaultAsync(iw => iw.Id == id);
            return itemWithdrawal;
        }

        public async Task Update(ItemWithdrawal itemWithdrawal)
        {
            _dbContext.Update(itemWithdrawal);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalByIsAcceptedFalse(int userId)
        {
            var itemWithdrawals = await _dbContext.ItemWithdrawals.Include(iw => iw.Item).Include(iw => iw.Item.TypeItem).Include(iw => iw.Item.Rarity)
            .Include(iw => iw.Item.WearRating)
                .Include(iw => iw.User).Where(iw => iw.IsAccepted == false && iw.UserId == userId).ToListAsync();
            return itemWithdrawals;
        }

        public async Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalByIsAcceptedTrue(int userId)
        {
            var itemWithdrawals = await _dbContext.ItemWithdrawals.Include(iw => iw.Item).Include(iw => iw.Item.TypeItem).Include(iw => iw.Item.Rarity)
            .Include(iw => iw.Item.WearRating)
                .Include(iw => iw.User).Where(iw => iw.IsAccepted == true && iw.UserId==userId).ToListAsync();
            return itemWithdrawals;
        }
        public async Task<ItemWithdrawal> GetItemWithdrawalByItemAndUserId(int itemId, int userId)
        {
            return await _dbContext.ItemWithdrawals
                .FirstOrDefaultAsync(iw => iw.ItemId == itemId && iw.UserId == userId);
        }
    }
}
