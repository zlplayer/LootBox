using FluentValidation;
using FluentValidation.AspNetCore;
using LootBox.Application.Dtos;
using LootBox.Application.Interfaces;
using LootBox.Application.Mappings;
using LootBox.Application.Middleware;
using LootBox.Application.Services;
using LootBox.Application.Validators;
using LootBox.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            var authewnticationSettings = new AuthenticationSettings();
            configuration.GetSection("Authentication").Bind(authewnticationSettings);
            
            services.AddSingleton(authewnticationSettings);
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authewnticationSettings.JwtIssuer,
                    ValidAudience = authewnticationSettings.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authewnticationSettings.JwtKey))
                };

            });

                services.AddSingleton<Random>();
            services.AddScoped<ICaseService, CaseService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddAutoMapper(typeof(CaseMappingProfile));
            services.AddScoped<ITypeItemService, TypeItemService>();
            services.AddScoped<IWearRatingService, WearRatingService>();
            services.AddScoped<IRarityService, RarityService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IWalletService, WalletService>();
            services.AddScoped<IRankingService, RankingService>();
            services.AddScoped<IContractService, ContractService>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
            //services.AddScoped<IValidator<ChangePasswordUserDto>, ChangePasswordUserDtoValidator>();
            //services.AddScoped<IValidator<UpdateUserDto>, UpdateUserValidatorDto>();
            services.AddControllers().AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssemblyContaining<RegisterUserDtoValidator>();
                //fv.RegisterValidatorsFromAssemblyContaining<ChangePasswordUserDtoValidator>();
                //fv.RegisterValidatorsFromAssemblyContaining<UpdateUserValidatorDto>();

            });

            services.AddScoped<IEquipmentService, EquipmentService>();

            
        }
    }
}
