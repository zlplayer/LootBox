using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IWalletRepository
    {
        Task CreateWallet(Wallet wallet);
        Task<Wallet> GetWalletByUserId(int userId);
        Task AddMoney(Wallet wallet);
        Task UpdateWallet(Wallet wallet);
    }
}
