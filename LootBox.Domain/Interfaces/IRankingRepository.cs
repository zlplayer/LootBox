using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IRankingRepository
    {
        Task<List<(User User, Equipment BestItem)>> GetUsersWithBestItems();
    }
}
