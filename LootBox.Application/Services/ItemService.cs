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
    public class ItemService : IItemService
    {
        private readonly IMapper _mapper;
        private readonly IItemRepository _itemRespository;
        public ItemService(IMapper mapper, IItemRepository itemRespository)
        {
            _mapper = mapper;
            _itemRespository = itemRespository;
        }

        public async Task<IEnumerable<ItemDto>> GetAllItem()
        {
            var item = await _itemRespository.GetAllItem();
            return _mapper.Map<IEnumerable<ItemDto>>(item);
        }

        public async Task<ItemDto> GetItemById(int id)
        {
            var item = await _itemRespository.GetItemById(id);

            if (item == null)
            {
                throw new NotFoundException("Item not found");
            }

            return _mapper.Map<ItemDto>(item);
        }

        public async Task Create(CreateItemDto itemDto)
        {
            var newItem = _mapper.Map<Item>(itemDto);
            await _itemRespository.Create(newItem);
        }

        public async Task Update(int id, UpdateItemDto itemDto)
        {
            var itemToUpdate = await _itemRespository.GetItemByIdItem(id);

            if (itemToUpdate == null)
            {
                throw new NotFoundException("Item not found");
            }

            var mappedItem = _mapper.Map(itemDto, itemToUpdate);
            await _itemRespository.Update(mappedItem);
        }

        public async Task Delete(int id)
        {
            await _itemRespository.Delete(id);
        }
    }
}
