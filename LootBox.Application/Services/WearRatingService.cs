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
    public class WearRatingService : IWearRatingService
    {
        private readonly IWearRatingRepository _wearRatingRepository;
        private readonly IMapper _mapper;

        public WearRatingService(IWearRatingRepository wearRatingRepository, IMapper mapper)
        {
            _wearRatingRepository = wearRatingRepository;
            _mapper = mapper;
        }

        public async Task Create(WearRatingDto wearRating)
        {
            var newWearRating = _mapper.Map<WearRating>(wearRating);
            await _wearRatingRepository.Create(newWearRating);
        }

        public async Task<IEnumerable<WearRatingDto>> GetAllWearRating()
        {
            var wearRating = await _wearRatingRepository.GetAllWearRating();
            return _mapper.Map<IEnumerable<WearRatingDto>>(wearRating);
        }

        public async Task<WearRatingDto> GetWearRatingById(int id)
        {
            var wearRating = await _wearRatingRepository.GetWearRatingById(id);

            if (wearRating == null)
            {
                throw new Exception("WearRating not found");
            }

            return _mapper.Map<WearRatingDto>(wearRating);
        }

        public async Task Update(int id, WearRatingDto wearRating)
        {
            var wearRatingToUpdate = await _wearRatingRepository.GetWearRatingById(id);

            if (wearRatingToUpdate == null)
            {
                throw new Exception("WearRating not found");
            }

            var mappedWearRating = _mapper.Map(wearRating, wearRatingToUpdate);
            await _wearRatingRepository.Update(mappedWearRating);
        }

        public async Task Delete(int id)
        {
            var wearRating = await _wearRatingRepository.GetWearRatingById(id);

            if (wearRating == null)
            {
                throw new NotFoundException("WearRating not found");
            }

            await _wearRatingRepository.Delete(wearRating.Id);
        }
    }
}
