using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class Rarity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public float Percent { get; set; }
        public IEnumerable<Item> Items { get; set; }
    }
}
