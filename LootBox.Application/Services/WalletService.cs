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
    public class WalletService: IWalletService
    {
        private readonly IWalletRepository _walletRepository;
        private readonly IMapper _mapper;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IItemRepository _itemRepository;

        public WalletService(IWalletRepository walletRepository, IMapper mapper, IEquipmentRepository equipmentRepository, IItemRepository itemRepository) 
        {
            _walletRepository= walletRepository;
            _mapper= mapper;
            _equipmentRepository= equipmentRepository;
            _itemRepository = itemRepository;
        }

        public async Task<int> CreateWallet(WalletDto walletDto)
        {
            var newWallet= _mapper.Map<Wallet>(walletDto); 
            await _walletRepository.CreateWallet(newWallet);
            return newWallet.id;

        }

        public async Task<WalletDto> GetWalletByUserId(int userId)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found");
            }
            return _mapper.Map<WalletDto>(wallet);
        }

        public async Task AddMoney(int userId, float money)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new Exception($"Wallet not found for UserId: {userId}");
            }

            wallet.Money += money;

            await _walletRepository.UpdateWallet(wallet);
        }

        public async Task UpdateWallet(int userId, float price)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found");
            }
            wallet.Money -= price;
            await _walletRepository.UpdateWallet(wallet);
        }

        public async Task SellItem(int userId, int itemId)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found");
            }

            var item = await _itemRepository.GetItemByIdItem(itemId);
            if (item == null)
            {
                throw new Exception("Item not found in user's equipment");
            }


            wallet.Money += item.Price;
            await _walletRepository.UpdateWallet(wallet);

        }

    }
}
