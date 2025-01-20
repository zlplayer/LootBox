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
    public class ItemWithdrawalService: IItemWithdrawalService
    {
        private readonly IMapper _mapper;
        private readonly IItemWithdrawalRepository _itemWithdrawalRepository;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IAccountRepository _accountRepository;
        public ItemWithdrawalService(IMapper mapper, IItemWithdrawalRepository itemWithdrawalRepository, IEquipmentRepository equipmentRepository, IAccountRepository accountRepository)
        {
            _mapper= mapper;
            _itemWithdrawalRepository = itemWithdrawalRepository;
            _equipmentRepository = equipmentRepository;
            _accountRepository = accountRepository;
        }

        public async Task AddItemWithdrawalAsync(int userId, int equipmentId)
        {
            var user = await _accountRepository.GetUserById(userId);

            if (user.TradeLink == null)
            {
                throw new Exception("Trade link is not set");
            }

            var equipment = await _equipmentRepository.GetEquipemntByUserAndEquipemntId(userId, equipmentId);
            if (equipment == null)
            {
                throw new Exception("Equipment not found");
            }

            var existingWithdrawal = await _itemWithdrawalRepository.GetItemWithdrawalByItemAndUserId(equipment.ItemId, userId);
            if (existingWithdrawal != null)
            {
                throw new Exception("Item is already in withdrawal");
            }

            var itemWithdrawal = new ItemWithdrawal
            {
                ItemId = equipment.ItemId,
                UserId = userId,
                IsAccepted = false,
            };
            await _itemWithdrawalRepository.AddItemWithdrawalAsync(itemWithdrawal);
        }

        public async Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalsAsync()
        {
            var itemWithdrawals = await _itemWithdrawalRepository.GetItemWithdrawalsAsync();
            var itemWithdrawalDtos = _mapper.Map<IEnumerable<ItemWithdrawalDto>>(itemWithdrawals);
            return itemWithdrawalDtos;
        }

        public async Task UpdateItemWithdrawalAsync(int id)
        {
            var itemWithdrawal = await _itemWithdrawalRepository.GetItemWithdrawalById(id);
            itemWithdrawal.IsAccepted = true;
            await _itemWithdrawalRepository.Update(itemWithdrawal);
        }

        public async Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalByIsAcceptedTrue(int userId)
        {
            var itemWithdrawals = await _itemWithdrawalRepository.GetItemWithdrawalByIsAcceptedTrue(userId);
            var itemWithdrawalDtos = _mapper.Map<IEnumerable<ItemWithdrawalDto>>(itemWithdrawals);
            return itemWithdrawalDtos;
        }

        public async Task<IEnumerable<ItemWithdrawalDto>> GetItemWithdrawalByIsAcceptedFalse(int userId)
        {
            var itemWithdrawals = await _itemWithdrawalRepository.GetItemWithdrawalByIsAcceptedFalse(userId);
            var itemWithdrawalDtos = _mapper.Map<IEnumerable<ItemWithdrawalDto>>(itemWithdrawals);
            return itemWithdrawalDtos;
        }
    }
}
