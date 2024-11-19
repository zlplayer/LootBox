using FluentValidation;
using LootBox.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Validators
{
    public class ChangePasswordUserDtoValidator: AbstractValidator<ChangePasswordUserDto>
    {
        public ChangePasswordUserDtoValidator()
        {
            RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
            RuleFor(x => x.ConfirmPassword).Equal(x => x.NewPassword);
        }
    }
}
