﻿using LootBox.Application.Dtos;
using LootBox.Domain.Entities;


namespace LootBox.Application.Interfaces
{
    public interface ICaseService
    {
        Task Create(CaseDto caseDto);
        Task<IEnumerable<CaseDto>> GetAllCase();
        Task<CaseDto> GetCaseById(int id);
        Task Update(int id, CaseDto caseDto);
        Task Delete(int id);

        Task AddItemToCase(int caseId, int itemId);
        Task<IEnumerable<ItemDto>> GetItemsByCaseId(int caseId);
        Task DeleteItemInCase(int caseId, int itemId);
        Task<ItemDto> DrawItemFromCase(int caseId);
    }
}