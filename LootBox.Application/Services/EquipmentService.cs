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
    public class EquipmentService : IEquipmentService
    {
        private readonly IMapper _mapper;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IWalletRepository _walletRepository;
        public EquipmentService(IMapper mapper, IEquipmentRepository equipmentRepository, IWalletRepository walletRepository)
        {
            _mapper = mapper;
            _equipmentRepository = equipmentRepository;
            _walletRepository = walletRepository;
        }

        public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentUser(int userId)
        {
            // Pobieramy dane Equipment z repozytorium
            var equipments = await _equipmentRepository.GetAllEquipmentUser(userId);
            var equipmentDtos = _mapper.Map<IEnumerable<EquipmentDto>>(equipments);

            Console.WriteLine($"Mapped {equipmentDtos.Count()} equipment items.");

            return equipmentDtos;


        }


        public async Task<EquipmentDto> GetEquipmentById(int id)
        {
            var equipment = await _equipmentRepository.GetEquipmentById(id);
            return _mapper.Map<EquipmentDto>(equipment);
        }

        public async Task Create(int itemId, int userId)
        {
           await _equipmentRepository.Create(itemId, userId);
        }

        public async Task Delete(int id)
        {
            var findEquipment = await _equipmentRepository.GetEquipmentById(id);
            if (findEquipment == null)
            {
                throw new Exception("Equipment not found");
            }
            await _equipmentRepository.Delete(id);
        }

        public async Task SellItem(int userId, int equipmentId)
        {
            var wallet = await _walletRepository.GetWalletByUserId(userId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found");
            }

            var equipment = await _equipmentRepository.GetEquipemntByUserAndEquipemntId(userId, equipmentId);
            if (equipment == null)
            {
                throw new Exception("Item not found in user's equipment");
            }

            var item = equipment.Item;

            wallet.Money += item.Price;
            await _walletRepository.UpdateWallet(wallet);

            await _equipmentRepository.Delete(equipment.Id);
        }
    }
}
