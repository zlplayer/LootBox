using LootBox.Application.Dtos;
using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Interfaces
{
    public interface IAccountService
    {
        Task RegisterUser(RegisterUserDto registerUserDto);
        Task<string> GenerateJwt(LoginDto loginDto);
        Task ChangeRole(int userId, int roleId);
        Task UpdateUser(int id, UpdateUserDto user);
        Task DeleteUser(int id);
        Task<IEnumerable<UserDto>> GetAllUsers();
        Task<UserDto> GetUserById(int id);

    }
}
