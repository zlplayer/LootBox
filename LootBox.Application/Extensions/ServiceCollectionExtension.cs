using LootBox.Application.Interfaces;
using LootBox.Application.Mappings;
using LootBox.Application.Middleware;
using LootBox.Application.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddSingleton<Random>();
            services.AddScoped<ICaseService, CaseService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddAutoMapper(typeof(CaseMappingProfile));
            services.AddScoped<ITypeItemService, TypeItemService>();
            services.AddScoped<IWearRatingService, WearRatingService>();
            services.AddScoped<IRarityService, RarityService>();
            

        }
    }
}
