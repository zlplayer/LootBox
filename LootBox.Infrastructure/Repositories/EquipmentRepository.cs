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
    public class EquipmentRepository: IEquipmentRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public EquipmentRepository(LootBoxDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //public async Task<IEnumerable<Item>>GetAllEquipmentUser(int id) => await _dbContext.Items.Where(i=>i.Equipments.Any(e => e.UserId == id)).Include(i => i.TypeItem).Include(i => i.Rarity).Include(i => i.WearRating).ToListAsync();
        public async Task<IEnumerable<Equipment>> GetAllEquipmentUser(int userId)
        {
            var equipments = await _dbContext.Equipments
        .Where(e => e.UserId == userId)  
        .Include(e => e.Item)  
        .Include(e => e.Item.TypeItem)  
        .Include(e => e.Item.Rarity)  
        .Include(e => e.Item.WearRating)  
        .ToListAsync();

            Console.WriteLine($"Found {equipments.Count} equipment items for user {userId}");
            return equipments;
        }


        public async Task<Equipment> GetEquipmentById(int id) => await _dbContext.Equipments.FirstOrDefaultAsync(x => x.Id == id);
        public async Task Create(int itemId, int userId)
        {
            var equipment = new Equipment
            {
                ItemId = itemId,
                UserId = userId
            };

            await _dbContext.Equipments.AddAsync(equipment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var equipment = await GetEquipmentById(id);
            _dbContext.Remove(equipment);
            await _dbContext.SaveChangesAsync();
        }
    }
}
