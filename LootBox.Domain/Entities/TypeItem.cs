using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class TypeItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Item> Items { get; set; }
    }
}
