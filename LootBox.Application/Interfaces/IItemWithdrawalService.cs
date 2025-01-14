using LootBox.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Interfaces
{
    public interface IItemWithdrawalService
    {
        Task AddItemWithdrawalAsync(int userId, int equipmentId);
        Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalsAsync();
        Task UpdateItemWithdrawalAsync(int id);
        Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalByIsAcceptedTrue(int userId);
        Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalByIsAcceptedFalse(int userId);
    }
}
