using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IRarityRepository
    {
        Task Create(Rarity rarity);
        Task<IEnumerable<Rarity>> GetAllRarity();
        Task<Rarity> GetRarityById(int id);
        Task Update(Rarity rarity);
        Task Delete(int id);
        Task<Rarity> GetHigherRarityAsync(int currentRarityId);
    }
}
