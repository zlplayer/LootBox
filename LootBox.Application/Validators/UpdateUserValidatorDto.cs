using FluentValidation;
using LootBox.Application.Dtos;
using LootBox.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Validators
{
    public class UpdateUserValidatorDto: AbstractValidator<UpdateUserDto>
    {
        public UpdateUserValidatorDto()
        {
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password);
        }
    }
}
