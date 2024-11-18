using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class Equipment
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public Item Item { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime Added { get; set; } = DateTime.Now;

    }
}
