using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IItemRepository
    {
        Task Create(Item item);
        Task<IEnumerable<Item>> GetAllItem();
        Task<Item> GetItemById(int id);
        Task<Item> GetItemByIdItem(int id);
        Task Update(Item item);
        Task Delete(int id);
        Task<IEnumerable<CaseAndItem>> GetCasesByItemId(int id);
        Task<List<Item>> GetItemsByIdsAsync(List<int> itemIds);
        Task<List<Item>> GetItemsByRarityIdAsync(int rarityId);
    }
}
