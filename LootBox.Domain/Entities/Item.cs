using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Image { get; set; }

        [ForeignKey("WearRating")]
        public int WearRatingId { get; set; }
        public WearRating WearRating { get; set; }

        [ForeignKey("TypeItem")]
        public int TypeItemId { get; set; }
        public TypeItem TypeItem { get; set; }

        [ForeignKey("Rarity")]
        public int RarityId { get; set; }
        public Rarity Rarity { get; set; }

        public float Price { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public  IEnumerable<CaseAndItem>? CaseAndItems { get; set; }= new List<CaseAndItem>();
        public IEnumerable<Equipment> Equipments { get; set; } = new List<Equipment>();
    }
}
