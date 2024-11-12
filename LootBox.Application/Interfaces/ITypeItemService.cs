using LootBox.Application.Dtos;

namespace LootBox.Application.Interfaces
{
    public interface ITypeItemService
    {
        Task Create(TypeItemDto typeItemDto);
        Task Delete(int id);
        Task<IEnumerable<TypeItemDto>> GetAllTypeItem();
        Task<TypeItemDto> GetTypeItemById(int id);
        Task Update(int id, TypeItemDto typeItemDto);
    }
}