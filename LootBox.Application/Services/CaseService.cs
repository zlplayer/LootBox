using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using LootBox.Domain.Exceptions;
using LootBox.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Services
{
    public class CaseService : ICaseService
    {
        private readonly IMapper _mapper;
        private readonly ICaseRepository _caseRepository;
        private readonly Random _random = new Random();
        public CaseService(IMapper mapper, ICaseRepository caseRepository, Random random)
        {
            _mapper = mapper;
            _caseRepository = caseRepository;
            _random = random;
        }
        public async Task Create(CaseDto caseDto)
        {
            var newCase= _mapper.Map<Case>(caseDto);
            await _caseRepository.Create(newCase);
        }

        public async Task<IEnumerable<CaseDto>> GetAllCase()
        {
            var cases = await _caseRepository.GetAllCase();
           
            return _mapper.Map<IEnumerable<CaseDto>>(cases);
        }
        public async Task<CaseDto> GetCaseById(int id)
        {
            var @case = await _caseRepository.GetCaseById(id);

            if (@case == null)
            {
                throw new NotFoundException("Case not found");
            }
            
            return _mapper.Map<CaseDto>(@case);
        }
        public async Task Update(int id,CaseDto caseDto)
        {
            var caseToUpdate = await _caseRepository.GetCaseById(id);

            if (caseToUpdate == null)
            {
                throw new NotFoundException("Case not found");
            }
            
            var mappedCase = _mapper.Map(caseDto, caseToUpdate);
            await _caseRepository.Update(mappedCase);
        }
        public async Task Delete(int id)
        {
            await _caseRepository.Delete(id);
        }



        //Moze do przeniesiena do CaseAndItemService
        public async Task AddItemToCase(int caseId, int itemId)
        {
            var @case = await _caseRepository.GetCaseById(caseId);

            if (@case == null)
            {
                throw new NotFoundException("Case not found");
            }

            await _caseRepository.AddItemToCase(caseId, itemId);
        }

        public async Task<IEnumerable<ItemDto>> GetItemsByCaseId(int caseId)
        {
            var items = await _caseRepository.GetItemsByCaseId(caseId);
            return _mapper.Map<IEnumerable<ItemDto>>(items);
        }

        public async Task DeleteItemInCase(int caseId, int itemId)
        {
            var caseAndItem = await _caseRepository.GetItemsByCaseIdAndItemId(caseId, itemId);
            if(caseAndItem is null)
            {
                throw new NotFoundException("Item not found in case");
            }

            await _caseRepository.DeleteItemInCase(caseAndItem);
        }

        public async Task<ItemDto> DrawItemFromCase(int caseId)
        {
            
            var items = await _caseRepository.GetItemsByCaseId(caseId);

            
            if (!items.Any())
            {
                throw new NotFoundException("No items found in the case");
            }

            
            if (items.Count() == 1)
            {
                return _mapper.Map<ItemDto>(items.First());
            }

            
            var availableRarities = items
                .Select(i => i.Rarity)
                .Distinct()
                .OrderBy(r => r.Percent)
                .ToList();

            if (!availableRarities.Any())
            {
                throw new InvalidOperationException("No rarities defined for items in this case");
            }

            var selectedRarity = DrawRarity(availableRarities);
            if (selectedRarity == null)
            {
                throw new InvalidOperationException("Failed to draw a rarity from available rarities");
            }

            var itemsOfSelectedRarity = items.Where(i => i.Rarity.Id == selectedRarity.Id).ToList();
            if (!itemsOfSelectedRarity.Any())
            {
                throw new NotFoundException("No items found for the selected rarity in the case");
            }

            var selectedItem = itemsOfSelectedRarity[_random.Next(itemsOfSelectedRarity.Count)];

            return _mapper.Map<ItemDto>(selectedItem);
        }

        // Funkcja do losowania rzadkości na podstawie procentów
        //private Rarity DrawRarity(IEnumerable<Rarity> rarities)
        //{
        //    float roll = (float)_random.NextDouble() * 100f;
        //    float cumulative = 0f;

        //    foreach (var rarity in rarities.OrderBy(r => r.Percent))
        //    {
        //        cumulative += rarity.Percent;
        //        if (roll <= cumulative)
        //        {
        //            return rarity;
        //        }
        //    }

        //    return null; // Zapasowy powrót, ale nie powinien się zdarzyć
        //}
        public Rarity DrawRarity(List<Rarity> availableRarities)
        {
            var totalPercent = availableRarities.Sum(r => r.Percent);
            var randomValue = _random.NextDouble() * totalPercent;

            var cumulativePercent = 0.0f;
            foreach (var rarity in availableRarities)
            {
                cumulativePercent += rarity.Percent;
                if (randomValue <= cumulativePercent)
                {
                    return rarity;
                }
            }

            throw new InvalidOperationException("Failed to select rarity based on available percentages");
        }

    }
}
