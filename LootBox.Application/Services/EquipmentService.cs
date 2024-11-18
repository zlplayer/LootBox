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
        public EquipmentService(IMapper mapper, IEquipmentRepository equipmentRepository)
        {
            _mapper = mapper;
            _equipmentRepository = equipmentRepository;
        }

        public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentUser(int id)
        {
            var equipments = await _equipmentRepository.GetAllEquipmentUser(id);
            return _mapper.Map<IEnumerable<EquipmentDto>>(equipments);
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
    }
}
