using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Interfaces
{
    public interface IAccountRepository
    {
        Task RegisterUser(User user);
        Task<User> GetUserByEmail(string email);
        Task ChangeRole(int userId, int roleId);
        Task UpdateUser(User user);
        Task DeleteUser(int id);
        Task<User> GetUserById(int id);
        Task<IEnumerable<User>> GetAllUsers();
        Task ChangePassword(int userId, string newPassword);
    }
}
