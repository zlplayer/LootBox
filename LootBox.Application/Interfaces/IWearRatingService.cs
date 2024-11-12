using LootBox.Application.Dtos;

namespace LootBox.Application.Interfaces
{
    public interface IWearRatingService
    {
        Task Create(WearRatingDto wearRating);
        Task Delete(int id);
        Task<IEnumerable<WearRatingDto>> GetAllWearRating();
        Task<WearRatingDto> GetWearRatingById(int id);
        Task Update(int id, WearRatingDto wearRating);
    }
}