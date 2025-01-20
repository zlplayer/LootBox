using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IItemWithdrawalRepository
    {
        Task AddItemWithdrawalAsync(ItemWithdrawal itemWithdrawal);
        Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalsAsync();
        Task Update(ItemWithdrawal itemWithdrawal);
        Task<ItemWithdrawal> GetItemWithdrawalById(int id);
        Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalByIsAcceptedTrue(int userId);
        Task<IEnumerable<ItemWithdrawal>> GetItemWithdrawalByIsAcceptedFalse(int userId);
        Task<ItemWithdrawal> GetItemWithdrawalByItemAndUserId(int itemId, int userId);


    }
}
