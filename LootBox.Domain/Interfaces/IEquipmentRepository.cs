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
        Task<IEnumerable<Item>> GetAllEquipmentUser(int id);
        Task<Equipment> GetEquipmentById(int id);
        Task Create(int itemId, int userId);
        Task Delete(int id);
    }
}
