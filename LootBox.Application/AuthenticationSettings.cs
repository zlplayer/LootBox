using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application
{
    public class AuthenticationSettings
    {
        public string JwtKey { get; set; } = default!;
        public int JwtExpireDays { get; set; } = default!;
        public string JwtIssuer { get; set; } = default!;
    }
}
