using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IEquipmentRepository
    {
        //Task<IEnumerable<Item>> GetAllEquipmentUser(int id);
        Task<IEnumerable<Equipment>> GetAllEquipmentUser(int userId);
        Task<Equipment> GetEquipmentById(int id);
        Task Create(int itemId, int userId);
        Task Delete(int id);
        Task<List<Equipment>> GetEquipmentsByIdsAsync(List<int> equipmentIds, int userId);
        Task<List<Item>> GetItemsByRarityIdAsync(int rarityId);
        Task RemoveEquipmentsAsync(List<int> equipmentIds);
        Task AddEquipmentAsync(Equipment equipment);
    }
}
