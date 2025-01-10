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
    public class WalletRepository : IWalletRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public WalletRepository(LootBoxDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task CreateWallet(Wallet wallet)
        {
            await _dbContext.AddAsync(wallet);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Wallet> GetWalletByUserId(int userId) => await _dbContext.Wallets.FirstOrDefaultAsync(x=>x.UserId==userId);

        public async Task AddMoney(Wallet wallet)
        {
            _dbContext.Update(wallet);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateWallet(Wallet wallet)
        {
            _dbContext.Update(wallet);
            await _dbContext.SaveChangesAsync();
        }
    }
}
