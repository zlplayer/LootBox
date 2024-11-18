using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Repositories
{
    public class AccountRepository: IAccountRepository
    {
        private readonly LootBoxDbContext _dbContext;
        public AccountRepository(LootBoxDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task RegisterUser(User user)
        {
            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsers() => await _dbContext.Users.Include(x => x.Role).ToListAsync();
        public async Task<User> GetUserById(int id) => await _dbContext.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.Id == id);

        public async Task<User> GetUserByEmail(string email)=> await _dbContext.Users.Include(x=>x.Role).FirstOrDefaultAsync(x => x.Email == email);

        public async Task DeleteUser(int id)
        {
            var user = await GetUserById(id);
            _dbContext.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateUser(User user)
        {
            _dbContext.Update(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task ChangeRole(int userId, int roleId)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
            user.RoleId = roleId;
            _dbContext.Update(user);
            await _dbContext.SaveChangesAsync();
        }

    }
}
