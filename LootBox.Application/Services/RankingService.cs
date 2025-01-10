using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Services
{
    public class RankingService : IRankingService
    {
        private readonly IRankingRepository _rankingRepository;
        private readonly IMapper _mapper;
        public RankingService(IRankingRepository rankingRepository, IMapper mapper)
        {
            _rankingRepository = rankingRepository;
            _mapper = mapper;
        }

        public async Task<List<UserBestItemDto>> GetTop10UsersWithBestItem()
        {
            var data = await _rankingRepository.GetUsersWithBestItems();

            var result = data.Select(x => new UserBestItemDto
            {
                UserId = x.User.Id,
                UserName = x.User.UserName,
                ItemId = x.BestItem.Item.Id,
                ItemName = x.BestItem.Item.Name,
                ItemImage = x.BestItem.Item.Image,
                ItemPrice = x.BestItem.Item.Price,
                Rarity = x.BestItem.Item.Rarity.Name,
                WearRating = x.BestItem.Item.WearRating.Name,
                TypeItem = x.BestItem.Item.TypeItem.Name,
                AddedDate = x.BestItem.Added
            }).ToList();

            return result;
        }
    }
}
