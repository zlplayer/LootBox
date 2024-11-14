using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using LootBox.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepository _accountRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        public AccountService(IMapper mapper, IAccountRepository accountRepository, IPasswordHasher<User> passwordHasher)
        {
            _mapper= mapper;
            _accountRepository = accountRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task RegisterUser(RegisterUserDto registerUserDto)
        {
            var newUser = _mapper.Map<User>(registerUserDto);
            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, registerUserDto.Password);
            await _accountRepository.RegisterUser(newUser);
        }
    }
}
