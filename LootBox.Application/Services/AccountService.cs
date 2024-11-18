using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Domain.Entities;
using LootBox.Domain.Exceptions;
using LootBox.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepository _accountRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly AuthenticationSettings _authenticationSettings;
        public AccountService(IMapper mapper, IAccountRepository accountRepository, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings)
        {
            _mapper = mapper;
            _accountRepository = accountRepository;
            _passwordHasher = passwordHasher;
            _authenticationSettings = authenticationSettings;
        }

        public async Task RegisterUser(RegisterUserDto registerUserDto)
        {
            var newUser = _mapper.Map<User>(registerUserDto);
            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, registerUserDto.Password);
            await _accountRepository.RegisterUser(newUser);
        }

        public async Task<string> GenerateJwt(LoginDto loginDto)
        {
            var user = await _accountRepository.GetUserByEmail(loginDto.Email);
            if (user == null)
            {
                throw new BadRequestException("błędne hasło lub login");
            }
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new BadRequestException("błędne hasło lub login");
            }

            // Generate JWT
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name),
               
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(
                _authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }

        public async Task ChangeRole(int userId, int roleId)
        {
            await _accountRepository.ChangeRole(userId, roleId);
        }

        public async Task UpdateUser(int id,UpdateUserDto user)
        {
            var userToUpdate = await _accountRepository.GetUserById(id);
            if (userToUpdate == null)
            {
                throw new NotFoundException("User not found");
            }

            var mapperUser= _mapper.Map(user, userToUpdate);

            if (!string.IsNullOrEmpty(user.Password) && user.Password == user.ConfirmPassword)
            {
                userToUpdate.PasswordHash = _passwordHasher.HashPassword(userToUpdate, user.Password);
            }
            await _accountRepository.UpdateUser(mapperUser);
        }

        public async Task DeleteUser(int id)
        {
            await _accountRepository.DeleteUser(id);
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var account= await _accountRepository.GetUserById(id);

            return _mapper.Map<UserDto>(account);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var users = await _accountRepository.GetAllUsers();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }
    }
}
