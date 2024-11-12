using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class CreateItemDto
    {
        public string Name { get; set; } = default!;
        public string Image { get; set; } = default!;
        public float Price { get; set; }
        public int RarityId{ get; set; }
        public int TypeItemId { get; set; }
        public int WearRatingId { get; set; }
    }
}
