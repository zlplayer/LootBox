﻿using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
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
    }
}
