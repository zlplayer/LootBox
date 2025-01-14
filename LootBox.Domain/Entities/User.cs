using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? TradeLink { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public IEnumerable<Equipment> Equipments { get; set; } = new List<Equipment>();

        [ForeignKey("Wallet")]
        public int? WalletId { get; set; }
        public Wallet Wallet { get; set; }

    }
}
