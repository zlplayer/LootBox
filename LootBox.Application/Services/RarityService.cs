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
    public class RarityService : IRarityService
    {
        private readonly IMapper _mapper;
        private readonly IRarityRepository _rarityRepository;
        public RarityService(IMapper mapper, IRarityRepository rarityRepository)
        {
            _mapper = mapper;
            _rarityRepository = rarityRepository;
        }

        public async Task<IEnumerable<RarityDto>> GetAllRarity()
        {
            var rarity = await _rarityRepository.GetAllRarity();
            return _mapper.Map<IEnumerable<RarityDto>>(rarity);
        }

        public async Task<RarityDto> GetRarityById(int id)
        {
            var rarity = await _rarityRepository.GetRarityById(id);

            if (rarity == null)
            {
                throw new NotFoundException("Rarity not found");
            }

            return _mapper.Map<RarityDto>(rarity);
        }

        public async Task Create(RarityDto rarityDto)
        {
            var newRarity = _mapper.Map<Rarity>(rarityDto);
            await _rarityRepository.Create(newRarity);
        }

        public async Task Update(int id, RarityDto rarityDto)
        {
            var rarityToUpdate = await _rarityRepository.GetRarityById(id);

            if (rarityToUpdate == null)
            {
                throw new NotFoundException("Rarity not found");
            }

            var mappedRarity = _mapper.Map(rarityDto, rarityToUpdate);
            await _rarityRepository.Update(mappedRarity);
        }

        public async Task Delete(int id)
        {
            var rarityToDelete = await _rarityRepository.GetRarityById(id);

            if (rarityToDelete == null)
            {
                throw new NotFoundException("Rarity not found");
            }

            await _rarityRepository.Delete(id);
        }
    }
}
