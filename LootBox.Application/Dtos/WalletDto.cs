using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class WalletDto
    {
        public int id { get; set; }
        public int UserId { get; set; }
        public float Money { get; set; }
    }
}
