using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using LootBox.Domain.Exceptions;
using LootBox.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
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
        private readonly IWalletService _walletService;
        private readonly IWalletRepository _walletRepository;
        private readonly IItemRepository _itemRepository;
        public CaseService(IMapper mapper, ICaseRepository caseRepository, Random random, IWalletService walletService, IWalletRepository walletRepository, IItemRepository itemRepository)
        {
            _mapper = mapper;
            _caseRepository = caseRepository;
            _random = random;
            _walletService = walletService;
            _caseRepository = caseRepository;
            _itemRepository= itemRepository;
        }
        public async Task Create(CreateCaseDto caseDto)
        {
            var newCase = _mapper.Map<Case>(caseDto);

            if (caseDto.ImageFile != null)
            {
                newCase.Image = await ConvertFileToBase64Async(caseDto.ImageFile);
            }

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
        public async Task Update(int id,CreateCaseDto caseDto)
        {
            var caseToUpdate = await _caseRepository.GetCaseById(id);

            if (caseToUpdate == null)
            {
                throw new NotFoundException("Case not found");
            }

            if (caseDto.ImageFile != null)
            {
                caseToUpdate.Image = await ConvertFileToBase64Async(caseDto.ImageFile);
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

        public async Task<ItemDto> DrawItemFromCase(int caseId, int userId)
        {
            var items = await _caseRepository.GetItemsByCaseId(caseId);
            if (!items.Any())
            {
                throw new NotFoundException("No items found in the case.");
            }

            var @case = await _caseRepository.GetCaseById(caseId);
            if (@case == null)
            {
                throw new NotFoundException($"Case with ID {caseId} not found.");
            }

            var wallet = await _walletService.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new NotFoundException($"Wallet for user with ID {userId} not found.");
            }

            if (wallet.Money < @case.Price)
            {
                throw new InvalidOperationException("Not enough money in the wallet.");
            }

            if (items.Count() == 1)
            {
                await _walletService.UpdateWallet(userId, @case.Price);
                return _mapper.Map<ItemDto>(items.First());
            }

            
            var availableRarities = items
                .Select(i => i.Rarity)
                .Distinct()
                .OrderBy(r => r.Percent)
                .ToList();

            if (!availableRarities.Any())
            {
                throw new InvalidOperationException("No rarities defined for items in this case.");
            }

            var selectedRarity = DrawRarity(availableRarities);
            if (selectedRarity == null)
            {
                throw new InvalidOperationException("Failed to draw a rarity from available rarities.");
            }

            var itemsOfSelectedRarity = items.Where(i => i.Rarity.Id == selectedRarity.Id).ToList();
            if (!itemsOfSelectedRarity.Any())
            {
                throw new NotFoundException("No items found for the selected rarity in the case.");
            }

            var selectedItem = itemsOfSelectedRarity[_random.Next(itemsOfSelectedRarity.Count)];

            await _walletService.UpdateWallet(userId, @case.Price);

            return _mapper.Map<ItemDto>(selectedItem);
        }

        private Rarity DrawRarity(List<Rarity> availableRarities)
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

        private async Task<string> ConvertFileToBase64Async(IFormFile file)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            return Convert.ToBase64String(memoryStream.ToArray());
        }
    }
}
