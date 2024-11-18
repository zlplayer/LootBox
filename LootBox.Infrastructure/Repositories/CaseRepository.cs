using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class CaseRepository:ICaseRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public CaseRepository(LootBoxDbContext dbContext) 
        {
            _dbContext = dbContext;
        }
        public async Task Create(Case @case)
        {
            
            await _dbContext.AddAsync(@case);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Case>> GetAllCase()=> await _dbContext.Cases.ToListAsync();
        public async Task<Case> GetCaseById(int id) => await _dbContext.Cases.FirstOrDefaultAsync(x=>x.Id==id);
        public async Task Update(Case @case)
        {
            _dbContext.Update(@case);
            await _dbContext.SaveChangesAsync();
        }
        public async Task Delete(int id)
        {
            var @case = await GetCaseById(id);
            _dbContext.Remove(@case);
            await _dbContext.SaveChangesAsync();
        }



        //Moze do przeniesiena do CaseAndItemRepository
        public async Task AddItemToCase(int caseId, int itemId)
        {
            var caseAndItem = new CaseAndItem
            {
                CaseId = caseId,
                ItemId = itemId
            };

            await _dbContext.CaseAndItems.AddAsync(caseAndItem);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Item>> GetItemsByCaseId(int caseId)=> await _dbContext.Items
        .Where(i => i.CaseAndItems.Any(ci => ci.CaseId == caseId))
        .Include(i => i.TypeItem)
        .Include(i => i.Rarity)
        .Include(i => i.WearRating)
        .ToListAsync();

        public async Task<CaseAndItem> GetItemsByCaseIdAndItemId(int caseId, int itemId) => await _dbContext.CaseAndItems.FirstOrDefaultAsync(x => x.CaseId == caseId && x.ItemId == itemId);

        public async Task DeleteItemInCase(CaseAndItem caseAndItem)
        {
            _dbContext.CaseAndItems.Remove(caseAndItem);
            await _dbContext.SaveChangesAsync();
        }
    }
}
