using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class Case
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public float Price { get; set; }
        public DateTime CreatedAt { get; set; }=DateTime.Now;
        public DateTime UpdatedAt { get; set; }=DateTime.Now;

        public  IEnumerable<CaseAndItem>? CaseAndItem { get; set; } = new List<CaseAndItem>();
    }
}
