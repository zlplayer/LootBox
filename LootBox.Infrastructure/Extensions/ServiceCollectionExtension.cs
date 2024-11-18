using LootBox.Domain.Interfaces;
using LootBox.Infrastructure.Repositories;
using LootBox.Infrastructure.Seeders;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
           services.AddDbContext<LootBoxDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("LootBoxDbContext")));

            services.AddScoped<LootBoxSeeder>();
            services.AddScoped<ICaseRepository, CaseRepository>();
            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<ITypeItemRepository, TypeItemRepository>();
            services.AddScoped<IWearRatingRepository, WearRatingRepository>();
            services.AddScoped<IRarityRepository, RarityRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IEquipmentRepository, EquipmentRepository>();

        }
    }
}
