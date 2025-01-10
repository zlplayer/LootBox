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

        public WalletService(IWalletRepository walletRepository, IMapper mapper) 
        {
            _walletRepository= walletRepository;
            _mapper= mapper;
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
            var walletDto = await GetWalletByUserId(userId);
            if (walletDto == null)
            {
                throw new Exception($"Wallet not found for UserId: {userId}");
            }

            var wallet = _mapper.Map<Wallet>(walletDto);

            wallet.Money += money;
            await _walletRepository.AddMoney(wallet); 
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

    }
}
