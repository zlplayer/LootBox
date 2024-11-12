using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class TypeItemRepository: ITypeItemRepository
    {
        private readonly LootBoxDbContext _dbContext;

        public TypeItemRepository(LootBoxDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<TypeItem>> GetAllTypeItem() => await _dbContext.TypeItems.ToListAsync();

        public async Task<TypeItem> GetTypeItemById(int id) => await _dbContext.TypeItems.FirstOrDefaultAsync(x => x.Id == id);

        public async Task Create(TypeItem typeItem)
        {
            await _dbContext.AddAsync(typeItem);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Update(TypeItem typeItem)
        {
            _dbContext.Update(typeItem);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var typeItem = await GetTypeItemById(id);
            _dbContext.Remove(typeItem);
            await _dbContext.SaveChangesAsync();
        }
    }

}
