using LootBox.Application.Dtos;

namespace LootBox.Application.Interfaces
{
    public interface IRarityService
    {
        Task Create(RarityDto rarityDto);
        Task Delete(int id);
        Task<IEnumerable<RarityDto>> GetAllRarity();
        Task<RarityDto> GetRarityById(int id);
        Task Update(int id, RarityDto rarityDto);
    }
}