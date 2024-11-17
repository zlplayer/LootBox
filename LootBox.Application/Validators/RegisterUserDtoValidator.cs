using FluentValidation;
using LootBox.Application.Dtos;
using LootBox.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Validators
{
    public class RegisterUserDtoValidator:AbstractValidator<RegisterUserDto>
    {
        public RegisterUserDtoValidator(IAccountRepository accountRepository)
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password);
            RuleFor(x => x.UserName).NotEmpty();

            RuleFor(x=>x.Email).Custom((email, context) =>
            {

                var emailInUse = accountRepository.GetUserByEmail(email);

                if (emailInUse != null)
                {
                    context.AddFailure("Email", "Email is already in use");
                }


            });

        }
    }
}
