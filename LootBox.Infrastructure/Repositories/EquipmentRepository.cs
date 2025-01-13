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

        public async Task<List<Equipment>> GetEquipmentsByIdsAsync(List<int> equipmentIds, int userId)
        {
            return await _dbContext.Equipments
                .Include(e => e.Item)
                .Where(e => equipmentIds.Contains(e.Id) && e.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Item>> GetItemsByRarityIdAsync(int rarityId)
        {
            return await _dbContext.Items.Where(i => i.RarityId == rarityId).ToListAsync();
        }

        public async Task RemoveEquipmentsAsync(List<int> equipmentIds)
        {
            var equipments = await _dbContext.Equipments.Where(e => equipmentIds.Contains(e.Id)).ToListAsync();
            _dbContext.Equipments.RemoveRange(equipments);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddEquipmentAsync(Equipment equipment)
        {
            await _dbContext.Equipments.AddAsync(equipment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Equipment> GetEquipmentByUserAndItemId(int userId, int itemId)
        {
            return await _dbContext.Equipments
                .Include(e => e.Item)
                .FirstOrDefaultAsync(e => e.UserId == userId && e.ItemId == itemId);
        }

        public async Task<Equipment> GetEquipemntByUserAndEquipemntId(int userId, int equipmentId)
        {
            return await _dbContext.Equipments
                .Include(e => e.Item)
                .FirstOrDefaultAsync(e => e.UserId == userId && e.Id == equipmentId);
        }

    }
}
