using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class ChangePasswordUserDto
    {
        
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
