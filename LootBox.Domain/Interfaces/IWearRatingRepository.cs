using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IWearRatingRepository
    {
        Task Create(WearRating wearRating);
        Task<IEnumerable<WearRating>> GetAllWearRating();
        Task<WearRating> GetWearRatingById(int id);
        Task Update(WearRating wearRating);
        Task Delete(int id);
    }
}
