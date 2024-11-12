using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface ICaseRepository
    {
        Task Create(Case @case);
        Task<IEnumerable<Case>> GetAllCase();
        Task<Case> GetCaseById(int id);
        Task Update(Case @case);
        Task Delete(int id);


        Task AddItemToCase(int caseId, int itemId);
        Task<IEnumerable<Item>> GetItemsByCaseId(int caseId);
        Task<CaseAndItem> GetItemsByCaseIdAndItemId(int caseId, int itemId);
        Task DeleteItemInCase(CaseAndItem caseAndItem);
    }
}
