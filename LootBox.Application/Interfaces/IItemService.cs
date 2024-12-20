﻿using LootBox.Application.Dtos;
using LootBox.Domain.Entities;

namespace LootBox.Application.Interfaces
{
    public interface IItemService
    {
        Task Create(CreateItemDto itemDto);
        Task Delete(int id);
        Task<IEnumerable<ItemDto>> GetAllItem();
        Task<ItemDto> GetItemById(int id);
        Task Update(int id, UpdateItemDto itemDto);
        Task<IEnumerable<CaseAndItemDto>> GetCasesByItemId(int id);
    }
}