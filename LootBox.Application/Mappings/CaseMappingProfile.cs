using AutoMapper;
using LootBox.Application.Dtos;
using LootBox.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Mappings
{
    public class CaseMappingProfile: Profile
    {
        public CaseMappingProfile() {

            CreateMap<CreateCaseDto, Case>();


            CreateMap<CaseDto, Case>();
            CreateMap<Case, CaseDto>();

            CreateMap<Item, ItemDto>()
                .ForMember(m=>m.TypeItemName, opt=>opt.MapFrom(src=>src.TypeItem.Name))
                .ForMember(m=>m.WearRatingName, opt=>opt.MapFrom(src=>src.WearRating.Name))
                .ForMember(m=>m.RarityColor, opt=>opt.MapFrom(src=>src.Rarity.Color));

            CreateMap<CreateItemDto, Item>()
                .ForMember(dest => dest.TypeItemId, opt => opt.MapFrom(src => src.TypeItemId))
                .ForMember(dest => dest.RarityId, opt => opt.MapFrom(src => src.RarityId))
                .ForMember(dest => dest.WearRatingId, opt => opt.MapFrom(src => src.WearRatingId));

            CreateMap<UpdateItemDto, Item>();

            CreateMap<Item, CreateItemDto>();

            CreateMap<WearRating, WearRatingDto>();
            CreateMap<WearRatingDto, WearRating>();

            CreateMap<TypeItem, TypeItemDto>();
            CreateMap<TypeItemDto, TypeItem>();

            CreateMap<Rarity, RarityDto>();
            CreateMap<RarityDto, Rarity>();

            CreateMap<CaseAndItemDto, CaseAndItem>();
            CreateMap<CaseAndItem, CaseAndItemDto>();


            CreateMap<RegisterUserDto, User>().ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password));
            CreateMap<User, RegisterUserDto>().ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash));


            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password));

            CreateMap<User, UpdateUserDto>()
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash));

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<Item, EquipmentDto>().
                ForMember(m => m.RarityColor, opt => opt.MapFrom(src => src.Rarity.Color))
                .ForMember(m => m.TypeItemName, opt => opt.MapFrom(src => src.TypeItem.Name))
                .ForMember(m => m.WearRatingName, opt => opt.MapFrom(src => src.WearRating.Name));
        }
    }
}
