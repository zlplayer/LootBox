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
    public class TypeItemService : ITypeItemService
    {
        private readonly IMapper _mapper;
        private readonly ITypeItemRepository _typeItemRepository;
        public TypeItemService(IMapper mapper, ITypeItemRepository typeItemRepository)
        {
            _mapper = mapper;
            _typeItemRepository = typeItemRepository;
        }

        public async Task<IEnumerable<TypeItemDto>> GetAllTypeItem()
        {
            var typeItem = await _typeItemRepository.GetAllTypeItem();
            return _mapper.Map<IEnumerable<TypeItemDto>>(typeItem);
        }

        public async Task<TypeItemDto> GetTypeItemById(int id)
        {
            var typeItem = await _typeItemRepository.GetTypeItemById(id);

            if (typeItem == null)
            {
                throw new NotFoundException("TypeItem not found");
            }

            return _mapper.Map<TypeItemDto>(typeItem);
        }

        public async Task Create(TypeItemDto typeItemDto)
        {
            var newTypeItem = _mapper.Map<TypeItem>(typeItemDto);
            await _typeItemRepository.Create(newTypeItem);
        }

        public async Task Update(int id, TypeItemDto typeItemDto)
        {
            var typeItemToUpdate = await _typeItemRepository.GetTypeItemById(id);

            if (typeItemToUpdate == null)
            {
                throw new NotFoundException("TypeItem not found");
            }

            var mappedTypeItem = _mapper.Map(typeItemDto, typeItemToUpdate);
            await _typeItemRepository.Update(mappedTypeItem);
        }

        public async Task Delete(int id)
        {
            var typeItem = await _typeItemRepository.GetTypeItemById(id);

            if (typeItem == null)
            {
                throw new NotFoundException("TypeItem not found");
            }

            await _typeItemRepository.Delete(typeItem.Id);
        }
    }
}
