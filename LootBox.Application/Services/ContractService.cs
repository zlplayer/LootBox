using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Services
{
    public class ContractService: IContractService
    {
        private readonly IRarityRepository _rarityRepository;
        private readonly Random _random = new Random();
        private readonly IMapper _mapper;
        private readonly IEquipmentRepository _equipmentRepository;
        public ContractService(IRarityRepository rarityRepository, IMapper mapper, IEquipmentRepository equipmentRepository)
        {
            _rarityRepository = rarityRepository;
            _mapper = mapper;
            _equipmentRepository = equipmentRepository;
        }

        public async Task<ItemDto> ExecuteTradeUpContractAsync(List<int> equipmentIds, int userId)
        {
            if (equipmentIds == null || equipmentIds.Count != 10)
            {
                throw new ArgumentException("Musisz podać dokładnie 10 przedmiotów z ekwipunku.");
            }

            var equipments = await _equipmentRepository.GetEquipmentsByIdsAsync(equipmentIds, userId);

            if (equipments.Count != 10)
            {
                throw new ArgumentException("Nie znaleziono wszystkich przedmiotów w ekwipunku.");
            }

            var rarityId = equipments.First().Item.RarityId;
            if (equipments.Any(e => e.Item.RarityId != rarityId))
            {
                throw new ArgumentException("Wszystkie przedmioty muszą mieć tę samą rzadkość.");
            }

            var higherRarity = await _rarityRepository.GetHigherRarityAsync(rarityId);

            if (higherRarity == null)
            {
                throw new Exception("Nie można znaleźć wyższej rzadkości przedmiotów.");
            }

            var avgWearRatingId = (int)Math.Round(equipments.Average(e => e.Item.WearRatingId));

            var possibleItems = await _equipmentRepository.GetItemsByRarityIdAsync(higherRarity.Id);

            if (!possibleItems.Any())
            {
                throw new Exception("Brak dostępnych przedmiotów o wyższej rzadkości.");
            }

            var selectedItem = possibleItems[_random.Next(possibleItems.Count)];
            selectedItem.WearRatingId = avgWearRatingId;

            await _equipmentRepository.RemoveEquipmentsAsync(equipmentIds);

            var newEquipment = new Equipment
            {
                ItemId = selectedItem.Id,
                UserId = userId,
                Added = DateTime.Now
            };
            await _equipmentRepository.AddEquipmentAsync(newEquipment);

            return _mapper.Map<ItemDto>(selectedItem);
        }
    }
}
