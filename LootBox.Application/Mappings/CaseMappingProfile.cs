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
            CreateMap<CaseAndItem, CaseAndItemDto>()
           .ForMember(dest => dest.CaseName, opt => opt.MapFrom(src => src.Case.Name))
           .ForMember(dest => dest.CaseImage, opt => opt.MapFrom(src => src.Case.Image))
           .ForMember(dest => dest.CasePrice, opt => opt.MapFrom(src => src.Case.Price));
           


            CreateMap<RegisterUserDto, User>().ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password));
            CreateMap<User, RegisterUserDto>().ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash));


            CreateMap<UpdateUserDto, User>();

            CreateMap<User, UpdateUserDto>();

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<Equipment, EquipmentDto>()
             .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))  // Id z Equipment
             .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Item.Name))  // Name z Item
             .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Item.Image))  // Image z Item
             .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Item.Price))  // Price z Item
             .ForMember(dest => dest.RarityColor, opt => opt.MapFrom(src => src.Item.Rarity.Color))  // Rarity z Item
             .ForMember(dest => dest.WearRatingName, opt => opt.MapFrom(src => src.Item.WearRating.Name))  // WearRating z Item
             .ForMember(dest => dest.TypeItemName, opt => opt.MapFrom(src => src.Item.TypeItem.Name));  // TypeItem z Item;
        }
    }
}
