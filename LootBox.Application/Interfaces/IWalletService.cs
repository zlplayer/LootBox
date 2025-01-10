using LootBox.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Interfaces
{
    public interface IWalletService
    {
        Task<int> CreateWallet(WalletDto walletDto);
        Task<WalletDto> GetWalletByUserId(int userId);
        Task AddMoney(int userId, float money);
        Task UpdateWallet(int userId, float price);
    }
}
