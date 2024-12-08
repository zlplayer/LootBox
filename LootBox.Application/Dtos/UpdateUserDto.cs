using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class UpdateUserDto
    {
        public string UserName { get; set; } = default!;
        public string Email { get; set; }= default!;
    }
}
