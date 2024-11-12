using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface ITypeItemRepository
    {
        Task Create(TypeItem typeItem);
        Task<IEnumerable<TypeItem>> GetAllTypeItem();
        Task<TypeItem> GetTypeItemById(int id);
        Task Update(TypeItem typeItem);
        Task Delete(int id);
    }
}
