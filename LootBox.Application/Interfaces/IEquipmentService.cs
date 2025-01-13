using LootBox.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Interfaces
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDto>> GetAllEquipmentUser(int id);
        Task<EquipmentDto> GetEquipmentById(int id);
        Task Create(int itemId, int userId);
        Task Delete(int id);
        Task SellItem(int userId, int equipmentId);
    }
}
